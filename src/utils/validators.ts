// Desc: Utility functions for validating user input.
////////////////////////////////////////////////////////////////////////////////////////
/**
 * Validates a username with length constraints.
 * @param username - The username string.
 * @returns Object with validation result and message.
 */
export const validateUsername = (username: string): { valid: boolean; message?: string } => {
    if (!username || typeof username !== 'string' || username.length < 3 || username.length > 20) {
        return { valid: false, message: 'Username must be between 3 and 20 characters.' };
    }
    return { valid: true };
};

////////////////////////////////////////////////////////////////////////////////////////
/**
 * Validates an email address format.
 * @param email - The email string to validate.
 * @returns Object with validation result and message.
 */
export const validateEmail = (email: string): { valid: boolean; message?: string } => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
        return { valid: false, message: 'Invalid email format.' };
    }
    return { valid: true };
};

////////////////////////////////////////////////////////////////////////////////////////
/**
 * Validates a password with strength requirements.
 * @param password - The password string to validate.
 * @returns Object with validation result and message.
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%-*?&]{8,}$/;
    if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
        return { 
            valid: false, 
            message: 'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.' 
        };
    }
    return { valid: true };
};

////////////////////////////////////////////////////////////////////////////////////////
/**
 * Validates if two passwords match during signup.
 * @param password - The password string.
 * @param confirmPassword - The confirmation password string.
 * @returns Object with validation result and message.
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): { valid: boolean; message?: string } => {
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match.' };
    }
    return { valid: true };
};