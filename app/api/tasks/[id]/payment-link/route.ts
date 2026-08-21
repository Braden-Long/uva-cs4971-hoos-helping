/**
 * API Route: Create Payment Link for Task
 * POST /api/tasks/[id]/payment-link
 *
 * Creates a Stripe payment link for a completed task.
 * This allows the tasker to pay the helper for their work.
 *
 * Requirements:
 * - User must be authenticated
 * - User must be the task creator (tasker)
 * - Task must be in "completed" status
 * - Task must have an assigned helper
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTaskPaymentLink } from "@/lib/stripe";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: taskId } = await params;
  try {
    // Fetch task with creator and helper details
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        createdBy: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Verify user is the task creator
    if (task.createdById !== session.user.id) {
      return NextResponse.json(
        { error: "Only the task creator can create a payment link" },
        { status: 403 }
      );
    }

    // Verify task is completed
    if (task.status !== "completed") {
      return NextResponse.json(
        { error: "Payment link can only be created for completed tasks" },
        { status: 400 }
      );
    }

    // Verify task has an assigned helper
    if (!task.assignedTo) {
      return NextResponse.json(
        { error: "Task must have an assigned helper" },
        { status: 400 }
      );
    }

    // Create payment link
    const paymentLinkUrl = await createTaskPaymentLink(
      task.id,
      task.title,
      task.description,
      task.budget
    );

    // Update task with payment status
    await prisma.task.update({
      where: { id: taskId },
      data: {
        paymentStatus: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      paymentLinkUrl,
      amount: task.budget,
      helperName: task.assignedTo.name,
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create payment link",
      },
      { status: 500 }
    );
  }
}
