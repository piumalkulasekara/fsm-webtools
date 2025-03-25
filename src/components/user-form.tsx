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
import { MultiSelect } from "@/components/ui/multi-select";
import { PersonStatusDropdown } from "@/components/ui/dropdowns/PersonStatusDropdown";
import { 
  useFsmLicenseOptions,
  useLanguageOptions,
  useRequestPostGroupOptions,
  useContractPostGroupOptions,
  useAccessGroupOptions,
  usePersonGroupOptions,
  useLocationOptions,
  useAddressTypeOptions,
  useCurrencyOptions,
  usePlaceOptions,
  useAddressOptions,
  useUserRoleOptions,
  useAllocatedTeamOptions
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
  allocatedTeam: z.array(z.string()).default([]),
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
  addressType: z.string().default("DEFAULT"),
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

// Remove hardcoded allocated team options
// const allocatedTeamOptions: ComboboxOption[] = [...];

// Remove hardcoded place options
// const placesOptions: ComboboxOption[] = [...];

// Remove hardcoded addressOptions array since we're using the hook
// const addressOptions: ComboboxOption[] = [...];

// Remove hardcoded role options array since we're using the hook
// const roleOptions: MultiSelectOption[] = [...];

// Custom styles for the combobox
const comboboxStyles = "w-full text-muted-foreground font-normal";

// Custom styles for placeholders
const placeholderStyles = "text-muted-foreground/70 italic text-sm";

export function UserForm() {
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true);
  const [teamDetailsExpanded, setTeamDetailsExpanded] = useState(true);
  const [rolesLicenseExpanded, setRolesLicenseExpanded] = useState(true);
  const [viewAllTeams, setViewAllTeams] = useState(false);
  
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
      allocatedTeam: [],
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
      addressType: "DEFAULT",
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
  const { options: addressTypeOptions, isLoading: addressTypeLoading, error: addressTypeError } = useAddressTypeOptions();
  const { options: currencyOptions, isLoading: currencyLoading, error: currencyError } = useCurrencyOptions();
  
  // Use selected place for stock for filtering locations
  const placeForStock = watch("placeForStock");
  const { 
    options: locationOptions, 
    isLoading: locationLoading, 
    error: locationError,
    isDisabled: locationIsDisabled 
  } = useLocationOptions(placeForStock);

  // Add place options hook
  const { 
    options: placeOptions, 
    isLoading: placesLoading, 
    error: placesError 
  } = usePlaceOptions();
  
  const { 
    options: addressOptionsFromApi, 
    isLoading: addressesLoading, 
    error: addressesError 
  } = useAddressOptions();

  // Add user role options hook
  const { 
    options: roleOptions, 
    isLoading: rolesLoading, 
    error: rolesError 
  } = useUserRoleOptions();

  // Use selected Lely Center for filtering teams
  const lelyCenter = watch("lelyCenter");
  const { 
    options: allocatedTeamOptions, 
    isLoading: allocatedTeamLoading, 
    error: allocatedTeamError 
  } = useAllocatedTeamOptions(lelyCenter, viewAllTeams);

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

  // Toggle function for view all teams
  const toggleViewAllTeams = () => {
    setViewAllTeams(!viewAllTeams);
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
                placeholder={currencyLoading ? "Loading..." : "Select currency"}
                searchPlaceholder="Search currency..."
                className={cn(comboboxStyles, getPlaceholderClass(watch("currency")))}
              />
              {currencyError && (
                <p className="text-sm text-destructive">
                  {currencyError.message || 'Failed to load currency options'}
                </p>
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
              <div className="flex justify-between items-center">
                <Label htmlFor="allocatedTeam">Allocated Team</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={toggleViewAllTeams}
                  className="h-7 text-xs"
                >
                  {viewAllTeams ? "Show Filtered Teams" : "Show All Teams"}
                </Button>
              </div>
              {!viewAllTeams && lelyCenter && (
                <p className="text-xs text-muted-foreground">
                  Teams filtered by Access Group: {lelyCenter}
                </p>
              )}
              <MultiSelect
                options={allocatedTeamOptions}
                values={watch("allocatedTeam") || []}
                onValuesChange={(values) => handleMultiSelectChange("allocatedTeam", values)}
                placeholder={allocatedTeamLoading ? "Loading teams..." : "Select Allocated Team"}
                searchPlaceholder="Search teams..."
                badgeVariant="secondary"
                closeOnSelect={true}
              />
              {allocatedTeamError && (
                <p className="text-sm text-destructive">
                  {allocatedTeamError.message || 'Failed to load team options'}
                </p>
              )}
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
                    options={placeOptions}
                    value={watch("startWorkFrom") || ""}
                    onValueChange={(value) => handleComboboxChange("startWorkFrom", value)}
                    placeholder={placesLoading ? "Loading places..." : "Select Starting Place"}
                    searchPlaceholder="Search places..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("startWorkFrom")))}
                  />
                  {placesError && (
                    <p className="text-sm text-destructive">
                      {placesError.message || 'Failed to load places'}
                    </p>
                  )}
                  {errors.startWorkFrom && (
                    <p className="text-sm text-destructive">{errors.startWorkFrom.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="worksFromPlace">Works From Place</Label>
                  <Combobox
                    options={placeOptions}
                    value={watch("worksFromPlace") || ""}
                    onValueChange={(value) => handleComboboxChange("worksFromPlace", value)}
                    placeholder={placesLoading ? "Loading places..." : "Select Work Place"}
                    searchPlaceholder="Search places..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("worksFromPlace")))}
                  />
                  {placesError && (
                    <p className="text-sm text-destructive">
                      {placesError.message || 'Failed to load places'}
                    </p>
                  )}
                  {errors.worksFromPlace && (
                    <p className="text-sm text-destructive">{errors.worksFromPlace.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="endsWorkAt">Ends Work At</Label>
                  <Combobox
                    options={placeOptions}
                    value={watch("endsWorkAt") || ""}
                    onValueChange={(value) => handleComboboxChange("endsWorkAt", value)}
                    placeholder={placesLoading ? "Loading places..." : "Select Ending Place"}
                    searchPlaceholder="Search places..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("endsWorkAt")))}
                  />
                  {placesError && (
                    <p className="text-sm text-destructive">
                      {placesError.message || 'Failed to load places'}
                    </p>
                  )}
                  {errors.endsWorkAt && (
                    <p className="text-sm text-destructive">{errors.endsWorkAt.message}</p>
                  )}
                </div>
              </div>
              
              {/* Place for Stock and Location in a separate row */}
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 space-y-2">
                  <Label htmlFor="placeForStock">Place for Stock</Label>
                  <Combobox
                    options={placeOptions}
                    value={watch("placeForStock") || ""}
                    onValueChange={(value) => handleComboboxChange("placeForStock", value)}
                    placeholder={placesLoading ? "Loading places..." : "Select Stock Place"}
                    searchPlaceholder="Search places..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("placeForStock")))}
                  />
                  {placesError && (
                    <p className="text-sm text-destructive">
                      {placesError.message || 'Failed to load places'}
                    </p>
                  )}
                  {errors.placeForStock && (
                    <p className="text-sm text-destructive">{errors.placeForStock.message}</p>
                  )}
                </div>
                <div className="col-span-6 space-y-2">
                  <Label htmlFor="stockLocation">Location</Label>
                  <Combobox
                    options={locationOptions}
                    value={watch("stockLocation") || ""}
                    onValueChange={(value) => handleComboboxChange("stockLocation", value)}
                    placeholder={locationIsDisabled 
                      ? "Select a Place for Stock first" 
                      : (locationLoading ? "Loading..." : "Select Location")}
                    searchPlaceholder="Search locations..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("stockLocation")))}
                    disabled={locationIsDisabled}
                  />
                  {!locationIsDisabled && locationError && (
                    <p className="text-sm text-destructive">
                      {locationError.message || 'Failed to load location options'}
                    </p>
                  )}
                  {locationIsDisabled && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Please select a Place for Stock to enable location selection
                    </p>
                  )}
                </div>
              </div>

              {/* Address Type and Address in a separate grid row */}
              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-4 space-y-2">
                  <Label htmlFor="addressType">Address Type</Label>
                  <Combobox
                    options={addressTypeOptions}
                    value={watch("addressType")}
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
                <div className="col-span-8 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Combobox
                    options={addressOptionsFromApi}
                    value={watch("address") || ""}
                    onValueChange={(value) => handleComboboxChange("address", value)}
                    placeholder={addressesLoading ? "Loading addresses..." : "Select Address"}
                    searchPlaceholder="Search addresses..."
                    className={cn(comboboxStyles, getPlaceholderClass(watch("address")))}
                  />
                  {addressesError && (
                    <p className="text-sm text-destructive">
                      {addressesError.message || 'Failed to load address options'}
                    </p>
                  )}
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
                placeholder={rolesLoading ? "Loading roles..." : "Select Roles"}
                searchPlaceholder="Search roles..."
                badgeVariant="secondary"
                closeOnSelect={true}
              />
              {rolesError && (
                <p className="text-sm text-destructive">
                  {rolesError.message || 'Failed to load role options'}
                </p>
              )}
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