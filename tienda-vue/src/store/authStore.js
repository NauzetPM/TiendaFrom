import { defineStore } from 'pinia';
import { login, register } from '@/api/auth';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null
    }),
    actions: {
        async loginUser(username, password) {
            const token = await login(username, password);
            this.token = token;
            localStorage.setItem('token', token);
        },
        async registerUser(username, email, password) {
            const token = await register(username, email, password);
            this.token = token;
            localStorage.setItem('token', token);

        },
        logout() {
            this.token = null;
            localStorage.removeItem('token');
        }
    }
});
