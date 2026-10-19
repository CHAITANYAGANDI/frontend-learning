export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    refreshToken: string;
};


export type RegisterRequest = {

    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type RegisterResponse = {

    accessToken: string;
    refreshToken: string;
}