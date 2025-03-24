import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/store/authStore';
import { vi } from 'vitest';
import { login, register } from '@/api/auth';

vi.mock('@/api/auth', () => ({
    login: vi.fn(),
    register: vi.fn()
}));

describe('Auth Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        localStorage.clear();
    });

    it('almacena el token después de iniciar sesión', async () => {
        login.mockResolvedValue('fake-token');
        const authStore = useAuthStore();

        await authStore.loginUser('testuser', 'password123');

        expect(authStore.token).toBe('fake-token');
        expect(localStorage.getItem('token')).toBe('fake-token');
    });

    it('almacena el token después de registrar un usuario', async () => {
        register.mockResolvedValue('new-user-token');
        const authStore = useAuthStore();

        await authStore.registerUser('testuser', 'test@example.com', 'password123');

        expect(authStore.token).toBe('new-user-token');
        expect(localStorage.getItem('token')).toBe('new-user-token');
    });

    it('elimina el token al cerrar sesión', () => {
        const authStore = useAuthStore();
        authStore.token = 'some-token';
        localStorage.setItem('token', 'some-token');

        authStore.logout();

        expect(authStore.token).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    });
});
