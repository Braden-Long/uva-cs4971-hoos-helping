/**
 * US Address Validation Utilities
 */

// List of US state abbreviations
export const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC", // District of Columbia
];

export interface Address {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AddressValidationResult {
  valid: boolean;
  errors: { field: string; message: string }[];
}

/**
 * Validates a US ZIP code format
 * Supports 5-digit (12345) and ZIP+4 (12345-6789) formats
 */
export function validateZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode.trim());
}

/**
 * Validates US state abbreviation
 */
export function validateState(state: string): boolean {
  return US_STATES.includes(state.toUpperCase().trim());
}

/**
 * Comprehensive US address validation
 */
export function validateUSAddress(
  address: Partial<Address>
): AddressValidationResult {
  const errors: { field: string; message: string }[] = [];

  // Validate address line 1
  if (!address.addressLine1 || address.addressLine1.trim().length < 5) {
    errors.push({
      field: "addressLine1",
      message: "Street address is required (minimum 5 characters)",
    });
  }

  // Validate city
  if (!address.city || address.city.trim().length < 2) {
    errors.push({
      field: "city",
      message: "City is required (minimum 2 characters)",
    });
  }

  // Validate state
  if (!address.state) {
    errors.push({
      field: "state",
      message: "State is required",
    });
  } else if (!validateState(address.state)) {
    errors.push({
      field: "state",
      message: "Please enter a valid US state abbreviation (e.g., VA, NY, CA)",
    });
  }

  // Validate ZIP code
  if (!address.zipCode) {
    errors.push({
      field: "zipCode",
      message: "ZIP code is required",
    });
  } else if (!validateZipCode(address.zipCode)) {
    errors.push({
      field: "zipCode",
      message: "Please enter a valid ZIP code (e.g., 12345 or 12345-6789)",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Formats an address object into a single-line string for API calls
 */
export function formatAddressForSearch(address: Address): string {
  const parts = [
    address.addressLine1,
    address.addressLine2,
    address.city,
    address.state,
    address.zipCode,
  ].filter(Boolean);

  return parts.join(", ");
}

/**
 * Checks if user has a complete address on file
 */
export function hasCompleteAddress(user: {
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}): boolean {
  if (!user.addressLine1 || !user.city || !user.state || !user.zipCode) {
    return false;
  }

  const validation = validateUSAddress({
    addressLine1: user.addressLine1,
    city: user.city,
    state: user.state,
    zipCode: user.zipCode,
  });

  return validation.valid;
}
