"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

type PlanningTaskForm = {
  title: string;
  category: string;
  completed: boolean;
};

type CouplePlanResponse = {
  coupleProfile?: {
    eventType?: string | null;
    eventDate?: string | null;
    city?: string | null;
    budget?: number | null;
    style?: string | null;
    guestCount?: number | null;
  } | null;
  planningTasks?: {
    title: string;
    category?: string | null;
    completed?: boolean;
  }[];
  message?: string;
};

const defaultTasks: PlanningTaskForm[] = [
  { title: "Set overall budget", category: "Budget", completed: false },
  { title: "Shortlist preferred venues", category: "Venue", completed: false },
  { title: "Book photographer", category: "Vendors", completed: false },
  { title: "Plan guest list", category: "Guests", completed: false },
  { title: "Review decor style", category: "Design", completed: false },
];

const steps = [
  {
    id: 1,
    title: "Event basics",
    description: "Tell us what kind of celebration you are planning.",
  },
  {
    id: 2,
    title: "Location & style",
    description: "Share the city and overall feel you are envisioning.",
  },
  {
    id: 3,
    title: "Budget & guests",
    description: "Outline your expected spend and guest count.",
  },
  {
    id: 4,
    title: "Planning checklist",
    description: "Adjust your tasks to match your current planning stage.",
  },
  {
    id: 5,
    title: "Review & save",
    description: "Confirm your details and save everything to your dashboard.",
  },
];

function toDateInputValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function CouplePlanPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [step, setStep] = useState(1);
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [tasks, setTasks] = useState<PlanningTaskForm[]>(defaultTasks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (session?.user.role !== "COUPLE") {
      if (session?.user.role === "VENDOR") {
        router.replace("/dashboard/vendor");
        return;
      }

      router.replace("/");
    }
  }, [router, session?.user.role, status]);

  useEffect(() => {
    if (status !== "authenticated" || session?.user.role !== "COUPLE") {
      return;
    }

    let active = true;

    async function loadPlan() {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch("/api/couple/plan", {
          method: "GET",
          cache: "no-store",
        });

        if (response.status === 401) {
          router.replace("/login");
          return;
        }

        const data = (await response.json()) as CouplePlanResponse;

        if (!response.ok) {
          throw new Error(data.message || "Unable to load your planning data.");
        }

        if (!active) {
          return;
        }

        setEventType(data.coupleProfile?.eventType || "");
        setEventDate(toDateInputValue(data.coupleProfile?.eventDate || ""));
        setCity(data.coupleProfile?.city || "");
        setStyle(data.coupleProfile?.style || "");
        setBudget(
          typeof data.coupleProfile?.budget === "number"
            ? String(data.coupleProfile.budget)
            : ""
        );
        setGuestCount(
          typeof data.coupleProfile?.guestCount === "number"
            ? String(data.coupleProfile.guestCount)
            : ""
        );

        const loadedTasks =
          data.planningTasks?.length
            ? data.planningTasks.map((task) => ({
                title: task.title || "",
                category: task.category || "",
                completed: Boolean(task.completed),
              }))
            : defaultTasks;

        setTasks(loadedTasks);
      } catch (error) {
        if (!active) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Unable to load your planning data."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadPlan();

    return () => {
      active = false;
    };
  }, [router, session?.user.role, status]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed).length,
    [tasks]
  );

  function updateTask(index: number, updates: Partial<PlanningTaskForm>) {
    setTasks((currentTasks) =>
      currentTasks.map((task, taskIndex) =>
        taskIndex === index ? { ...task, ...updates } : task
      )
    );
  }

  function addTask() {
    setTasks((currentTasks) => [
      ...currentTasks,
      { title: "", category: "", completed: false },
    ]);
  }

  function removeTask(index: number) {
    setTasks((currentTasks) => currentTasks.filter((_, taskIndex) => taskIndex !== index));
  }

  function nextStep() {
    setStep((currentStep) => Math.min(currentStep + 1, steps.length));
  }

  function previousStep() {
    setStep((currentStep) => Math.max(currentStep - 1, 1));
  }

  async function handleSubmit() {
    try {
      setSaving(true);
      setSubmitError("");
      setSuccessMessage("");

      const response = await fetch("/api/couple/plan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: eventType.trim() || undefined,
          eventDate: eventDate || undefined,
          city: city.trim() || undefined,
          budget: budget ? Number(budget) : undefined,
          style: style.trim() || undefined,
          guestCount: guestCount ? Number(guestCount) : undefined,
          tasks: tasks
            .map((task) => ({
              title: task.title.trim(),
              category: task.category.trim() || undefined,
              completed: task.completed,
            }))
            .filter((task) => task.title),
        }),
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      const data = (await response.json()) as CouplePlanResponse;

      if (!response.ok) {
        throw new Error(data.message || "Unable to save your planning profile.");
      }

      setSuccessMessage("Your planning details have been saved.");
      router.push("/dashboard/couple");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to save your planning profile."
      );
    } finally {
      setSaving(false);
    }
  }

  const reviewItems = [
    { label: "Event type", value: eventType || "Not set" },
    { label: "Event date", value: eventDate || "Not set" },
    { label: "City", value: city || "Not set" },
    { label: "Style", value: style || "Not set" },
    { label: "Budget", value: budget || "Not set" },
    { label: "Guest count", value: guestCount || "Not set" },
    {
      label: "Checklist progress",
      value: `${completedTasks} of ${tasks.length} tasks complete`,
    },
  ];

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && session?.user.role !== "COUPLE")
  ) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <Card>
          <CardContent className="py-12 text-center text-sm text-neutral-600">
            Loading your planning workspace...
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Planning wizard</CardTitle>
            <CardDescription>
              Build your event profile in five guided steps and keep your
              checklist synced with your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.map((wizardStep) => {
              const isActive = wizardStep.id === step;
              const isCompleted = wizardStep.id < step;

              return (
                <div
                  key={wizardStep.id}
                  className={`rounded-2xl border p-4 transition-colors ${
                    isActive
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : isCompleted
                        ? "border-neutral-200 bg-neutral-50"
                        : "border-neutral-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        isActive
                          ? "bg-white text-neutral-900"
                          : isCompleted
                            ? "bg-neutral-900 text-white"
                            : "bg-neutral-100 text-neutral-700"
                      }`}
                    >
                      {wizardStep.id}
                    </div>
                    <div>
                      <p className="font-medium">{wizardStep.title}</p>
                      <p
                        className={`mt-1 text-sm leading-6 ${
                          isActive ? "text-neutral-200" : "text-neutral-600"
                        }`}
                      >
                        {wizardStep.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{steps[step - 1].title}</CardTitle>
            <CardDescription>{steps[step - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 px-4 py-10 text-center text-sm text-neutral-600">
                Loading your planning data...
              </div>
            ) : (
              <>
                {loadError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {loadError}
                  </div>
                ) : null}

                {submitError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {submitError}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                ) : null}

                {step === 1 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="eventType"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Event type
                      </label>
                      <Input
                        id="eventType"
                        value={eventType}
                        onChange={(event) => setEventType(event.target.value)}
                        placeholder="Wedding reception"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="eventDate"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Event date
                      </label>
                      <Input
                        id="eventDate"
                        type="date"
                        value={eventDate}
                        onChange={(event) => setEventDate(event.target.value)}
                      />
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="city"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Preferred city
                      </label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="Lahore"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="style"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Style or aesthetic
                      </label>
                      <Input
                        id="style"
                        value={style}
                        onChange={(event) => setStyle(event.target.value)}
                        placeholder="Classic, modern, garden..."
                      />
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="budget"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Budget
                      </label>
                      <Input
                        id="budget"
                        type="number"
                        min="0"
                        step="1"
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        placeholder="25000"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="guestCount"
                        className="text-sm font-medium text-neutral-700"
                      >
                        Guest count
                      </label>
                      <Input
                        id="guestCount"
                        type="number"
                        min="0"
                        step="1"
                        value={guestCount}
                        onChange={(event) => setGuestCount(event.target.value)}
                        placeholder="180"
                      />
                    </div>
                  </div>
                ) : null}

                {step === 4 ? (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-neutral-900">
                          Checklist items
                        </p>
                        <p className="text-sm text-neutral-600">
                          {completedTasks} of {tasks.length} tasks marked
                          complete.
                        </p>
                      </div>
                      <Button type="button" variant="outline" onClick={addTask}>
                        Add task
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {tasks.map((task, index) => (
                        <div
                          key={`${task.title}-${index}`}
                          className="rounded-2xl border border-neutral-200 p-4"
                        >
                          <div className="grid gap-4 md:grid-cols-[1fr_0.7fr_auto]">
                            <div className="space-y-2">
                              <label
                                htmlFor={`task-title-${index}`}
                                className="text-sm font-medium text-neutral-700"
                              >
                                Task title
                              </label>
                              <Input
                                id={`task-title-${index}`}
                                value={task.title}
                                onChange={(event) =>
                                  updateTask(index, {
                                    title: event.target.value,
                                  })
                                }
                                placeholder="Book your venue"
                              />
                            </div>

                            <div className="space-y-2">
                              <label
                                htmlFor={`task-category-${index}`}
                                className="text-sm font-medium text-neutral-700"
                              >
                                Category
                              </label>
                              <Input
                                id={`task-category-${index}`}
                                value={task.category}
                                onChange={(event) =>
                                  updateTask(index, {
                                    category: event.target.value,
                                  })
                                }
                                placeholder="Venue"
                              />
                            </div>

                            <div className="flex flex-col justify-end gap-3">
                              <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={(event) =>
                                    updateTask(index, {
                                      completed: event.target.checked,
                                    })
                                  }
                                  className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                                />
                                Completed
                              </label>

                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => removeTask(index)}
                                disabled={tasks.length === 1}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {step === 5 ? (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                      <p className="text-sm text-neutral-600">
                        Review your plan before saving. You can always return to
                        update your details later.
                      </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {reviewItems.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-neutral-200 p-4"
                        >
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                            {item.label}
                          </p>
                          <p className="mt-2 text-sm font-medium text-neutral-900">
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-2xl border border-neutral-200 p-4">
                      <p className="text-sm font-medium text-neutral-900">
                        Tasks to save
                      </p>
                      <div className="mt-3 space-y-2">
                        {tasks
                          .filter((task) => task.title.trim())
                          .map((task, index) => (
                            <div
                              key={`${task.title}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-xl bg-neutral-50 px-3 py-2 text-sm"
                            >
                              <span>{task.title}</span>
                              <span className="text-neutral-500">
                                {task.category || "General"} •{" "}
                                {task.completed ? "Complete" : "Pending"}
                              </span>
                            </div>
                          ))}

                        {tasks.filter((task) => task.title.trim()).length === 0 ? (
                          <p className="text-sm text-neutral-600">
                            No custom tasks added yet.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={previousStep}
                    disabled={step === 1 || saving}
                  >
                    Back
                  </Button>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/dashboard/couple")}
                      disabled={saving}
                    >
                      Cancel
                    </Button>

                    {step < steps.length ? (
                      <Button type="button" onClick={nextStep}>
                        Continue
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={saving}
                      >
                        {saving ? "Saving..." : "Save plan"}
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}