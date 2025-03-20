"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Define form schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  ifsUserId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  sso: z.boolean().default(false),
  language: z.string().optional(),
  lcNameNumber: z.string().optional(),
  allocatedTeam: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function UserForm() {
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true);
  const [teamDetailsExpanded, setTeamDetailsExpanded] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      ifsUserId: "",
      phone: "",
      email: "",
      sso: false,
      language: "",
      lcNameNumber: "",
      allocatedTeam: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with values:", data);
    // In a real app, this would submit the form to your API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* General Info Section */}
      <div className="rounded-md border">
        <div 
          className="flex items-center justify-between bg-muted/50 px-4 py-3 cursor-pointer"
          onClick={() => setGeneralInfoExpanded(!generalInfoExpanded)}
        >
          <h3 className="text-md font-medium">General Info</h3>
          <ChevronDown className={cn(
            "h-5 w-5 transition-transform",
            generalInfoExpanded ? "rotate-180" : ""
          )} />
        </div>
        
        {generalInfoExpanded && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="firstName"
                placeholder="First Name"
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="lastName"
                placeholder="Last Name"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ifsUserId">IFS User ID (readonly field)</Label>
              <Input 
                id="ifsUserId"
                placeholder="IFS User ID"
                readOnly
                {...register("ifsUserId")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                placeholder="Phone"
                {...register("phone")}
              />
            </div>
            
            {/* Email Field */}
            <div className="space-y-2 col-span-1">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-start space-x-4">
                <div className="flex-grow">
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Email Address"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="flex items-center mt-1 space-x-2 min-w-[80px]">
                  <Checkbox
                    id="sso"
                    {...register("sso")}
                  />
                  <Label htmlFor="sso" className="ml-2">SSO</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input 
                id="language"
                placeholder="Language"
                {...register("language")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Organization and Team Details */}
      <div className="rounded-md border">
        <div 
          className="flex items-center justify-between bg-muted/50 px-4 py-3 cursor-pointer"
          onClick={() => setTeamDetailsExpanded(!teamDetailsExpanded)}
        >
          <h3 className="text-md font-medium">Organization and Team Details</h3>
          <ChevronDown className={cn(
            "h-5 w-5 transition-transform",
            teamDetailsExpanded ? "rotate-180" : ""
          )} />
        </div>
        
        {teamDetailsExpanded && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lcNameNumber">LC Name/Number</Label>
              <Input 
                id="lcNameNumber"
                placeholder="LC Name/Number"
                {...register("lcNameNumber")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allocatedTeam">Allocated Team</Label>
              <Input 
                id="allocatedTeam"
                placeholder="Allocated Team"
                {...register("allocatedTeam")}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" type="button">Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
} 