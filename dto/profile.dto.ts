/**
 * Profile DTOs
 * Data transfer objects for profile-related operations
 */

export interface UserProfileUpdateDTO {
    full_name: string;
}

export interface PasswordChangeDTO {
    current_password: string;
    new_password: string;
}

export interface PasswordChangeResponseDTO {
    message: string;
}
