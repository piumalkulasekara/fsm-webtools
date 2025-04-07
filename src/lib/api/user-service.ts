import { toast } from "sonner";

/**
 * Interface for a user record
 */
export interface UserCreateData {
  // Required fields
  person_id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  license: string;
  check_employee: string;
  default_language: string;
  currency: string;
  access_group: string;
  tech_mx_id: string;
  
  // Optional fields
  work_phone?: string;
  job_title?: string;
  person_type?: string;
  category?: string;
  check_globalPerson?: string;
  check_partChangeAllow?: string;
  req_post_grp?: string;
  cont_post_grp?: string;
  check_mobileUser?: string;
  check_dispatchable?: string;
  check_schedResource?: string;
  check_psoUser?: string;
  person_group?: string;
  
  // Complex fields
  places?: Array<{
    place_id: string;
    relationship: string;
  }>;
  
  address?: Array<{
    address_id: string;
    address_type: string;
  }>;
  
  roles?: Array<{
    role_id: string;
  }>;
  
  teams?: {
    team_id: string;
  } | Array<{
    team_id: string;
  }>;
}

/**
 * Response structure from the API after creating a user
 */
export interface CreateUserResponse {
  // This will depend on what the actual OData API returns
  // but we'll define a basic structure to fix the 'any' type
  success: boolean;
  data?: unknown;
  message?: string;
}

/**
 * Service for user operations
 */
export const userService = {
  /**
   * Create a new user
   */
  async createUser(userData: UserCreateData): Promise<{ success: boolean; data?: CreateUserResponse; error?: string }> {
    try {
      const response = await fetch('/api/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error creating user:', result);
        toast.error('Failed to create user. Check console for details.');
        return {
          success: false,
          error: result.error || 'An unknown error occurred',
        };
      }
      
      return {
        success: true,
        data: result as CreateUserResponse,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user. Check console for details.');
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  },
}; 