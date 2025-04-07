import { NextRequest, NextResponse } from 'next/server';
import { apiClient, ApiError } from '@/lib/api/client';
import { z } from 'zod';

// Define validation schema for required fields
const createUserSchema = z.object({
  // Required fields
  person_id: z.string().min(1, "Person ID is required"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  status: z.string().min(1, "Status is required"),
  license: z.string().min(1, "License is required"),
  check_employee: z.string().min(1, "Employee check is required"),
  default_language: z.string().min(1, "Default language is required"),
  currency: z.string().min(1, "Currency is required"),
  access_group: z.string().min(1, "Access group is required"),
  tech_mx_id: z.string().min(1, "Technician MX ID is required"),
  
  // Optional fields
  work_phone: z.string().optional(),
  job_title: z.string().optional(),
  person_type: z.string().optional(),
  category: z.string().optional(),
  check_globalPerson: z.string().optional(),
  check_partChangeAllow: z.string().optional(),
  req_post_grp: z.string().optional(),
  cont_post_grp: z.string().optional(),
  check_mobileUser: z.string().optional(),
  check_dispatchable: z.string().optional(),
  check_schedResource: z.string().optional(),
  check_psoUser: z.string().optional(),
  person_group: z.string().optional(),
  
  // Array fields
  places: z.array(
    z.object({
      place_id: z.string(),
      relationship: z.string()
    })
  ).optional(),
  
  address: z.array(
    z.object({
      address_id: z.string(),
      address_type: z.string()
    })
  ).optional(),
  
  roles: z.array(
    z.object({
      role_id: z.string()
    })
  ).optional(),
  
  teams: z.union([
    z.object({ team_id: z.string() }),
    z.array(z.object({ team_id: z.string() }))
  ]).optional(),
});

// Type for the request body
type CreateUserRequest = z.infer<typeof createUserSchema>;

/**
 * POST handler for creating a user
 * Sends data to the perform_inbound_integration OData endpoint
 */
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const requestData: CreateUserRequest = await request.json();
    
    // Validate the request body
    const validationResult = createUserSchema.safeParse(requestData);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    // Log the payload for debugging purposes
    const payload = {
      parameters: {
        xml_import: {
          inbound: {
            person: {
              ...validationResult.data,
            }
          }
        }
      }
    };
    
    console.log('Sending payload to OData API:', JSON.stringify(payload, null, 2));
    
    // Send the request to the OData API
    try {
      const response = await apiClient.post(
        'perform_inbound_integration',
        payload
      );
      
      console.log('OData API response:', JSON.stringify(response, null, 2));
      
      // Return the response from the OData API
      return NextResponse.json(response, { status: 200 });
    } catch (apiError) {
      console.error('OData API error:', apiError);
      
      // Log the error response if available
      if ((apiError as ApiError).data) {
        console.error('OData API error details:', JSON.stringify((apiError as ApiError).data, null, 2));
      }
      
      // Return a detailed error response
      return NextResponse.json(
        { 
          error: 'Failed to create user in OData API', 
          message: (apiError as Error).message, 
          details: (apiError as ApiError).data || 'No details available'
        },
        { status: (apiError as ApiError).status || 500 }
      );
    }
  } catch (error) {
    // Log the error
    console.error('Error creating user:', error);
    
    // Return an error response
    return NextResponse.json(
      { error: 'Failed to create user', message: (error as Error).message },
      { status: 500 }
    );
  }
} 