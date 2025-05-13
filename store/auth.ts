import { defineStore } from 'pinia'

interface AuthState {
    accessToken: string | null
    tokenType: string | null
    email: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        accessToken: process.client ? localStorage.getItem('access_token') : null,
        tokenType: process.client ? localStorage.getItem('token_type') : null,
        email: process.client ? localStorage.getItem('user_email') : null,
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                const response = await fetch('http://127.0.0.1:8000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (data.access_token) {
                    this.accessToken = data.access_token;
                    this.tokenType = data.token_type;
                    this.email = email;

                    if (process.client) {
                        localStorage.setItem('access_token', this.accessToken);
                        localStorage.setItem('token_type', this.tokenType!);
                        localStorage.setItem('user_email', email);
                    }
                } else {
                    throw new Error('Invalid request');
                }
            } catch (error) {
                console.error('Ошибка авторизации:', error);
                throw error;
            }
        },

        logout() {
            this.accessToken = null
            this.tokenType = null
            this.email = null

            if (process.client) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('token_type')
                localStorage.removeItem('user_email')
            }
        },
    },

    getters: {
        isAuthenticated: (state) => !!state.accessToken,
        authHeader: (state) =>
            state.accessToken && state.tokenType
                ? `${state.tokenType} ${state.accessToken}`
                : '',
    },
})