// User types
export interface User {
  id: number;
  username: string;
  fullName: string;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

// Promo code types
export interface PromoCodeStatus {
  code: string;
  isActive: boolean;
  createdAt: string;
  deactivatedAt: string | null;
  deactivatedBy: string | null;
  deactivationReason: string | null;
}

export interface PromoCodeStatusResponse {
  message: string;
  status: PromoCodeStatus;
}

export interface DeactivateResponse {
  message: string;
  deactivatedAt: string;
  deactivatedBy: string;
}

// API Error types
export interface ApiError {
  error: string;
}

export interface ValidationError {
  msg: string;
  param: string;
  location: string;
}

export interface ValidationErrors {
  errors: ValidationError[];
}

// Auth Context types
export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// Modal props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface LogoutModalProps extends ModalProps {
  onConfirm: () => void;
}

export interface DeactivateModalProps extends ModalProps {
  onConfirm: () => void;
  promoCode: string;
  loading: boolean;
}

// QR Scanner props
export interface QRScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

// PWA Install Prompt
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

