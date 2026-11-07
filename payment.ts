export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'VERIFIED'
  | 'APPROVED'
  | 'FAILED'
  | 'REJECTED'
  | 'REFUNDED'
  | 'EXPIRED';

export type PaymentMethod = 'sadapay' | 'jazzcash' | 'bank_transfer' | 'payoneer';

export type PaymentProvider = 'sadapay' | 'jazzcash' | 'bank_transfer' | 'payoneer';

export type Currency = 'PKR' | 'USD';

export type Region = 'pakistan' | 'international';

export type ProductType =
  | 'free_level_1'
  | 'ad_unlock'
  | 'three_activities'
  | 'one_level'
  | 'all_activities'
  | 'school_monthly'
  | 'school_yearly'
  | 'school_license';

export interface SchoolInquiryRecord {
  id: string;
  schoolName: string;
  adminName: string;
  contactEmail: string;
  phone?: string;
  city?: string;
  estimatedDevices: number;
  message?: string;
  status: 'PENDING' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  generatedLicenseKey?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface ProfileRecord {
  id: string;
  email: string;
  displayName?: string;
  fullName?: string;
  role: 'parent' | 'educator' | 'school_admin' | 'admin';
  schoolId?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanRecord {
  id: string;
  name: string;
  description: string;
  type: 'individual' | 'school';
  pricePkr: number;
  priceUsd: number;
  durationMonths: number;
  durationDays: number;
  deviceLimit: number;
  levelNumber?: number | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseRecord {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  planId?: string;
  accessStatus: 'active' | 'expired' | 'revoked';
  accessLevel: string; // 'full' | 'level_1' .. 'level_6'
  startDate: string;
  expiryDate: string;
  paymentStatus: 'paid' | 'pending' | 'failed';
  paymentId?: string;
  createdAt: string;
}

export interface SchoolRecord {
  id: string;
  schoolName: string;
  schoolAdminName: string;
  contactName?: string;
  contactEmail: string;
  phone?: string;
  address?: string;
  country?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  accountStatus: 'active' | 'suspended' | 'pending' | 'inactive';
  paymentStatus: 'paid' | 'pending' | 'unpaid';
  planId?: string;
  deviceLimit: number;
  customPrice?: number | null;
  customDeviceLimit?: number | null;
  customDealNote?: string | null;
  currency: Currency;
  subscriptionStart?: string | null;
  subscriptionExpiry?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
}

export const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'PK', name: 'Pakistan', dialCode: '+92' },
  { code: 'AE', name: 'United Arab Emirates', dialCode: '+971' },
  { code: 'SA', name: 'Saudi Arabia', dialCode: '+966' },
  { code: 'QA', name: 'Qatar', dialCode: '+974' },
  { code: 'KW', name: 'Kuwait', dialCode: '+965' },
  { code: 'OM', name: 'Oman', dialCode: '+968' },
  { code: 'BH', name: 'Bahrain', dialCode: '+973' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'CA', name: 'Canada', dialCode: '+1' },
  { code: 'AU', name: 'Australia', dialCode: '+61' },
  { code: 'MY', name: 'Malaysia', dialCode: '+60' },
  { code: 'SG', name: 'Singapore', dialCode: '+65' },
  { code: 'DE', name: 'Germany', dialCode: '+49' },
  { code: 'FR', name: 'France', dialCode: '+33' },
  { code: 'OTHER', name: 'Other Country', dialCode: '' }
];

export interface SchoolDeviceRecord {
  id: string;
  schoolId: string;
  userIdentifier?: string;
  deviceIdentifier: string;
  deviceId?: string;
  deviceName?: string;
  registeredAt: string;
  lastLogin: string;
  status: 'ACTIVE' | 'REVOKED';
  isActive: boolean;
  revokedAt?: string;
}

export interface SchoolRequestRecord {
  id: string;
  schoolId: string;
  schoolName?: string;
  requestedBy: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'approved' | 'rejected';
  adminReply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
}

export interface SchoolMessageRecord {
  id: string;
  schoolId: string;
  schoolName?: string;
  senderId: string;
  senderType: 'school' | 'admin';
  message: string;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
}

export interface SchoolPaymentRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  planId: string;
  standardPrice: number;
  customPrice?: number | null;
  amount: number;
  currency: Currency;
  deviceLimit: number;
  paymentMethod: 'sadapay' | 'jazzcash' | 'bank_transfer';
  transactionReference: string;
  paymentProofName?: string | null;
  paymentProofUrl?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface IndividualPaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  planId: string;
  selectedLevel?: number | null;
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  transactionReference: string;
  paymentProofName?: string | null;
  paymentProofUrl?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
}

export interface PaymentMethodConfigRecord {
  id: string;
  name: string;
  paymentScope: 'individual' | 'school' | 'both';
  receivingEmail?: string | null;
  accountTitle?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  iban?: string | null;
  instructions: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ContentRecord {
  id: string;
  title: string;
  type: 'activity' | 'worksheet' | 'rhyme' | 'flashcard';
  category: string;
  data: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

export interface AdminSettingRecord {
  id: string;
  key: string;
  value: any;
  updatedAt: string;
}

export interface PremiumProduct {
  id: string;
  title: string;
  type: ProductType;
  pricePkr: number;
  priceUsd: number;
  durationDays: number;
  description: string;
  isActive: boolean;
  levelNumber?: number;
}

export interface PremiumOrder {
  id: string;
  userId: string;
  userEmail: string;
  productId: string;
  productType: ProductType;
  selectedLevel?: number; // 1 to 6
  totalAmount: number;
  currency: Currency;
  region?: Region;
  paymentMethod?: string;
  transactionReference?: string;
  orderStatus: 'PENDING' | 'PROCESSING' | 'VERIFIED' | 'APPROVED' | 'REJECTED' | 'FAILED' | 'REFUNDED' | 'EXPIRED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string; // ISO
}

export interface PaymentRecord {
  id: string;
  orderId?: string;
  userId: string;
  userEmail: string;
  productId: string;
  selectedLevel?: number; // 1 to 6
  amount: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  provider: PaymentProvider;
  providerTransactionId: string;
  paymentStatus: PaymentStatus;
  paymentProofName?: string;
  paymentProofUrl?: string;
  paymentMetadata?: Record<string, any>;
  verifiedBy?: string;
  adminNotes?: string;
  createdAt: string; // ISO
  verifiedAt?: string; // ISO
  expiryDate?: string; // ISO
}

export interface UserLicense {
  id: string;
  userId: string;
  userEmail: string;
  licenseType: 'three_activities' | 'all_activities' | 'one_level';
  unlockedLevels: number[]; // e.g. [2] or [1,2,3,4,5,6]
  unlockedActivityIds?: string[]; // For 3 activities pack
  allActivitiesUnlocked: boolean;
  paymentId?: string;
  startDate: string; // ISO
  expiryDate: string; // ISO (7 days for 3-activities, 30 days for full app)
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  verificationType?: 'PROVIDER_VERIFIED' | 'ADMIN_VERIFIED' | 'UNVERIFIED_MANUAL';
  verifiedBy?: string;
  pricePaid: number;
  currency: Currency;
  createdAt: string; // ISO
}

export interface SchoolTierConfig {
  id: string;
  durationMonths: number; // 1, 3, 6, 12
  label: string;
  title: string;
  description: string;
  pricePkr: number;
  priceUsd: number;
  maxDevices: number;
  page1Access: boolean;
  page2Access: boolean;
  isActive: boolean;
}

export interface SchoolPricingConfig {
  tiers: SchoolTierConfig[];
  updatedAt: string;
}

export interface SchoolLicense {
  id: string;
  licenseKey?: string;
  schoolId: string;
  schoolName: string;
  schoolAdminName?: string;
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  phoneNumber?: string;
  country?: string;
  city?: string;
  price: number;
  currency: Currency;
  allowedDevices: number;
  page1Access: boolean; // Playroom
  page2Access: boolean; // Preschool Educator Hub
  startDate?: string | null; // ISO (actual activation start date)
  expiryDate?: string | null; // ISO (actual calculated expiry date)
  validFrom?: string | null; // ISO
  validUntil?: string | null; // ISO
  activatedAt?: string | null; // ISO (exact server activation timestamp)
  configuredStartDate?: string | null; // Admin configured start date (YYYY-MM-DD or ISO)
  configuredExpiryDate?: string | null; // Admin configured deadline expiry date (ISO)
  configuredDurationDays?: number | null; // Admin configured duration in days (e.g. 21)
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'PENDING' | 'NOT_ACTIVATED';
  isRedeemed?: boolean;
  durationMonths: number;
  durationDays?: number;
  paymentId?: string;
  createdBy?: string;
  verifiedBy?: string;
  adminNotes?: string;
  createdAt: string; // ISO
}

export interface SchoolPaymentRequest {
  id: string;
  schoolId?: string;
  licenseKey?: string;
  generatedLicenseKey?: string;
  schoolName: string;
  schoolAdminName: string;
  contactName?: string;
  contactEmail: string;
  contactPhone?: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  subject?: string;
  message?: string;
  estimatedStudents?: number;
  allowedDevices: number;
  durationMonths: number; // 1, 3, 6, 12
  durationDays?: number;
  configuredDurationDays?: number;
  configuredStartDate?: string;
  configuredExpiryDate?: string;
  page1Access: boolean;
  page2Access: boolean;
  amount: number;
  currency: Currency; // 'PKR' | 'USD'
  paymentMethod: 'sadapay' | 'jazzcash' | 'bank_transfer' | 'payoneer';
  transactionReference: string;
  paymentDate: string;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
  schoolMessage?: string;
  notes?: string;
  proofUrl?: string;
  finalPrice?: number;
  finalCurrency?: Currency;
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
  createdAt?: string;
  schoolLicenseId?: string;
}

export type DisputeStatus =
  | 'OPEN'
  | 'UNDER_REVIEW'
  | 'RESOLVED_APPROVED'
  | 'RESOLVED_REJECTED';

export interface PaymentIssue {
  id: string;
  paymentId: string;
  orderId?: string;
  userId: string;
  userEmail: string;
  paymentMethod: PaymentMethod;
  amount: number;
  currency: Currency;
  transactionId: string;
  paymentDate: string; // YYYY-MM-DD or ISO
  userMessage: string;
  status: DisputeStatus;
  adminResponse?: string;
  submittedAt: string; // ISO
  resolvedAt?: string; // ISO
  resolvedBy?: string;
}

export interface NotificationRecord {
  id: string;
  userId: string;
  userEmail?: string;
  type: 'PAYMENT_PENDING' | 'PAYMENT_APPROVED' | 'PAYMENT_REJECTED' | 'LICENSE_EXPIRING' | 'LICENSE_EXPIRED' | 'GENERAL';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface FeedbackRecord {
  id: string;
  userId?: string;
  userEmail?: string;
  rating: number;
  message: string;
  status: 'PENDING' | 'REVIEWED' | 'ARCHIVED';
  adminReply?: string;
  createdAt: string;
}

export interface ProviderConfig {
  id: PaymentProvider;
  name: string;
  enabled: boolean;
  isLive: boolean;
  instructions: string;
  accountTitle?: string;
  accountNumber?: string;
  bankName?: string;
  iban?: string;
  email?: string;
  hasApiConfigured: boolean;
  requiredEnvVars: string[];
}

export interface SchoolRenewalRequest {
  id: string;
  licenseKey: string;
  schoolId?: string;
  schoolName: string;
  contactEmail: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  previousExpiryDate?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requestedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
  adminNotes?: string;
}

export interface SchoolComplaint {
  id: string;
  schoolName: string;
  contactName: string;
  contactEmail: string;
  phoneNumber?: string;
  category: 'license_issue' | 'technical_bug' | 'curriculum_request' | 'billing_payment' | 'general_feedback' | 'other';
  subject: string;
  complaintText: string;
  attachmentDataUrl?: string;
  attachmentName?: string;
  attachmentType?: string;
  attachmentSize?: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  submittedAt: string;
  resolvedAt?: string;
  adminReplyNotes?: string;
}

