/**
 * Utility functions for validation
 */

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

/**
 * Validates if a string is a valid UUID format
 * @param uuid - The string to validate
 * @returns - True if valid UUID, false otherwise
 */
export const isValidUUID = (uuid: string | undefined): boolean => {
  if (!uuid || typeof uuid !== 'string') {
    return false;
  }
  
  // UUID v4 regex pattern
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid.trim());
};

/**
 * Validates promo code format
 * @param promoCode - The promo code to validate
 * @returns - Validation result with isValid and error message
 */
export const validatePromoCode = (promoCode: string): ValidationResult => {
  if (!promoCode || promoCode.trim().length === 0) {
    return {
      isValid: false,
      error: 'Промо-код не может быть пустым'
    };
  }

  if (!isValidUUID(promoCode.trim())) {
    return {
      isValid: false,
      error: 'Не верный формат промо кода'
    };
  }

  return {
    isValid: true,
    error: null
  };
};

