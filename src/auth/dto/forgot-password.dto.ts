export interface ForgotPasswordDto {
  email: string;
  password: string;
  confirmPassword: string;
  verificationCode: string;
}