"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type InquiryFormProps = {
  vendorId: string;
  authState: "guest" | "couple" | "other";
};

export default function InquiryForm({ vendorId, authState }: InquiryFormProps) {
  const [message, setMessage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const canSubmit = authState === "couple";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/vendors/${vendorId}/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          eventDate: eventDate || undefined,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to send inquiry.");
      }

      setMessage("");
      setEventDate("");
      setFeedback({
        type: "success",
        message: "Your consultation request has been sent.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to send inquiry.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {feedback ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-rose-200 bg-rose-50 text-rose-700",
          )}
        >
          {feedback.message}
        </div>
      ) : null}

      {authState === "guest" ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-5 py-6 text-sm text-stone-600">
          Please{" "}
          <Link href="/login" className="font-medium text-stone-900 underline-offset-4 hover:underline">
            sign in
          </Link>{" "}
          as a couple to request this vendor through consultation.
        </div>
      ) : authState === "other" ? (
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-5 py-6 text-sm text-stone-600">
          Only couple accounts can request vendors from the marketplace.
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700" htmlFor="eventDate">
            Event date
          </label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            disabled={!canSubmit || submitting}
            onChange={(event) => setEventDate(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-stone-700" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            value={message}
            disabled={!canSubmit || submitting}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell the vendor about your event, style, venue, and what support you need."
            rows={6}
            className="flex min-h-[160px] w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 focus:ring-2 focus:ring-stone-200 disabled:cursor-not-allowed disabled:bg-stone-50"
          />
        </div>

        <Button type="submit" disabled={!canSubmit || submitting || !message.trim()} className="w-full">
          {submitting ? "Requesting..." : "Request Through Consultation"}
        </Button>
      </form>
    </div>
  );
}