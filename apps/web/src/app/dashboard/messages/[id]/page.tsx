"use client";
import { useEffect, useState, useRef, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type Message = any;
type Inquiry = any;

export default function ConversationPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/inquiries/${params.id}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
          setInquiry(data.inquiry);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [params.id]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    setSending(true);

    try {
      const res = await fetch(`/api/inquiries/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });
      if (res.ok) {
        const message = await res.json();
        setMessages([...messages, message]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 py-12 items-center justify-center">
        <p className="text-stone-500">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 py-12 h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/dashboard/messages" className="text-stone-500 hover:text-stone-900">
          ← Back
        </Link>
        <h1 className="font-serif text-2xl text-stone-900">
          {inquiry?.vendor?.businessName || inquiry?.couple?.user?.name || "Conversation"}
        </h1>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.senderType === "COUPLE" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.senderType === "COUPLE"
                    ? "bg-primary text-white rounded-tr-sm"
                    : "bg-stone-100 text-stone-900 rounded-tl-sm"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-200">
          <div className="flex gap-3">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim() || sending}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
