"use client";

import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sdk } from "@/lib/sdk";

const schema = z.object({
  patientId: z.string().min(3),
  addressId: z.string().min(3),
  scheduledStart: z.string(),
  therapistGenderPreference: z.enum(["Male", "Female", "Any"]),
  notes: z.string().optional(),
  paymentMethodId: z.string().min(3),
  couponCode: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

export function BookingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      therapistGenderPreference: "Any",
      scheduledStart: new Date().toISOString().slice(0, 16)
    }
  });

  const onSubmit = async (values: FormValues) => {
    await sdk.bookings.create(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Patient ID" error={errors.patientId?.message}>
          <Input placeholder="pat_123" {...register("patientId")} />
        </Field>
        <Field label="Address ID" error={errors.addressId?.message}>
          <Input placeholder="addr_123" {...register("addressId")} />
        </Field>
        <Field label="Start time" error={errors.scheduledStart?.message}>
          <Input type="datetime-local" {...register("scheduledStart")} />
        </Field>
        <Field label="Payment method" error={errors.paymentMethodId?.message}>
          <Input placeholder="pm_xxx" {...register("paymentMethodId")} />
        </Field>
      </div>
      <Field label="Therapist gender preference" error={errors.therapistGenderPreference?.message}>
        <select className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm" {...register("therapistGenderPreference")}>
          <option value="Any">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </Field>
      <Field label="Notes" error={errors.notes?.message}>
        <Textarea placeholder="Share access notes, elevator details, or preferences" {...register("notes")} />
      </Field>
      <Field label="Coupon" error={errors.couponCode?.message}>
        <Input placeholder="WELCOME10" {...register("couponCode")} />
      </Field>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Booking..." : "Create booking"}
      </Button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-slate-700">{label}</span>
      <div className="mt-2">{children}</div>
      {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
    </label>
  );
}
