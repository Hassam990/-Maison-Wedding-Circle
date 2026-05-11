"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

type FeedbackState = {
  type: "success" | "error";
  message: string;
} | null;

async function patchJson(url: string, body: Record<string, unknown>) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? "Request failed");
  }

  return data;
}

function FeedbackMessage({ feedback }: { feedback: FeedbackState }) {
  if (!feedback) {
    return null;
  }

  return (
    <p
      className={
        feedback.type === "success"
          ? "text-xs text-emerald-600"
          : "text-xs text-red-600"
      }
    >
      {feedback.message}
    </p>
  );
}

export function VendorAdminForm({
  vendorId,
  verified,
  plan,
}: {
  vendorId: string;
  verified: boolean;
  plan: string | null;
}) {
  const router = useRouter();
  const [planValue, setPlanValue] = useState(plan ?? "");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isPending, startTransition] = useTransition();

  const actionLabel = verified ? "Unverify" : "Verify";

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        setFeedback(null);

        startTransition(async () => {
          try {
            await patchJson("/api/admin/vendors", {
              vendorId,
              verified: !verified,
              plan: planValue,
            });

            setFeedback({
              type: "success",
              message: "Vendor updated successfully.",
            });
            router.refresh();
          } catch (error) {
            setFeedback({
              type: "error",
              message:
                error instanceof Error ? error.message : "Unable to update vendor.",
            });
          }
        });
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={planValue}
          onChange={(event) => setPlanValue(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-rose-400"
          placeholder="Plan"
          aria-label="Vendor plan"
        />
        <Button type="submit" disabled={isPending} className="sm:w-auto">
          {isPending ? "Saving..." : actionLabel}
        </Button>
      </div>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}

export function ConsultationAdminForm({
  consultationId,
  status,
  notes,
}: {
  consultationId: string;
  status: string | null;
  notes: string | null;
}) {
  const router = useRouter();
  const [statusValue, setStatusValue] = useState(status ?? "New");
  const [notesValue, setNotesValue] = useState(notes ?? "");
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isPending, startTransition] = useTransition();

  const statusOptions = useMemo(() => {
    const baseOptions = ["New", "Contacted", "Scheduled", "Completed", "Closed"];

    if (statusValue && !baseOptions.includes(statusValue)) {
      return [statusValue, ...baseOptions];
    }

    return baseOptions;
  }, [statusValue]);

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        setFeedback(null);

        startTransition(async () => {
          try {
            await patchJson("/api/admin/consultations", {
              consultationId,
              status: statusValue,
              notes: notesValue,
            });

            setFeedback({
              type: "success",
              message: "Consultation updated successfully.",
            });
            router.refresh();
          } catch (error) {
            setFeedback({
              type: "error",
              message:
                error instanceof Error
                  ? error.message
                  : "Unable to update consultation.",
            });
          }
        });
      }}
    >
      <div className="grid gap-2 sm:grid-cols-[minmax(0,160px)_1fr_auto]">
        <select
          value={statusValue}
          onChange={(event) => setStatusValue(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-rose-400"
          aria-label="Consultation status"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          value={notesValue}
          onChange={(event) => setNotesValue(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-rose-400"
          placeholder="Internal notes"
          aria-label="Consultation notes"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}

export function UserRoleForm({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const router = useRouter();
  const [roleValue, setRoleValue] = useState(role);
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [isPending, startTransition] = useTransition();

  const roleOptions = ["GUEST", "COUPLE", "VENDOR", "ADMIN"];

  return (
    <form
      className="space-y-2"
      onSubmit={(event) => {
        event.preventDefault();
        setFeedback(null);

        startTransition(async () => {
          try {
            await patchJson("/api/admin/users", {
              userId,
              role: roleValue,
            });

            setFeedback({
              type: "success",
              message: "User role updated successfully.",
            });
            router.refresh();
          } catch (error) {
            setFeedback({
              type: "error",
              message:
                error instanceof Error ? error.message : "Unable to update role.",
            });
          }
        });
      }}
    >
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={roleValue}
          onChange={(event) => setRoleValue(event.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-rose-400"
          aria-label="User role"
        >
          {roleOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Update"}
        </Button>
      </div>
      <FeedbackMessage feedback={feedback} />
    </form>
  );
}