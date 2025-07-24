// API validation middleware for Next.js App Router
// Integrates Zod schemas with route handlers

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateInput, getValidationErrors } from '@/lib/validation';

// Generic validation middleware factory
export function withValidation<T>(schema: z.ZodSchema<T>) {
  return function validationMiddleware(
    handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>
  ) {
    return async function wrappedHandler(request: NextRequest) {
      try {
        // Parse request body
        let requestData: unknown;
        
        if (request.method === 'GET') {
          // For GET requests, validate query parameters
          const url = new URL(request.url);
          requestData = Object.fromEntries(url.searchParams);
          
          // Convert numeric strings to numbers for query params
          Object.keys(requestData as Record<string, string>).forEach(key => {
            const value = (requestData as Record<string, string>)[key];
            if (!isNaN(Number(value)) && value !== '') {
              (requestData as Record<string, any>)[key] = Number(value);
            }
            
            // Convert boolean strings
            if (value === 'true') (requestData as Record<string, any>)[key] = true;
            if (value === 'false') (requestData as Record<string, any>)[key] = false;
          });
        } else {
          // For POST/PUT/PATCH requests, validate body
          try {
            requestData = await request.json();
          } catch (error) {
            return NextResponse.json(
              { 
                error: 'Invalid JSON format',
                code: 'INVALID_JSON'
              },
              { status: 400 }
            );
          }
        }

        // Validate data against schema
        const validation = validateInput(schema, requestData);
        
        if (!validation.success) {
          const errors = getValidationErrors(validation.errors!);
          
          return NextResponse.json(
            {
              error: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: errors,
              fields: Object.keys(errors)
            },
            { status: 400 }
          );
        }

        // Call the original handler with validated data
        return await handler(request, validation.data!);
        
      } catch (error) {
        console.error('Validation middleware error:', error);
        
        return NextResponse.json(
          {
            error: 'Internal server error',
            code: 'INTERNAL_ERROR'
          },
          { status: 500 }
        );
      }
    };
  };
}

// Body validation for non-GET requests
export function validateRequestBody<T>(schema: z.ZodSchema<T>) {
  return async function validateBody(request: NextRequest): Promise<{
    success: boolean;
    data?: T;
    response?: NextResponse;
  }> {
    try {
      const body = await request.json();
      const validation = validateInput(schema, body);
      
      if (!validation.success) {
        const errors = getValidationErrors(validation.errors!);
        
        return {
          success: false,
          response: NextResponse.json(
            {
              error: 'Validation failed',
              code: 'VALIDATION_ERROR', 
              details: errors
            },
            { status: 400 }
          )
        };
      }
      
      return {
        success: true,
        data: validation.data
      };
    } catch (error) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Invalid JSON format',
            code: 'INVALID_JSON'
          },
          { status: 400 }
        )
      };
    }
  };
}

// Query parameter validation for GET requests
export function validateQueryParams<T>(schema: z.ZodSchema<T>) {
  return function validateQuery(request: NextRequest): {
    success: boolean;
    data?: T;
    response?: NextResponse;
  } {
    try {
      const url = new URL(request.url);
      const queryParams = Object.fromEntries(url.searchParams);
      
      // Type conversion for query parameters
      const processedParams: Record<string, any> = {};
      
      Object.entries(queryParams).forEach(([key, value]) => {
        // Convert numeric strings
        if (!isNaN(Number(value)) && value !== '') {
          processedParams[key] = Number(value);
        }
        // Convert boolean strings
        else if (value === 'true') {
          processedParams[key] = true;
        }
        else if (value === 'false') {
          processedParams[key] = false;
        }
        // Keep as string
        else {
          processedParams[key] = value;
        }
      });
      
      const validation = validateInput(schema, processedParams);
      
      if (!validation.success) {
        const errors = getValidationErrors(validation.errors!);
        
        return {
          success: false,
          response: NextResponse.json(
            {
              error: 'Invalid query parameters',
              code: 'INVALID_QUERY_PARAMS',
              details: errors
            },
            { status: 400 }
          )
        };
      }
      
      return {
        success: true,
        data: validation.data
      };
    } catch (error) {
      return {
        success: false,
        response: NextResponse.json(
          {
            error: 'Failed to parse query parameters',
            code: 'QUERY_PARSE_ERROR'
          },
          { status: 400 }
        )
      };
    }
  };
}

// Middleware for specific HTTP methods
export const validatePOST = <T>(schema: z.ZodSchema<T>) => 
  withValidation(schema);

export const validateGET = <T>(schema: z.ZodSchema<T>) =>
  withValidation(schema);

export const validatePUT = <T>(schema: z.ZodSchema<T>) =>
  withValidation(schema);

export const validatePATCH = <T>(schema: z.ZodSchema<T>) =>
  withValidation(schema);

export const validateDELETE = <T>(schema: z.ZodSchema<T>) =>
  withValidation(schema);

// Rate limiting integration with validation
export function withValidationAndRateLimit<T>(
  schema: z.ZodSchema<T>,
  rateLimitKey: string
) {
  return function validationRateLimitMiddleware(
    handler: (request: NextRequest, validatedData: T) => Promise<NextResponse>
  ) {
    return withValidation(schema)(async (request: NextRequest, validatedData: T) => {
      // Rate limiting would be applied in the main middleware.ts
      // This is just a placeholder for the pattern
      return await handler(request, validatedData);
    });
  };
}

// Custom error response builder
export function buildValidationErrorResponse(
  errors: z.ZodError,
  customMessage?: string
): NextResponse {
  const errorDetails = getValidationErrors(errors);
  
  return NextResponse.json(
    {
      error: customMessage || 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: errorDetails,
      fields: Object.keys(errorDetails),
      timestamp: new Date().toISOString()
    },
    { 
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

// Helper for API route validation patterns
export class APIValidator {
  static async validateAndExecute<TBody, TQuery = any>(
    request: NextRequest,
    options: {
      bodySchema?: z.ZodSchema<TBody>;
      querySchema?: z.ZodSchema<TQuery>;
      handler: (data: { body?: TBody; query?: TQuery }) => Promise<NextResponse>;
    }
  ): Promise<NextResponse> {
    try {
      const data: { body?: TBody; query?: TQuery } = {};
      
      // Validate query parameters if schema provided
      if (options.querySchema) {
        const queryValidation = validateQueryParams(options.querySchema)(request);
        if (!queryValidation.success) {
          return queryValidation.response!;
        }
        data.query = queryValidation.data;
      }
      
      // Validate body if schema provided and not GET request
      if (options.bodySchema && request.method !== 'GET') {
        const bodyValidation = await validateRequestBody(options.bodySchema)(request);
        if (!bodyValidation.success) {
          return bodyValidation.response!;
        }
        data.body = bodyValidation.data;
      }
      
      return await options.handler(data);
      
    } catch (error) {
      console.error('API validation error:', error);
      
      return NextResponse.json(
        {
          error: 'Internal server error',
          code: 'INTERNAL_ERROR',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      );
    }
  }
}

// Sanitization middleware
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return data
      .trim()
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/[<>]/g, ''); // Remove basic HTML
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    Object.keys(data).forEach(key => {
      sanitized[key] = sanitizeInput(data[key]);
    });
    return sanitized;
  }
  
  return data;
}

// Export commonly used validation patterns
export const commonValidations = {
  id: z.string().uuid('Invalid ID format'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^(\+973|00973|973)?[0-9]{8}$/, 'Invalid Bahrain phone number'),
  password: z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, 'Password must contain uppercase, lowercase, number, and special character'),
  price: z.number().positive().max(100000).multipleOf(0.001),
  locale: z.enum(['en', 'ar']),
  pagination: z.object({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20)
  })
} as const;