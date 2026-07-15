export function validateLoginForm(email: string, password: string): string {
    if (email.trim() === "" || password.trim() === "") {
        return "Please enter email and password";
    }

    if (!email.includes("@")) {
        return "Please enter a valid email address";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    return "";
}

