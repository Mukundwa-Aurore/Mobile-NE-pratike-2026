export interface ValidationResult {
  valid: boolean;
  message: string;
}

const WORD_PATTERN = /^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSearchWord(input: string): ValidationResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, message: 'Please enter a word before searching.' };
  }

  if (trimmed.length < 2) {
    return { valid: false, message: 'Word must be at least 2 characters long.' };
  }

  if (trimmed.length > 45) {
    return { valid: false, message: 'Word is too long. Please enter a single dictionary word.' };
  }

  if (!WORD_PATTERN.test(trimmed)) {
    return {
      valid: false,
      message: 'Use only letters, hyphens, or apostrophes (e.g. hello, co-operate).',
    };
  }

  return { valid: true, message: '' };
}

export function validateFullName(name: string): ValidationResult {
  const trimmed = name.trim();

  if (!trimmed) {
    return { valid: false, message: 'Full name is required.' };
  }

  if (trimmed.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters.' };
  }

  return { valid: true, message: '' };
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();

  if (!trimmed) {
    return { valid: false, message: 'Email address is required.' };
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return { valid: false, message: 'Enter a valid email address.' };
  }

  return { valid: true, message: '' };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }

  return { valid: true, message: '' };
}
