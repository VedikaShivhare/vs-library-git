// Reusable, pure validation functions for Kerbside forms (BR B.1).
// Each validator takes a value (and sometimes context) and returns either
// `null` (valid) or a human-readable error string. Keeping these as pure
// functions — rather than inline template logic — is what lets every form
// reuse the same rules consistently and keeps components small.

/** Required-field validation: rejects empty / whitespace-only strings. */
export function validateRequired(value, fieldName = 'This field') {
  if (value === null || value === undefined) return `${fieldName} is required.`
  if (typeof value === 'string' && value.trim().length === 0) {
    return `${fieldName} is required.`
  }
  return null
}

/** Minimum length validation, e.g. for descriptions or titles. */
export function validateMinLength(value, min, fieldName = 'This field') {
  if (!value || value.trim().length < min) {
    return `${fieldName} must be at least ${min} characters.`
  }
  return null
}

/**
 * Victorian postcode format validation: exactly 4 digits, and (loosely)
 * within the 3000–3999 range used by Victorian postcodes. This is a
 * domain-specific format check, distinct from a generic required-field
 * check, and from the date-range business rule below.
 */
export function validatePostcode(value) {
  if (!value || value.trim().length === 0) return 'Postcode is required.'
  const trimmed = value.trim()
  if (!/^\d{4}$/.test(trimmed)) {
    return 'Postcode must be exactly 4 digits.'
  }
  const num = Number(trimmed)
  if (num < 3000 || num > 3999) {
    return 'Please enter a Victorian postcode (3000–3999).'
  }
  return null
}

/** Standard email format validation. */
export function validateEmail(value) {
  if (!value || value.trim().length === 0) return 'Email is required.'
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(value.trim())) {
    return 'Please enter a valid email address.'
  }
  return null
}

/** Password strength validation: minimum length plus at least one number. */
export function validatePassword(value) {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (!/\d/.test(value)) return 'Password must include at least one number.'
  return null
}

/**
 * Business-rule validation for a hard-rubbish collection date: it must be
 * a real date, in the future, and within the next 14 days — mirroring how
 * Victorian councils publish a fixed collection window. This is the
 * domain-specific rule referenced in the A1.1 wireframes (BR B.1), and is
 * a genuinely different *type* of validation to a required-field or
 * format check: it depends on today's date and a business constraint.
 */
export function validateCollectionDate(value) {
  if (!value) return 'Collection date is required.'
  const chosen = new Date(value)
  if (Number.isNaN(chosen.getTime())) return 'Please enter a valid date.'

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const maxDate = new Date(startOfToday)
  maxDate.setDate(maxDate.getDate() + 14)

  if (chosen < startOfToday) {
    return 'Collection date cannot be in the past.'
  }
  if (chosen > maxDate) {
    return 'Collection date must be within the next 14 days.'
  }
  return null
}

/** Numeric range validation, e.g. for a rating input. */
export function validateNumberRange(value, min, max, fieldName = 'Value') {
  const num = Number(value)
  if (value === '' || value === null || Number.isNaN(num)) {
    return `${fieldName} must be a number.`
  }
  if (num < min || num > max) {
    return `${fieldName} must be between ${min} and ${max}.`
  }
  return null
}

/** Category validation against a fixed allowed list (enum-style check). */
export function validateCategory(value, allowedCategories) {
  if (!value) return 'Please select a category.'
  if (!allowedCategories.includes(value)) return 'Please select a valid category.'
  return null
}
