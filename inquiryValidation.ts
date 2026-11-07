function isObviousGarbage(str: string): boolean {
  if (!str) return false;
  const s = str.trim().toLowerCase();
  
  // 1. Check for 4+ consecutive identical characters (e.g. aaaaa, 11111)
  if (/(.)\1{3,}/.test(s)) return true;

  // 2. Obvious keyboard walks / mashing patterns
  const mashPatterns = [
    'asdfgh', 'qwerty', 'zxcvbn', 'hjkl', 'dfgh', 'qwert',
    'akhdawjwf', 'asdfg', 'zxcvb', 'lkjhg', 'poiuy'
  ];
  for (const pat of mashPatterns) {
    if (s.includes(pat)) return true;
  }

  // 3. Check for words of 5+ letters with 0 vowels (in Latin words)
  const words = s.split(/[\s\-_,.]+/).filter((w) => w.length >= 5 && /^[a-z]+$/.test(w));
  for (const w of words) {
    if (!/[aeiouy]/.test(w)) return true;
  }

  return false;
}

export function validateSchoolInquiryField(fieldName: string, value: string): string {
  const val = (value || '').trim();

  switch (fieldName) {
    case 'country':
      if (!val) return 'Please select a country.';
      return '';

    case 'schoolName':
      if (!val) return 'School name is required.';
      if (val.length < 3) return 'School name must be at least 3 characters.';
      if (!/[\p{L}a-zA-Z]/u.test(val)) return 'School name must contain letters.';
      if (isObviousGarbage(val)) return 'Please enter a valid school name, not random characters.';
      return '';

    case 'schoolAdminName':
      if (!val) return 'Contact / Administrator name is required.';
      if (val.length < 2) return 'Contact name must be at least 2 characters.';
      if (/\d/.test(val)) return 'Contact name cannot contain numbers.';
      if (!/[\p{L}a-zA-Z]/u.test(val)) return 'Contact name must contain letters.';
      if (!/^[\p{L}a-zA-Z\s.'-]+$/u.test(val)) {
        return 'Contact name can only contain letters, spaces, hyphens, and apostrophes.';
      }
      if (isObviousGarbage(val)) return 'Please enter a valid human name, not random characters.';
      return '';

    case 'contactEmail':
      if (!val) return 'Contact email is required.';
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(val)) return 'Please enter a valid email address (e.g. admin@school.edu.pk).';
      return '';

    case 'phoneNumber':
      if (!val) return 'Contact phone or WhatsApp number is required.';
      if (/[a-zA-Z]/.test(val)) return 'Phone number cannot contain alphabetic letters (e.g. invalid character).';
      const digitsOnly = val.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        return 'Please enter a valid phone number with 7 to 15 digits.';
      }
      if (!/^(\+?[0-9\s\-()]+)$/.test(val)) {
        return 'Phone number can only contain digits, spaces, hyphens, parentheses, and +.';
      }
      return '';

    case 'subject':
      if (!val) return 'Inquiry subject is required.';
      if (val.length < 3) return 'Subject must be at least 3 characters.';
      if (!/[\p{L}a-zA-Z]/u.test(val)) return 'Subject must contain letters.';
      if (isObviousGarbage(val)) return 'Please enter a valid subject.';
      return '';

    case 'schoolMessage':
      if (!val) return 'Inquiry message or classroom requirements are required.';
      if (val.length < 10) return 'Message must be at least 10 characters detailing your classroom needs.';
      if (!/[\p{L}a-zA-Z]{2,}/u.test(val)) return 'Message must contain meaningful words describing your requirements.';
      if (isObviousGarbage(val)) return 'Please enter a meaningful message describing your requirements.';
      return '';

    default:
      return '';
  }
}
