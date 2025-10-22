import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { title, description, location, budget } = body;

    // Validate required fields
    if (!title || !description || !location || budget === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate budget is a positive number
    const budgetNum = parseFloat(budget);
    if (isNaN(budgetNum) || budgetNum < 0) {
      return NextResponse.json(
        { error: "Budget must be a positive number" },
        { status: 400 }
      );
    }

    // Create the task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        location,
        budget: budgetNum,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
}
