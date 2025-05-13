export interface ResetPasswordDto {
  token: string,
  otp: string,
  newPassword: string,
}