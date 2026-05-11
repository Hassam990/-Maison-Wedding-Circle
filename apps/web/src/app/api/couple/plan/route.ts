import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

type PlanningTaskInput = {
  title: string;
  category?: string;
  completed?: boolean;
};

async function getAuthorizedCoupleProfile() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "COUPLE") {
    return {
      session: null,
      coupleProfile: null,
      unauthorized: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  const coupleProfile = await db.coupleProfile.upsert({
    where: {
      userId: session.user.id,
    },
    update: {},
    create: {
      userId: session.user.id,
    },
  });

  return {
    session,
    coupleProfile,
    unauthorized: null,
  };
}

function normalizeTextField(value: unknown) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  return trimmedValue ? trimmedValue : null;
}

function normalizeNumberField(value: unknown) {
  if (value === null) {
    return null;
  }

  if (typeof value === "undefined") {
    return undefined;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
      return undefined;
    }

    return value;
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return null;
    }

    const parsedNumber = Number(trimmedValue);

    if (
      !Number.isFinite(parsedNumber) ||
      parsedNumber < 0 ||
      !Number.isInteger(parsedNumber)
    ) {
      return undefined;
    }

    return parsedNumber;
  }

  return undefined;
}

function normalizeEventDate(value: unknown) {
  if (value === null) {
    return null;
  }

  if (typeof value === "undefined") {
    return undefined;
  }

  if (typeof value !== "string") {
    return undefined;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedDate = new Date(trimmedValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate;
}

function normalizeTasks(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const tasks = value
    .map((task) => {
      if (!task || typeof task !== "object") {
        return null;
      }

      const currentTask = task as Record<string, unknown>;
      const title =
        typeof currentTask.title === "string" ? currentTask.title.trim() : "";

      if (!title) {
        return null;
      }

      return {
        title,
        category:
          typeof currentTask.category === "string" && currentTask.category.trim()
            ? currentTask.category.trim()
            : undefined,
        completed: Boolean(currentTask.completed),
      } as PlanningTaskInput;
    })
    .filter((task): task is PlanningTaskInput => Boolean(task));

  return tasks;
}

export async function GET() {
  const { coupleProfile, unauthorized } = await getAuthorizedCoupleProfile();

  if (unauthorized) {
    return unauthorized;
  }

  if (!coupleProfile) {
    return NextResponse.json(
      { message: "Couple profile not found." },
      { status: 404 }
    );
  }

  const planningTasks = await db.planningTask.findMany({
    where: {
      coupleId: coupleProfile.id,
    },
    orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({
    coupleProfile,
    planningTasks,
  });
}

export async function PUT(request: NextRequest) {
  const { coupleProfile, unauthorized } = await getAuthorizedCoupleProfile();

  if (unauthorized) {
    return unauthorized;
  }

  if (!coupleProfile) {
    return NextResponse.json(
      { message: "Couple profile not found." },
      { status: 404 }
    );
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;

    const eventDate = normalizeEventDate(body.eventDate);

    if (typeof body.eventDate !== "undefined" && typeof eventDate === "undefined") {
      return NextResponse.json(
        { message: "Invalid event date." },
        { status: 400 }
      );
    }

    const budget = normalizeNumberField(body.budget);

    if (typeof body.budget !== "undefined" && typeof budget === "undefined") {
      return NextResponse.json(
        { message: "Invalid budget." },
        { status: 400 }
      );
    }

    const guestCount = normalizeNumberField(body.guestCount);

    if (
      typeof body.guestCount !== "undefined" &&
      typeof guestCount === "undefined"
    ) {
      return NextResponse.json(
        { message: "Invalid guest count." },
        { status: 400 }
      );
    }

    const tasks = normalizeTasks(body.tasks);

    if (typeof body.tasks !== "undefined" && typeof tasks === "undefined") {
      return NextResponse.json(
        { message: "Invalid planning tasks payload." },
        { status: 400 }
      );
    }

    const result = await db.$transaction(async (tx) => {
      const updatedCoupleProfile = await tx.coupleProfile.update({
        where: {
          id: coupleProfile.id,
        },
        data: {
          eventType: normalizeTextField(body.eventType),
          eventDate,
          city: normalizeTextField(body.city),
          budget,
          style: normalizeTextField(body.style),
          guestCount,
        },
      });

      if (typeof tasks !== "undefined") {
        await tx.planningTask.deleteMany({
          where: {
            coupleId: coupleProfile.id,
          },
        });

        if (tasks.length > 0) {
          await tx.planningTask.createMany({
            data: tasks.map((task) => ({
              coupleId: coupleProfile.id,
              title: task.title,
              category: task.category,
              completed: Boolean(task.completed),
            })),
          });
        }
      }

      const planningTasks = await tx.planningTask.findMany({
        where: {
          coupleId: coupleProfile.id,
        },
        orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
      });

      return {
        coupleProfile: updatedCoupleProfile,
        planningTasks,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to update planning profile.",
      },
      { status: 500 }
    );
  }
}