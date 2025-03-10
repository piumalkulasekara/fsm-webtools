"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner"; // Import Sonner's toast
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>();

  const mutation = useMutation<
    { success: boolean }, // TData: the response type
    Error,                // TError: the error type
    ContactFormData,      // TVariables: the form data type
    unknown               // TContext (if needed)
  >({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error sending message");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Message sent successfully.");
      reset();
    },
    onError: (error: Error) => {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message.");
    },
  });

  const onSubmit: SubmitHandler<ContactFormData> = (data) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your Name"
            {...register("name", { required: true })}
          />
          {errors.name && (
            <p className="text-sm text-destructive">Name is required</p>
          )}
        </div>
        <div className="flex flex-col">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-sm text-destructive">Email is required</p>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Your message"
          {...register("message", { required: true })}
        />
        {errors.message && (
          <p className="text-sm text-destructive">Message is required</p>
        )}
      </div>
      <Button type="submit" disabled={mutation.status === "pending"}>
        {mutation.status === "pending" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
