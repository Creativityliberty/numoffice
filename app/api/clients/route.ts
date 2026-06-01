import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Client, Project, Step, Blocker, ProjectType } from '@/lib/types';

// Helper: Convert Prisma models back to types.ts JS timestamp representations
function mapPrismaClientToUI(client: any): any {
  const project = client.project;
  
  let mappedProject: any = null;
  if (project) {
    mappedProject = {
      id: project.id,
      financials: {
        quoteAmount: project.quoteAmount,
        amountPaid: project.amountPaid,
      },
      steps: (project.steps || []).map((step: any) => ({
        id: step.id,
        label: step.label,
        isCompleted: step.isCompleted,
        completedAt: step.completedAt ? new Date(step.completedAt).getTime() : undefined,
      })),
      currentBlocker: project.currentBlocker as Blocker,
      notes: project.notes,
      driveLink: project.driveLink,
      siteLink: project.siteLink,
      startDate: project.startDate ? new Date(project.startDate).getTime() : undefined,
      endDate: project.endDate ? new Date(project.endDate).getTime() : undefined,
      completedAt: project.completedAt ? new Date(project.completedAt).getTime() : undefined,
      updatedAt: project.updatedAt ? new Date(project.updatedAt).getTime() : undefined,
    };
  }

  return {
    id: client.id,
    name: client.name,
    company: client.company,
    email: client.email,
    phone: client.phone,
    projectType: client.projectType as ProjectType,
    offerName: client.offerName,
    createdAt: new Date(client.createdAt).getTime(),
    isArchived: client.isArchived,
    archivedAt: client.archivedAt ? new Date(client.archivedAt).getTime() : undefined,
    project: mappedProject,
  };
}

// GET: Fetch all clients from PostgreSQL
export async function GET() {
  try {
    const dbClients = await prisma.client.findMany({
      include: {
        project: {
          include: {
            steps: {
              orderBy: { id: 'asc' },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const uiClients = dbClients.map(mapPrismaClientToUI);
    return NextResponse.json(uiClients);
  } catch (error: any) {
    console.error('Error in GET /api/clients:', error);
    return NextResponse.json({ error: 'Failed to fetch clients from database.', details: error.message }, { status: 500 });
  }
}

// POST: Direct creation of clients + projects in database (Atomic Transaction)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, name, company, email, phone, projectType, offerName, quoteAmount, amountPaid, steps, startDate, endDate } = body;

    if (!name || !company || !email || !projectType || !offerName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const createdClient = await prisma.$transaction(async (tx) => {
      // 1. Create client
      const client = await tx.client.create({
        data: {
          id: id || undefined,
          name,
          company,
          email,
          phone: phone || '',
          projectType,
          offerName,
        },
      });

      // 2. Create associated project with 1:1 relation
      const startDateTime = startDate ? new Date(startDate) : new Date();
      const endDateTime = endDate ? new Date(endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await tx.project.create({
        data: {
          id: client.id,
          quoteAmount: quoteAmount || 1500,
          amountPaid: amountPaid || 0,
          notes: '',
          driveLink: '',
          siteLink: '',
          startDate: startDateTime,
          endDate: endDateTime,
          steps: {
            create: (steps || []).map((label: string) => ({
              label,
              isCompleted: false,
            })),
          },
        },
      });

      // Fetch complete record
      return await tx.client.findUnique({
        where: { id: client.id },
        include: {
          project: {
            include: {
              steps: true,
            },
          },
        },
      });
    });

    if (!createdClient) {
      throw new Error('Database transaction succeeded but client couldn\'t be loaded');
    }

    return NextResponse.json(mapPrismaClientToUI(createdClient), { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/clients:', error);
    return NextResponse.json({ error: 'Failed to create client in database.', details: error.message }, { status: 500 });
  }
}
