/**
 * API Route: Confirm Payment Transfer to Helper
 * POST /api/tasks/[id]/confirm-payment
 *
 * Marks a payment as transferred to the helper and updates their total earnings.
 * In a real production app, this would be triggered by a Stripe webhook when
 * the payment is actually transferred via Stripe Connect.
 *
 * For this demo, we simulate the transfer completion manually.
 *
 * Requirements:
 * - User must be authenticated
 * - User must be the task creator (tasker)
 * - Task must be completed
 * - Payment must be in "pending" or "paid" status
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: taskId } = await params;
    const prisma = new PrismaClient();

    try {
      // Fetch task with creator and helper details
      const task = await prisma.task.findUnique({
        where: { id: taskId },
        include: {
          createdBy: {
            select: { id: true, name: true },
          },
          assignedTo: {
            select: { id: true, name: true, totalEarnings: true },
          },
        },
      });

      if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
      }

      // Verify user is the task creator
      if (task.createdById !== session.user.id) {
        return NextResponse.json(
          { error: "Only the task creator can confirm payment" },
          { status: 403 }
        );
      }

      // Verify task is completed
      if (task.status !== "completed") {
        return NextResponse.json(
          { error: "Payment can only be confirmed for completed tasks" },
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

      // Verify payment is not already transferred
      if (task.paymentStatus === "transferred") {
        return NextResponse.json(
          { error: "Payment has already been transferred" },
          { status: 400 }
        );
      }

      // Update task payment status to "transferred"
      await prisma.task.update({
        where: { id: taskId },
        data: {
          paymentStatus: "transferred",
        },
      });

      // Increment helper's total earnings
      const updatedHelper = await prisma.user.update({
        where: { id: task.assignedTo.id },
        data: {
          totalEarnings: {
            increment: task.budget,
          },
        },
        select: {
          id: true,
          name: true,
          totalEarnings: true,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Payment confirmed and transferred to helper",
        helper: {
          name: updatedHelper.name,
          totalEarnings: updatedHelper.totalEarnings,
        },
        amount: task.budget,
      });
    } finally {
      await prisma.$disconnect();
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to confirm payment",
      },
      { status: 500 }
    );
  }
}
