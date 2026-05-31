"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type Inquiry = any;

export default function MessagesDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await fetch("/api/inquiries");
        if (res.ok) {
          const data = await res.json();
          setInquiries(data);
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 items-center justify-center">
        <p className="text-stone-500">Loading conversations...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12">
      <div className="space-y-2">
        <h1 className="font-serif text-3xl text-stone-900">Messages</h1>
        <p className="text-stone-600">Your conversations with vendors and couples</p>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-stone-500">No conversations yet</p>
            <Link href="/vendors" className="inline-block mt-4 text-primary underline">
              Explore vendors
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <Link key={inquiry.id} href={`/dashboard/messages/${inquiry.id}`}>
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <p className="font-medium text-stone-900">
                        {inquiry.vendor?.businessName || inquiry.couple?.user?.name || "Conversation"}
                      </p>
                      <p className="text-sm text-stone-600 line-clamp-2">
                        {inquiry.messages?.[0]?.content || inquiry.message}
                      </p>
                    </div>
                    <div className="text-xs text-stone-400">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
