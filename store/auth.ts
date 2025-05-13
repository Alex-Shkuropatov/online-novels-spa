import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: useCookie<string | null>('access_token').value,
        tokenType: useCookie<string | null>('token_type').value,
        email: useCookie<string | null>('user_email').value,
    }),

    actions: {
        async login(email: string, password: string) {
            try {
                const { data, error } = await useFetch('http://127.0.0.1:8000/auth/login', {
                    method: 'POST',
                    body: {
                        email,
                        password,
                    },
                })

                if (error.value || !data.value?.access_token) {
                    throw new Error('Ошибка авторизации')
                }

                const access_token = data.value.access_token
                const token_type = data.value.token_type

                // сохраняем
                this.accessToken = access_token
                this.tokenType = token_type
                this.email = email

                // в куки
                useCookie('access_token').value = access_token
                useCookie('token_type').value = token_type
                useCookie('user_email').value = email
            } catch (err) {
                console.error('[auth/login] Ошибка:', err)
                throw err
            }
        },

        logout() {
            this.accessToken = null
            this.tokenType = null
            this.email = null

            useCookie('access_token').value = null
            useCookie('token_type').value = null
            useCookie('user_email').value = null
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

// interface AuthState {
//     accessToken: string | null
//     tokenType: string | null
//     email: string | null
// }
// export const useAuthStore = defineStore('auth', {
//     state: (): AuthState => ({
//         accessToken: import.meta.client ? localStorage.getItem('access_token') : null,
//         tokenType: import.meta.client ? localStorage.getItem('token_type') : null,
//         email: import.meta.client ? localStorage.getItem('user_email') : null,
//     }),
//
//     actions: {
//         async login(email: string, password: string) {
//             try {
//                 const response = await fetch('http://127.0.0.1:8000/auth/login', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ email, password }),
//                 });
//
//                 const data = await response.json();
//
//                 if (data.access_token) {
//                     this.accessToken = data.access_token;
//                     this.tokenType = data.token_type;
//                     this.email = email;
//
//                     if (process.client) {
//                         localStorage.setItem('access_token', this.accessToken);
//                         localStorage.setItem('token_type', this.tokenType!);
//                         localStorage.setItem('user_email', email);
//                     }
//                 } else {
//                     throw new Error('Invalid request');
//                 }
//             } catch (error) {
//                 console.error('Ошибка авторизации:', error);
//                 throw error;
//             }
//         },
//
//         logout() {
//             this.accessToken = null
//             this.tokenType = null
//             this.email = null
//
//             if (process.client) {
//                 localStorage.removeItem('access_token')
//                 localStorage.removeItem('token_type')
//                 localStorage.removeItem('user_email')
//             }
//         },
//     },
//
//     getters: {
//         isAuthenticated: (state) => !!state.accessToken,
//         authHeader: (state) =>
//             state.accessToken && state.tokenType
//                 ? `${state.tokenType} ${state.accessToken}`
//                 : '',
//     },
// })