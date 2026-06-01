import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Blocker } from '@/lib/types';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params;
    const body = await req.json();
    const { updateType, data, steps } = body;

    if (!updateType) {
      return NextResponse.json({ error: 'Missing updateType (client or project)' }, { status: 400 });
    }

    if (updateType === 'client') {
      const clientUpdateData: any = {};
      if (data.name !== undefined) clientUpdateData.name = data.name;
      if (data.company !== undefined) clientUpdateData.company = data.company;
      if (data.email !== undefined) clientUpdateData.email = data.email;
      if (data.phone !== undefined) clientUpdateData.phone = data.phone;
      if (data.projectType !== undefined) clientUpdateData.projectType = data.projectType;
      if (data.offerName !== undefined) clientUpdateData.offerName = data.offerName;
      if (data.isArchived !== undefined) {
        clientUpdateData.isArchived = data.isArchived;
        clientUpdateData.archivedAt = data.isArchived ? new Date() : null;
      }

      const updatedClient = await prisma.client.update({
        where: { id: clientId },
        data: clientUpdateData,
        include: {
          project: {
            include: {
              steps: {
                orderBy: { id: 'asc' },
              },
            },
          },
        },
      });

      return NextResponse.json(updatedClient);
    } else if (updateType === 'project') {
      const projectUpdateData: any = {};
      if (data.quoteAmount !== undefined) projectUpdateData.quoteAmount = Number(data.quoteAmount);
      if (data.amountPaid !== undefined) projectUpdateData.amountPaid = Number(data.amountPaid);
      if (data.currentBlocker !== undefined) projectUpdateData.currentBlocker = data.currentBlocker as Blocker;
      if (data.notes !== undefined) projectUpdateData.notes = data.notes;
      if (data.driveLink !== undefined) projectUpdateData.driveLink = data.driveLink;
      if (data.siteLink !== undefined) projectUpdateData.siteLink = data.siteLink;
      if (data.startDate !== undefined) projectUpdateData.startDate = new Date(data.startDate);
      if (data.endDate !== undefined) projectUpdateData.endDate = new Date(data.endDate);
      if (data.completedAt !== undefined) {
        projectUpdateData.completedAt = data.completedAt ? new Date(data.completedAt) : null;
      }

      // Update project core data & steps transactionally
      const updatedProject = await prisma.$transaction(async (tx) => {
        // If modern steps is supplied, recreate or update them
        if (steps) {
          // Delete existing steps
          await tx.step.deleteMany({
            where: { projectId: clientId },
          });

          // Create new steps
          if (steps.length > 0) {
            await tx.step.createMany({
              data: steps.map((s: any) => ({
                projectId: clientId,
                id: s.id && !s.id.includes('_random_') ? s.id : undefined, // respect existing ID if valid, otherwise let db generate
                label: s.label,
                isCompleted: s.isCompleted,
                completedAt: s.completedAt ? new Date(s.completedAt) : null,
              })),
            });
          }
        }

        return await tx.project.update({
          where: { id: clientId },
          data: projectUpdateData,
          include: {
            steps: {
              orderBy: { id: 'asc' },
            },
          },
        });
      });

      return NextResponse.json(updatedProject);
    }

    return NextResponse.json({ error: 'Invalid updateType. Use client or project.' }, { status: 400 });
  } catch (error: any) {
    console.error('Error in PUT /api/clients/[id]:', error);
    return NextResponse.json({ error: 'Failed to update client details.', details: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params;

    // Database cascade constraint handles removing Project and Steps automatically on Client delete.
    await prisma.client.delete({
      where: { id: clientId },
    });

    return NextResponse.json({ success: true, deletedId: clientId });
  } catch (error: any) {
    console.error('Error in DELETE /api/clients/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete client.', details: error.message }, { status: 500 });
  }
}
