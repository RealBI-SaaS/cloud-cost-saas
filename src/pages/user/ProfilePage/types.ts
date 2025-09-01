export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}