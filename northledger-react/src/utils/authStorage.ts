import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants/auth";

export function saveAuthTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY,accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getAccessToken(): string | null {

    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function clearAuthTokens(): void {

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}