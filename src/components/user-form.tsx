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
import { MultiSelect, MultiSelectOption } from "@/components/ui/multi-select";
import { PersonStatusDropdown } from "@/components/ui/dropdowns/PersonStatusDropdown";
import { 
  useFsmLicenseOptions,
  useLanguageOptions,
  useRequestPostGroupOptions,
  useContractPostGroupOptions,
  useAccessGroupOptions,
  usePersonGroupOptions,
  useLocationOptions,
  useAddressTypeOptions
} from "@/lib/metadata/hooks";

// Define form schema for validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  ifsUserId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address"),
  sso: z.boolean().default(false),
  language: z.string().optional(),
  lelyCenter: z.string().optional(),
  allocatedTeam: z.string().optional(),
  employee: z.boolean().default(false),
  jobTitle: z.string().optional(),
  personStatus: z.string().default("active"),
  type: z.string().default("business-support"),
  currency: z.string().optional(),
  technicianIdMX: z.string().min(1, "Technician ID (MX) is required"),
  personGroup: z.string().optional(),
  contractPostGroup: z.string().optional(),
  requestPostGroup: z.string().optional(),
  startWorkFrom: z.string().optional(),
  worksFromPlace: z.string().optional(),
  endsWorkAt: z.string().optional(),
  placeForStock: z.string().optional(),
  stockLocation: z.string().optional(),
  addressType: z.string().optional(),
  address: z.string().optional(),
  fsmLicense: z.string().optional(),
  mobileUser: z.boolean().default(false),
  dispatchable: z.boolean().default(false),
  schedulingResource: z.boolean().default(false),
  psoSystemUser: z.boolean().default(false),
  roles: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

// Define dropdown options for the remaining hardcoded dropdowns

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

const allocatedTeamOptions: ComboboxOption[] = [
  { value: "team-service", label: "Service Team" },
  { value: "team-sales", label: "Sales Team" },
  { value: "team-support", label: "Support Team" },
  { value: "team-admin", label: "Administrative Team" },
  { value: "team-management", label: "Management Team" },
  { value: "team-development", label: "Development Team" },
];

const placesOptions: ComboboxOption[] = [
  { value: "place-hq", label: "Headquarters" },
  { value: "place-warehouse", label: "Warehouse" },
  { value: "place-distribution", label: "Distribution Center" },
  { value: "place-service-center", label: "Service Center" },
  { value: "place-field-office", label: "Field Office" },
  { value: "place-customer-site", label: "Customer Site" },
];

const addressOptions: ComboboxOption[] = [
  { value: "addr-1", label: "123 Main St, City, State" },
  { value: "addr-2", label: "456 Oak Ave, City, State" },
  { value: "addr-3", label: "789 Pine Rd, City, State" },
  { value: "addr-4", label: "321 Elm Blvd, City, State" },
  { value: "addr-5", label: "654 Maple Ln, City, State" },
];

const roleOptions: MultiSelectOption[] = [
  { value: "role-admin", label: "Administrator" },
  { value: "role-manager", label: "Manager" },
  { value: "role-technician", label: "Technician" },
  { value: "role-dispatcher", label: "Dispatcher" },
  { value: "role-planner", label: "Planner" },
  { value: "role-support", label: "Support Agent" },
];

// Custom styles for the combobox
const comboboxStyles = "w-full text-muted-foreground font-normal";

// Custom styles for placeholders
const placeholderStyles = "text-muted-foreground/70 italic text-sm";

export function UserForm() {
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true);
  const [teamDetailsExpanded, setTeamDetailsExpanded] = useState(true);
  const [rolesLicenseExpanded, setRolesLicenseExpanded] = useState(true);
  
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
      lelyCenter: "",
      allocatedTeam: "",
      employee: false,
      jobTitle: "",
      personStatus: "",
      type: "business-support",
      currency: "",
      technicianIdMX: "",
      personGroup: "",
      contractPostGroup: "",
      requestPostGroup: "",
      startWorkFrom: "",
      worksFromPlace: "",
      endsWorkAt: "",
      placeForStock: "",
      stockLocation: "",
      addressType: "",
      address: "",
      fsmLicense: "",
      mobileUser: false,
      dispatchable: false,
      schedulingResource: false,
      psoSystemUser: false,
      roles: [],
    },
  });

  // Add metadata hooks
  const { options: fsmLicenseOptions, isLoading: fsmLicenseLoading, error: fsmLicenseError } = useFsmLicenseOptions();
  const { options: languageOptions, isLoading: languageLoading, error: languageError } = useLanguageOptions();
  const { options: requestPostGroupOptions, isLoading: requestPostGroupLoading, error: requestPostGroupError } = useRequestPostGroupOptions();
  const { options: contractPostGroupOptions, isLoading: contractPostGroupLoading, error: contractPostGroupError } = useContractPostGroupOptions();
  const { options: accessGroupOptions, isLoading: accessGroupLoading, error: accessGroupError } = useAccessGroupOptions();
  const { options: personGroupOptions, isLoading: personGroupLoading, error: personGroupError } = usePersonGroupOptions();
  const { options: locationOptions, isLoading: locationLoading, error: locationError } = useLocationOptions();
  const { options: addressTypeOptions, isLoading: addressTypeLoading, error: addressTypeError } = useAddressTypeOptions();

  const onSubmit = (data: FormValues) => {
    console.log("Form submitted with values:", data);
    // In a real app, this would submit the form to your API
  };

  // Function to handle combobox changes
  const handleComboboxChange = (field: keyof FormValues, value: string) => {
    setValue(field, value, { shouldValidate: true });
    
    // Update Contract Post Group and Request Post Group when Lely Center changes
    if (field === "lelyCenter" && value) {
      // Set the same value to all three dropdowns
      setValue("contractPostGroup", value);
      setValue("requestPostGroup", value);
    }
  };

  // Function to get the placeholder class
  const getPlaceholderClass = (value: string | undefined) => {
    return !value ? placeholderStyles : "";
  };

  // Function to handle multi-select changes
  const handleMultiSelectChange = (field: keyof FormValues, values: string[]) => {
    setValue(field, values, { shouldValidate: true });
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
                placeholder={personGroupLoading ? "Loading..." : "Select person group"}
                searchPlaceholder="Search person group..."
                className={cn(comboboxStyles, getPlaceholderClass(watch("personGroup")))}
              />
              {personGroupError && (
                <p className="text-sm text-destructive">
                  {personGroupError.message || 'Failed to load person group options'}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personStatus">Person Status</Label>
              <PersonStatusDropdown
                value={watch("personStatus")}
                onChange={(value) => handleComboboxChange("personStatus", value)}
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
                placeholder={languageLoading ? "Loading..." : "Select language"}
                searchPlaceholder="Search language..."
                className={cn(comboboxStyles, getPlaceholderClass(watch("language")))}
              />
              {languageError && (
                <p className="text-sm text-destructive">
                  {languageError.message || 'Failed to load language options'}
                </p>
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
          <div className="p-4 grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lelyCenter">Lely Center (Access Group)</Label>
                <Combobox
                  options={accessGroupOptions}
                  value={watch("lelyCenter") || ""}
                  onValueChange={(value) => handleComboboxChange("lelyCenter", value)}
                  placeholder={accessGroupLoading ? "Loading..." : "Select Lely Center"}
                  searchPlaceholder="Search Lely Center..."
                  className={cn(comboboxStyles, getPlaceholderClass(watch("lelyCenter")))}
                />
                {accessGroupError && (
                  <p className="text-sm text-destructive">
                    {accessGroupError.message || 'Failed to load access group options'}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contractPostGroup">Contract Post Group</Label>
                <Combobox
                  options={contractPostGroupOptions}
                  value={watch("contractPostGroup") || ""}
                  onValueChange={(value) => handleComboboxChange("contractPostGroup", value)}
                  placeholder={contractPostGroupLoading ? "Loading..." : "Select Contract Post Group"}
                  searchPlaceholder="Search Contract Post Group..."
                  className={cn(comboboxStyles, getPlaceholderClass(watch("contractPostGroup")))}
                />
                {contractPostGroupError && (
                  <p className="text-sm text-destructive">
                    {contractPostGroupError.message || 'Failed to load contract post group options'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestPostGroup">Request Post Group</Label>
                <Combobox
                  options={requestPostGroupOptions}
                  value={watch("requestPostGroup") || ""}
                  onValueChange={(value) => handleComboboxChange("requestPostGroup", value)}
                  placeholder={requestPostGroupLoading ? "Loading..." : "Select Request Post Group"}
                  searchPlaceholder="Search Request Post Group..."
                  className={cn(comboboxStyles, getPlaceholderClass(watch("requestPostGroup")))}
                />
                {requestPostGroupError && (
                  <p className="text-sm text-destructive">
                    {requestPostGroupError.message || 'Failed to load request post group options'}
                  </p>
                )}
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-border my-2"></div>
            
            <div className="space-y-2">
              <Label htmlFor="allocatedTeam">Allocated Team</Label>
              <Combobox
                options={allocatedTeamOptions}
                value={watch("allocatedTeam") || ""}
                onValueChange={(value) => handleComboboxChange("allocatedTeam", value)}
                placeholder="Select Allocated Team"
                searchPlaceholder="Search Allocated Team..."
                className={cn(comboboxStyles, getPlaceholderClass(watch("allocatedTeam")))}
              />
              {errors.allocatedTeam && (
                <p className="text-sm text-destructive">{errors.allocatedTeam.message}</p>
              )}
            </div>
            
            {/* New Divider after Allocated Team */}
            <div className="h-px bg-border my-2"></div>
            
            {/* Places Section */}
            <div className="space-y-4 p-3 bg-muted/30 rounded-md">
              <h4 className="font-medium text-muted-foreground/90 border-l-4 border-primary/40 pl-2">Places</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startWorkFrom">Start Work From</Label>
                  <Combobox
                    options={placesOptions}
                    value={watch("startWorkFrom") || ""}
                    onValueChange={(value) => handleComboboxChange("startWorkFrom", value)}
                    placeholder="Select Starting Place"
                    searchPlaceholder="Search places..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("startWorkFrom")))}
                  />
                  {errors.startWorkFrom && (
                    <p className="text-sm text-destructive">{errors.startWorkFrom.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="worksFromPlace">Works From Place</Label>
                  <Combobox
                    options={placesOptions}
                    value={watch("worksFromPlace") || ""}
                    onValueChange={(value) => handleComboboxChange("worksFromPlace", value)}
                    placeholder="Select Work Place"
                    searchPlaceholder="Search places..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("worksFromPlace")))}
                  />
                  {errors.worksFromPlace && (
                    <p className="text-sm text-destructive">{errors.worksFromPlace.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endsWorkAt">Ends Work At</Label>
                  <Combobox
                    options={placesOptions}
                    value={watch("endsWorkAt") || ""}
                    onValueChange={(value) => handleComboboxChange("endsWorkAt", value)}
                    placeholder="Select Ending Place"
                    searchPlaceholder="Search places..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("endsWorkAt")))}
                  />
                  {errors.endsWorkAt && (
                    <p className="text-sm text-destructive">{errors.endsWorkAt.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="placeForStock">Place for Stock</Label>
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-7">
                      <Combobox
                        options={placesOptions}
                        value={watch("placeForStock") || ""}
                        onValueChange={(value) => handleComboboxChange("placeForStock", value)}
                        placeholder="Select Stock Place"
                        searchPlaceholder="Search places..."
                        className={cn(comboboxStyles, getPlaceholderClass(watch("placeForStock")))}
                      />
                      {errors.placeForStock && (
                        <p className="text-sm text-destructive">{errors.placeForStock.message}</p>
                      )}
                    </div>
                    <div className="col-span-5">
                      <Combobox
                        options={locationOptions}
                        value={watch("stockLocation") || ""}
                        onValueChange={(value) => handleComboboxChange("stockLocation", value)}
                        placeholder={locationLoading ? "Loading..." : "Location"}
                        searchPlaceholder="Search locations..."
                        className={cn(comboboxStyles, getPlaceholderClass(watch("stockLocation")))}
                      />
                      {locationError && (
                        <p className="text-sm text-destructive">
                          {locationError.message || 'Failed to load location options'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressType">Address Type</Label>
                  <Combobox
                    options={addressTypeOptions}
                    value={watch("addressType") || ""}
                    onValueChange={(value) => handleComboboxChange("addressType", value)}
                    placeholder={addressTypeLoading ? "Loading..." : "Select Address Type"}
                    searchPlaceholder="Search address types..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("addressType")))}
                  />
                  {addressTypeError && (
                    <p className="text-sm text-destructive">
                      {addressTypeError.message || 'Failed to load address type options'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Combobox
                    options={addressOptions}
                    value={watch("address") || ""}
                    onValueChange={(value) => handleComboboxChange("address", value)}
                    placeholder="Select Address"
                    searchPlaceholder="Search addresses..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("address")))}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Roles and License Setup */}
      <div className="rounded-md border">
        <div 
          className="flex items-center justify-between bg-muted/50 px-4 py-3 cursor-pointer"
          onClick={() => setRolesLicenseExpanded(!rolesLicenseExpanded)}
        >
          <h3 className="text-md font-medium">Roles and License Setup</h3>
          <ChevronDown className={cn(
            "h-5 w-5 transition-transform",
            rolesLicenseExpanded ? "rotate-180" : ""
          )} />
        </div>
        
        {rolesLicenseExpanded && (
          <div className="p-4 grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fsmLicense">FSM License</Label>
              <Combobox
                options={fsmLicenseOptions}
                value={watch("fsmLicense") || ""}
                onValueChange={(value) => handleComboboxChange("fsmLicense", value)}
                placeholder={fsmLicenseLoading ? "Loading..." : "Select FSM License"}
                searchPlaceholder="Search license types..."
                className={cn(comboboxStyles, getPlaceholderClass(watch("fsmLicense")))}
              />
              {fsmLicenseError && (
                <p className="text-sm text-destructive">
                  {fsmLicenseError.message || 'Failed to load FSM license options'}
                </p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="mobileUser"
                  {...register("mobileUser")}
                />
                <Label htmlFor="mobileUser" className="ml-2">Mobile User</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dispatchable"
                  {...register("dispatchable")}
                />
                <Label htmlFor="dispatchable" className="ml-2">Dispatchable</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="schedulingResource"
                  {...register("schedulingResource")}
                />
                <Label htmlFor="schedulingResource" className="ml-2">Scheduling Resource</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="psoSystemUser"
                  {...register("psoSystemUser")}
                />
                <Label htmlFor="psoSystemUser" className="ml-2">PSO System User</Label>
              </div>
            </div>
            
            {/* Divider */}
            <div className="h-px bg-border my-2"></div>
            
            <div className="space-y-2">
              <Label htmlFor="roles">Roles</Label>
              <MultiSelect
                options={roleOptions}
                values={watch("roles") || []}
                onValuesChange={(values) => handleMultiSelectChange("roles", values)}
                placeholder="Select Roles"
                searchPlaceholder="Search roles..."
                badgeVariant="secondary"
                closeOnSelect={true}
              />
              {errors.roles && (
                <p className="text-sm text-destructive">{errors.roles.message}</p>
              )}
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