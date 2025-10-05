"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  question: z
    .string()
    .min(4, "Please include enough detail for us to help.")
    .max(500, "Keep it under 500 characters, please."),
  escalate: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

export function ChatbotWidget() {
  const [response, setResponse] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" }
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setResponse(
      values.escalate
        ? "Thanks! A care coordinator will call you shortly to follow up."
        : "Our digital assistant cannot provide medical advice. We've shared preparation tips and connected you with support if you need more help."
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand">
          <MessageCircle className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">AI concierge</h3>
          <p className="text-sm text-slate-500">Never provides medical advice. Escalates red flags.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Textarea placeholder="Ask about scheduling, pricing, or onboarding" {...register("question")} />
          {errors.question && <p className="mt-2 text-sm text-rose-500">{errors.question.message}</p>}
        </div>
        <label className="flex items-center gap-3 text-sm text-slate-600">
          <input type="checkbox" {...register("escalate")} className="h-4 w-4" />
          Connect me with a human care coordinator
        </label>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Thinking..." : "Send"}
        </Button>
      </form>
      {response && <p className="mt-4 text-sm text-slate-600">{response}</p>}
    </div>
  );
}
