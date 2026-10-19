export function validateRegisterForm(
        fullName: string,
        email: string,
        password: string,
        confirmPassword: string
    ): string {

        if (fullName.trim() === ""){

            return "Please enter your full name";
        }

        if (fullName.length > 100){

            return "Full name cannot exceed 100 characters";
        }

        if (email.trim() === "") {
            return "Please enter your email";
        }

        if (email.length > 150) {
            return "Email cannot exceed 150 characters";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return "Please enter a valid email address";
        }

        if (password.length < 8) {
            return "Password must contain at least 8 characters";
        }

        if (password.length > 100) {
            return "Password cannot exceed 100 characters";
        }

        if (password !== confirmPassword){

            return "Passwords do not match";
        }

        return "";
    }