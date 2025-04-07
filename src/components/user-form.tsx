"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Save, Trash2, Send, Bug } from "lucide-react";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/ui/combobox";
import { MultiSelect } from "@/components/ui/multi-select";
import { AddressMultiSelect } from "@/components/ui/address-multi-select";
import { PersonStatusDropdown } from "@/components/ui/dropdowns/PersonStatusDropdown";
import { toast } from "sonner";
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
  useAllocatedTeamOptions,
  usePlaceCountry,
  usePersonTypeOptions
} from "@/lib/metadata/hooks";
import { userService, UserCreateData, CreateUserResponse } from "@/lib/api/user-service";

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
  address: z.array(z.string()).default([]),
  fsmLicense: z.string().optional(),
  mobileUser: z.boolean().default(false),
  dispatchable: z.boolean().default(false),
  schedulingResource: z.boolean().default(false),
  psoSystemUser: z.boolean().default(false),
  roles: z.array(z.string()).default([]),
});

type FormValues = z.infer<typeof formSchema>;

// Define dropdown options for the remaining hardcoded dropdowns
// -- No hardcoded dropdowns needed anymore --

// Custom styles for the combobox
const comboboxStyles = "w-full text-muted-foreground font-normal";

// Custom styles for placeholders
const placeholderStyles = "text-muted-foreground/70 italic text-sm";

export function UserForm() {
  const [generalInfoExpanded, setGeneralInfoExpanded] = useState(true);
  const [teamDetailsExpanded, setTeamDetailsExpanded] = useState(true);
  const [rolesLicenseExpanded, setRolesLicenseExpanded] = useState(true);
  const [viewAllTeams, setViewAllTeams] = useState(false);
  const [viewAllAddresses, setViewAllAddresses] = useState(false);
  const [addressTypeMap, setAddressTypeMap] = useState<Record<string, string>>({});
  const [debugResponse, setDebugResponse] = useState<{
    success?: boolean;
    data?: CreateUserResponse;
    error?: string;
  } | Error | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
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
      address: [],
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
  const { options: personTypeOptions, isLoading: personTypeLoading, error: personTypeError } = usePersonTypeOptions();
  
  // Use selected place for stock for filtering locations
  const placeForStock = watch("placeForStock");
  const { 
    options: locationOptions, 
    isLoading: locationLoading, 
    error: locationError,
    isDisabled: locationIsDisabled 
  } = useLocationOptions(placeForStock);

  // Use selected start work from place for filtering addresses by country
  const startWorkFrom = watch("startWorkFrom");
  const {
    country: startWorkFromCountry,
    isLoading: countryLoading
  } = usePlaceCountry(startWorkFrom);
  
  // Use country filter for addresses if a place is selected and viewAllAddresses is false
  const filterCountry = !viewAllAddresses && startWorkFromCountry ? startWorkFromCountry : undefined;
  const { 
    options: addressOptionsFromApi, 
    isLoading: addressesLoading, 
    error: addressesError 
  } = useAddressOptions(filterCountry);

  // Add place options hook
  const { 
    options: placeOptions, 
    isLoading: placesLoading, 
    error: placesError 
  } = usePlaceOptions();
  
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

  const onSubmit = async (data: FormValues) => {
    try {
      // Debug log for form data
      console.log("Form data before processing:", {
        employee: data.employee,
        mobileUser: data.mobileUser,
        dispatchable: data.dispatchable,
        schedulingResource: data.schedulingResource,
        psoSystemUser: data.psoSystemUser
      });
      
      // Get the address type for each address
      const addressTypeMappings = Array.from(data.address || []).map(addressId => ({
        address_id: addressId,
        address_type: addressTypeMap[addressId] || "IFS" // Default to IFS if not set
      }));
      
      // Get the team selections
      let teamData;
      if (data.allocatedTeam && data.allocatedTeam.length > 0) {
        if (data.allocatedTeam.length === 1) {
          teamData = { team_id: data.allocatedTeam[0] };
        } else {
          teamData = data.allocatedTeam.map(teamId => ({ team_id: teamId }));
        }
      }

      // Prepare place relationships
      const placeRelationships = [];
      if (data.lelyCenter) {
        placeRelationships.push({
          place_id: data.lelyCenter,
          relationship: "WORKS_FROM",
          location: null
        });
      }
      if (data.startWorkFrom) {
        placeRelationships.push({
          place_id: data.startWorkFrom,
          relationship: "STARTS_WORK_FROM",
          location: null
        });
      }
      if (data.endsWorkAt) {
        placeRelationships.push({
          place_id: data.endsWorkAt,
          relationship: "ENDS_WORK_AT",
          location: null
        });
      }
      if (data.placeForStock) {
        // Include the location value in the FOR_STOCK relationship if available
        const forStockRelationship = {
          place_id: data.placeForStock,
          relationship: "FOR_STOCK",
          location: data.stockLocation || null
        };
        
        placeRelationships.push(forStockRelationship);
      }

      // Format roles
      const rolesData = data.roles?.map(roleId => ({
        role_id: roleId
      })) || [];

      // Prepare user data for API
      const userData: UserCreateData = {
        // Required fields with defaults or extracted values
        person_id: data.ifsUserId || `${data.firstName.substring(0, 1)}${data.lastName}`.toUpperCase(),
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        status: data.personStatus || "01", // Default to active
        license: data.fsmLicense || "NAMED", // Default value
        check_employee: data.employee ? "Y" : "N", // Use actual checkbox value
        default_language: data.language || "EN-US",
        currency: data.currency || "EUR",
        access_group: data.lelyCenter || "", // Convert undefined to empty string
        tech_mx_id: data.technicianIdMX || "", // Convert undefined to empty string
        
        // Optional fields
        work_phone: data.phone,
        job_title: data.jobTitle,
        person_type: data.type,
        req_post_grp: data.requestPostGroup,
        cont_post_grp: data.contractPostGroup,
        check_mobileUser: data.mobileUser ? "Y" : "N",
        check_dispatchable: data.dispatchable ? "Y" : "N",
        check_schedResource: data.schedulingResource ? "Y" : "N",
        check_psoUser: data.psoSystemUser ? "Y" : "N",
        person_group: data.personGroup,
        
        // Complex fields
        places: placeRelationships.length > 0 ? placeRelationships : undefined,
        address: addressTypeMappings.length > 0 ? addressTypeMappings : undefined,
        roles: rolesData.length > 0 ? rolesData : undefined,
        teams: teamData
      };

      // Call the service to create the user
      const result = await userService.createUser(userData);
      
      // Store the response for debugging
      if (isDev) {
        setDebugResponse(result);
      }
      
      if (result.success) {
        toast.success("User created successfully", {
          description: `${data.firstName} ${data.lastName} has been created.`,
          duration: 5000,
          dismissible: true
        });
        
        // Optional: Reset the form or redirect
        // reset();
      } else {
        toast.error("Failed to create user", {
          description: result.error || "An unknown error occurred",
          duration: 5000,
          dismissible: true
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form", {
        description: "Check console for details",
        duration: 5000,
        dismissible: true
      });
      
      // Store the error for debugging
      if (isDev) {
        setDebugResponse(error as Error);
      }
    }
  };

  // Function to handle combobox changes
  const handleComboboxChange = (field: keyof FormValues, value: string) => {
    setValue(field, value, { shouldValidate: true });
    
    // Special handling for address type when changing to DEFAULT
    if (field === "addressType" && value === "DEFAULT") {
      // Check if there's already a DEFAULT address
      const hasDefaultAlready = Object.values(addressTypeMap).includes("DEFAULT");
      if (hasDefaultAlready) {
        // Inform the user they already have a DEFAULT address
        toast.warning("A DEFAULT address already exists. If you select an address with this type, you will receive an error.", {
          duration: 5000,
          dismissible: true,
          description: "Please choose a different address type to add another address."
        });
      }
    }
    
    // Update Contract Post Group and Request Post Group when Lely Center changes
    if (field === "lelyCenter" && value) {
      // Set the same value to all three dropdowns
      setValue("contractPostGroup", value);
      setValue("requestPostGroup", value);
    }
  };

  // Function to get the placeholder class
  const getPlaceholderClass = (value: string | string[] | undefined) => {
    if (!value) return placeholderStyles;
    if (Array.isArray(value) && value.length === 0) return placeholderStyles;
    return "";
  };

  // Function to handle multi-select changes
  const handleMultiSelectChange = (field: keyof FormValues, values: string[]) => {
    setValue(field, values, { shouldValidate: true });
  };

  // Toggle function for view all teams
  const toggleViewAllTeams = () => {
    setViewAllTeams(!viewAllTeams);
  };

  // Toggle function for view all addresses
  const toggleViewAllAddresses = () => {
    setViewAllAddresses(!viewAllAddresses);
  };

  // Function to handle address selection
  const handleAddressChange = (values: string[]) => {
    const currentAddressType = watch("addressType");
    const currentAddresses = watch("address") || [];
    
    // Find new addresses not in the current list
    const newAddresses = values.filter(v => !currentAddresses.includes(v));
    
    if (newAddresses.length > 0) {
      const updatedTypeMap = { ...addressTypeMap };
      
      // Check if we're trying to add a DEFAULT type address when one already exists
      if (currentAddressType === "DEFAULT") {
        // Find if there's already a DEFAULT address
        const hasDefaultAlready = Object.values(updatedTypeMap).includes("DEFAULT");
        
        if (hasDefaultAlready) {
          // Show error and don't add the new addresses with DEFAULT type
          toast.error("Only one DEFAULT address is allowed. Please select a different address type.", {
            duration: 5000,
            dismissible: true,
            className: "bg-destructive text-destructive-foreground border-none",
            description: "Please select a different address type before adding more addresses."
          });
          return;
        }
      }
      
      // Store the address type for each new address - using the currently selected type
      newAddresses.forEach(address => {
        updatedTypeMap[address] = currentAddressType;
      });
      
      setAddressTypeMap(updatedTypeMap);
    }
    
    // Check for removed addresses
    const removedAddresses = currentAddresses.filter(v => !values.includes(v));
    if (removedAddresses.length > 0) {
      const updatedTypeMap = { ...addressTypeMap };
      removedAddresses.forEach(address => {
        delete updatedTypeMap[address];
      });
      setAddressTypeMap(updatedTypeMap);
    }
    
    // For addresses that might not have a type assigned (unlikely, but just in case)
    const missingTypeAddresses = values.filter(v => !addressTypeMap[v] && !newAddresses.includes(v));
    if (missingTypeAddresses.length > 0) {
      const updatedTypeMap = { ...addressTypeMap };
      missingTypeAddresses.forEach(address => {
        // For safety, assign the current type if missing
        updatedTypeMap[address] = currentAddressType;
      });
      setAddressTypeMap(updatedTypeMap);
    }
    
    // Update the form value
    setValue("address", values, { shouldValidate: true });
  };
  
  // Function to get address type name
  const getAddressTypeName = (addressId: string): string => {
    // If we have an entry in the map, use it
    if (addressTypeMap[addressId]) {
      return addressTypeMap[addressId];
    }
    
    // Default to the current selected address type or IFS if nothing else is available
    return watch("addressType") || "IFS";
  };
  
  // Function to remove an address
  const removeAddress = (addressId: string) => {
    const currentAddresses = watch("address") || [];
    const updatedAddresses = currentAddresses.filter(id => id !== addressId);
    
    // Update the form value
    setValue("address", updatedAddresses, { shouldValidate: true });
    
    // Remove from type map
    const updatedTypeMap = { ...addressTypeMap };
    delete updatedTypeMap[addressId];
    setAddressTypeMap(updatedTypeMap);
  };

  // Debug useEffect to monitor address type mappings
  useEffect(() => {
    console.debug('Address Type Map updated:', addressTypeMap);
  }, [addressTypeMap]);

  // Function to handle form clear
  const handleClearForm = () => {
    // Reset the form to default values
    reset();
    // Clear the address type map
    setAddressTypeMap({});
    // Reset view states
    setViewAllTeams(false);
    setViewAllAddresses(false);
    
    toast.info("Form has been cleared", {
      dismissible: true,
      duration: 3000
    });
  };
  
  // Function to handle form save as draft
  const handleSaveDraft = () => {
    // Here you would implement the logic to save the form data as a draft
    // For now, just show a toast message
    toast.success("Form saved as draft", {
      description: "Your changes have been saved as a draft.",
      dismissible: true,
      duration: 3000
    });
  };

  return (
    <div className="min-h-full w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {/* Top Action Buttons */}
        <div className="flex justify-end space-x-2">
          {isDev && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowDebug(!showDebug)}
              title="Toggle Debug Panel"
            >
              <Bug className="h-4 w-4" />
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleSaveDraft}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleClearForm}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            Publish
          </Button>
        </div>

        {/* Debug Panel - Only shown in development mode */}
        {isDev && showDebug && debugResponse && (
          <div className="p-4 border border-yellow-400 bg-yellow-50 rounded-md overflow-auto max-h-96">
            <h3 className="font-bold mb-2 text-yellow-800">Debug: API Response</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(debugResponse, null, 2)}
            </pre>
          </div>
        )}

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
                  //readOnly
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
                      checked={watch("sso")}
                      onCheckedChange={(checked) => setValue("sso", checked === true)}
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
                <Label htmlFor="type">User Type</Label>
                <Combobox
                  options={personTypeOptions}
                  value={watch("type")}
                  onValueChange={(value) => handleComboboxChange("type", value)}
                  placeholder={personTypeLoading ? "Loading types..." : "Select type"}
                  searchPlaceholder="Search type..."
                  className={cn(comboboxStyles, getPlaceholderClass(watch("type")))}
                />
                {personTypeError && (
                  <p className="text-sm text-destructive">
                    {personTypeError.message || 'Failed to load type options'}
                  </p>
                )}
              </div>

              <div className="space-y-2 flex items-center h-full">
                <div className="flex items-center space-x-2 mt-8">
                  <Checkbox
                    id="employee"
                    checked={watch("employee")}
                    onCheckedChange={(checked) => setValue("employee", checked === true)}
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

                {/* Divider between Location and Address sections */}
                <div className="h-px bg-border my-4"></div>

                {/* Address Type and Address in a separate grid row */}
                <div className="grid grid-cols-12 gap-4 mt-4">
                  <div className="col-span-4 space-y-2">
                    <div className="h-[32px] flex items-center">
                      <Label htmlFor="addressType">Address Type</Label>
                    </div>
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
                    <div className="flex justify-between items-center h-[32px]">
                      <Label htmlFor="address">Address</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={toggleViewAllAddresses}
                        className="h-7 text-xs"
                      >
                        {viewAllAddresses ? "Filter by Country" : "Show All Addresses"}
                      </Button>
                    </div>
                    {!viewAllAddresses && startWorkFromCountry && (
                      <p className="text-xs text-muted-foreground -mt-1 mb-1">
                        Addresses filtered by Country: {startWorkFromCountry}
                      </p>
                    )}
                    {/* Custom MultiSelect Implementation */}
                    <div className="space-y-2">
                      <div className="relative">
                        <AddressMultiSelect
                          options={addressOptionsFromApi}
                          values={watch("address") || []}
                          onValuesChange={(values) => handleAddressChange(values)}
                          placeholder={
                            addressesLoading || countryLoading 
                              ? "Loading addresses..." 
                              : "Select Address"
                          }
                          searchPlaceholder="Search addresses..."
                          className={cn(comboboxStyles, getPlaceholderClass(watch("address")))}
                          closeOnSelect={false}
                        />
                      </div>
                      {addressesError && (
                        <p className="text-sm text-destructive">
                          {addressesError.message || 'Failed to load address options'}
                        </p>
                      )}
                      {errors.address && (
                        <p className="text-sm text-destructive">{errors.address.message}</p>
                      )}
                    </div>
                    
                    {/* Selected addresses display area - full width */}
                    <div className="mt-2 space-y-1 w-full col-span-full">
                      {(watch("address") || []).map((addressId, index) => {
                        const addressOption = addressOptionsFromApi.find(option => option.value === addressId);
                        const addressTypeName = getAddressTypeName(addressId);
                        
                        // Get badge color based on address type
                        const getBadgeColor = (type: string) => {
                          switch(type) {
                            case 'DEFAULT': return "bg-green-100 text-green-700 border-green-300";
                            case 'INVOICE': return "bg-blue-100 text-blue-700 border-blue-300";
                            case 'DELIVERY': return "bg-orange-100 text-orange-700 border-orange-300";
                            case 'POSTAL': return "bg-purple-100 text-purple-700 border-purple-300";
                            case 'VISITED': return "bg-green-100 text-green-700 border-green-300";
                            case 'IFS': return "bg-indigo-100 text-indigo-700 border-indigo-300";
                            default: return "bg-gray-100 text-gray-700 border-gray-300";
                          }
                        };
                        
                        const badgeColor = getBadgeColor(addressTypeName);
                        
                        return (
                          <div 
                            key={`${addressId}-${index}`} 
                            className="flex items-center justify-between p-2 rounded-md w-full bg-white border border-gray-200"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={cn(
                                "text-xs px-2 py-1 rounded font-medium shrink-0 border",
                                badgeColor
                              )}>
                                {addressTypeName}
                              </span>
                              <span className="text-sm truncate">{addressOption?.label || addressId}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 rounded-full hover:bg-muted shrink-0"
                              onClick={() => removeAddress(addressId)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </Button>
                          </div>
                        );
                      })}
                    </div>
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
                    checked={watch("mobileUser")}
                    onCheckedChange={(checked) => setValue("mobileUser", checked === true)}
                  />
                  <Label htmlFor="mobileUser" className="ml-2">Mobile User</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dispatchable"
                    checked={watch("dispatchable")}
                    onCheckedChange={(checked) => setValue("dispatchable", checked === true)}
                  />
                  <Label htmlFor="dispatchable" className="ml-2">Dispatchable</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="schedulingResource"
                    checked={watch("schedulingResource")}
                    onCheckedChange={(checked) => setValue("schedulingResource", checked === true)}
                  />
                  <Label htmlFor="schedulingResource" className="ml-2">Scheduling Resource</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="psoSystemUser"
                    checked={watch("psoSystemUser")}
                    onCheckedChange={(checked) => setValue("psoSystemUser", checked === true)}
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
      </form>
    </div>
  );
} 