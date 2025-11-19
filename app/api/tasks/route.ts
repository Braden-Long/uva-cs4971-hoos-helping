import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { PrismaClient, Prisma } from "@/app/generated/prisma";

const prisma = new PrismaClient();

// GET /api/tasks - Fetch tasks with optional filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const minBudget = searchParams.get("minBudget");
    const maxBudget = searchParams.get("maxBudget");
    const uvaVerified = searchParams.get("uvaVerified");
    const backgroundVerified = searchParams.get("backgroundVerified");
    const status = searchParams.get("status") || "posted";

    // Build filter object
    const where: Prisma.TaskWhereInput = {
      status: status === "posted" ? "open" : status, // Map old "posted" status to "open"
    };

    if (category && category !== "all") {
      where.category = category;
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget.gte = parseFloat(minBudget);
      if (maxBudget) where.budget.lte = parseFloat(maxBudget);
    }

    // Handle verification filters
    if (uvaVerified === "true" || backgroundVerified === "true") {
      where.createdBy = {};
      if (uvaVerified === "true") {
        where.createdBy.isUvaVerified = true;
      }
      if (backgroundVerified === "true") {
        where.createdBy.isBackgroundVerified = true;
      }
    }

    // Fetch tasks with filters
    const tasks = await prisma.task.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isUvaVerified: true,
            isBackgroundVerified: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const {
      title,
      description,
      category,
      location,
      addressLine1,
      addressLine2,
      city,
      state,
      zipCode,
      budget,
      scheduledDate,
      categorySpecificData,
    } = body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !category ||
      !location ||
      budget === undefined
    ) {
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
        category,
        location,
        addressLine1: addressLine1 || null,
        addressLine2: addressLine2 || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        budget: budgetNum,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        categorySpecificData: categorySpecificData || null,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isUvaVerified: true,
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
