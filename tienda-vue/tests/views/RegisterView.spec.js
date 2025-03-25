import { mount } from '@vue/test-utils';
import RegisterView from '@/views/RegisterView.vue';
import { useAuthStore } from '@/store/authStore';
import { createRouter, createWebHistory } from 'vue-router';
import { vi } from 'vitest';

vi.mock('@/store/authStore', () => ({
    useAuthStore: vi.fn()
}));
const mockRegisterUser = vi.fn();
const mockAuthStore = {
    registerUser: mockRegisterUser
};
useAuthStore.mockReturnValue(mockAuthStore);
const router = createRouter({
    history: createWebHistory(),
    routes: [{ path: '/', component: { template: '<div>Home</div>' } }]
});
describe('RegisterView', () => {
    it('renderiza correctamente', () => {
        const wrapper = mount(RegisterView, {
            global: {
                plugins: [router]
            }
        });
        expect(wrapper.find('h2').text()).toBe('Crear Cuenta');
    });
    it('llama a registerUser al enviar el formulario', async () => {
        const wrapper = mount(RegisterView, {
            global: {
                plugins: [router]
            }
        });
        await wrapper.find('input[type="text"]').setValue('usuarioTest');
        await wrapper.find('input[type="email"]').setValue('test@email.com');
        await wrapper.find('input[type="password"]').setValue('password123');
        await wrapper.find('form').trigger('submit.prevent');
        expect(mockRegisterUser).toHaveBeenCalledWith('usuarioTest', 'test@email.com', 'password123');
    });
    it('muestra un mensaje de error si el registro falla', async () => {
        mockRegisterUser.mockRejectedValueOnce({ error: 'Error en el registro' });
        const wrapper = mount(RegisterView, {
            global: {
                plugins: [router]
            }
        });
        await wrapper.find('input[type="text"]').setValue('usuarioTest');
        await wrapper.find('input[type="email"]').setValue('test@email.com');
        await wrapper.find('input[type="password"]').setValue('password123');
        await wrapper.find('form').trigger('submit.prevent');
        await wrapper.vm.$nextTick();
        expect(wrapper.text()).toContain('Error en el registro');
    });
});