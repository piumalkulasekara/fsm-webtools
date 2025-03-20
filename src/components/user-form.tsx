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
import { Combobox, ComboboxOption } from "@/components/ui/combobox";

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
  employee: z.boolean().default(false),
  jobTitle: z.string().optional(),
  personStatus: z.string().default("active"),
  type: z.string().default("business-support"),
  currency: z.string().optional(),
  technicianIdMX: z.string().min(1, "Technician ID (MX) is required"),
  personGroup: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Define dropdown options
const languageOptions: ComboboxOption[] = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ar", label: "Arabic" },
];

const personStatusOptions: ComboboxOption[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const typeOptions: ComboboxOption[] = [
  { value: "business-support", label: "Business Support" },
  { value: "administrator", label: "Administrator" },
  { value: "dispatcher", label: "Dispatcher" },
  { value: "technician", label: "Technician" },
];

const currencyOptions: ComboboxOption[] = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "BRL", label: "BRL - Brazilian Real" },
  { value: "MXN", label: "MXN - Mexican Peso" },
];

const personGroupOptions: ComboboxOption[] = [
  { value: "managers", label: "Managers" },
  { value: "supervisors", label: "Supervisors" },
  { value: "field-technicians", label: "Field Technicians" },
  { value: "administrative", label: "Administrative" },
  { value: "support-staff", label: "Support Staff" },
  { value: "contractors", label: "Contractors" },
];

export function UserForm() {
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true);
  const [teamDetailsExpanded, setTeamDetailsExpanded] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
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
      employee: false,
      jobTitle: "",
      personStatus: "active",
      type: "business-support",
      currency: "",
      technicianIdMX: "",
      personGroup: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with values:", data);
    // In a real app, this would submit the form to your API
  };

  // Function to handle combobox changes
  const handleComboboxChange = (field: keyof FormValues, value: string) => {
    setValue(field, value, { shouldValidate: true });
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
              <Label htmlFor="technicianIdMX">
                Technician ID (MX) <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="technicianIdMX"
                placeholder="Technician ID (MX)"
                {...register("technicianIdMX")}
              />
              {errors.technicianIdMX && (
                <p className="text-sm text-destructive">{errors.technicianIdMX.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input 
                id="jobTitle"
                placeholder="Job Title"
                {...register("jobTitle")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personGroup">Person Group</Label>
              <Combobox
                options={personGroupOptions}
                value={watch("personGroup") || ""}
                onValueChange={(value) => handleComboboxChange("personGroup", value)}
                placeholder="Select person group"
                searchPlaceholder="Search person group..."
              />
              {errors.personGroup && (
                <p className="text-sm text-destructive">{errors.personGroup.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personStatus">Person Status</Label>
              <Combobox
                options={personStatusOptions}
                value={watch("personStatus")}
                onValueChange={(value) => handleComboboxChange("personStatus", value)}
                placeholder="Select status"
                searchPlaceholder="Search status..."
              />
              {errors.personStatus && (
                <p className="text-sm text-destructive">{errors.personStatus.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Combobox
                options={typeOptions}
                value={watch("type")}
                onValueChange={(value) => handleComboboxChange("type", value)}
                placeholder="Select type"
                searchPlaceholder="Search type..."
              />
              {errors.type && (
                <p className="text-sm text-destructive">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2 flex items-center h-full">
              <div className="flex items-center space-x-2 mt-8">
                <Checkbox
                  id="employee"
                  {...register("employee")}
                />
                <Label htmlFor="employee" className="ml-2">Employee</Label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Combobox
                options={languageOptions}
                value={watch("language") || ""}
                onValueChange={(value) => handleComboboxChange("language", value)}
                placeholder="Select language"
                searchPlaceholder="Search language..."
              />
              {errors.language && (
                <p className="text-sm text-destructive">{errors.language.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Combobox
                options={currencyOptions}
                value={watch("currency") || ""}
                onValueChange={(value) => handleComboboxChange("currency", value)}
                placeholder="Select currency"
                searchPlaceholder="Search currency..."
              />
              {errors.currency && (
                <p className="text-sm text-destructive">{errors.currency.message}</p>
              )}
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