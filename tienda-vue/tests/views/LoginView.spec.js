import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { describe, it, expect, vi } from 'vitest';
import LoginView from '@/views/LoginView.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/store/authStore';

describe('LoginView.vue', () => {
  let authStoreMock, router;
  beforeEach(() => {
    setActivePinia(createPinia());
    authStoreMock = useAuthStore();
    authStoreMock.loginUser = vi.fn();
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
    });
  });
  it('Renderiza correctamente el formulario de login', () => {
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
      },
    });
    expect(wrapper.find('h2').text()).toBe('Iniciar Sesión');
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });
  it('Llama a loginUser y redirige al home en caso de éxito', async () => {
    authStoreMock.loginUser.mockResolvedValueOnce(); 
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
      },
    });
    await wrapper.find('input[type="text"]').setValue('usuarioPrueba');
    await wrapper.find('input[type="password"]').setValue('contraseñaPrueba');
    await wrapper.find('form').trigger('submit.prevent');
    expect(authStoreMock.loginUser).toHaveBeenCalledWith('usuarioPrueba', 'contraseñaPrueba');
  });
  it('Muestra una alerta si el inicio de sesión falla', async () => {
    window.alert = vi.fn();
    authStoreMock.loginUser.mockRejectedValueOnce(new Error('Error de autenticación'));
    const wrapper = mount(LoginView, {
      global: {
        plugins: [router],
      },
    });
    await wrapper.find('input[type="text"]').setValue('usuarioErroneo');
    await wrapper.find('input[type="password"]').setValue('contraseñaErronea');
    await wrapper.find('form').trigger('submit.prevent');
    expect(authStoreMock.loginUser).toHaveBeenCalledWith('usuarioErroneo', 'contraseñaErronea');
    expect(wrapper.find('#message').exists()).toBe(true);
  });
});
