import { shallowMount } from '@vue/test-utils';
import ResetPassword from '@/views/ResetPassword.vue';
import axios from 'axios';
import { vi } from 'vitest';
import { createRouter, createWebHistory } from 'vue-router';

vi.mock('axios');
const mockRouterPush = vi.fn();
const router = createRouter({
    history: createWebHistory(),
    routes: []
  });
  router.push = mockRouterPush;
describe('ResetPassword.vue', () => {
    let wrapper;

    beforeEach(() => {
        
        wrapper = shallowMount(ResetPassword, {
            global: {
              plugins: [router],
              mocks: {
                $route: { params: { uid: 'test-uid', token: 'test-token' } }
              }
            }
          });
    });

    it('Debe mostrar el mensaje de error si las contraseñas no coinciden', async () => {
        wrapper.vm.password = 'password1';
        wrapper.vm.confirmPassword = 'password2';

        await wrapper.find('form').trigger('submit.prevent');

        expect(wrapper.text()).toContain('Las contraseñas no coinciden');
    });
    it('Debe llamar a la API y redirigir cuando las contraseñas coinciden', async () => {
        axios.post.mockResolvedValueOnce({ data: { success: true } });
        wrapper.vm.password = 'newpassword';
        wrapper.vm.confirmPassword = 'newpassword';
      
        vi.useFakeTimers(); 
      
        await wrapper.find('form').trigger('submit.prevent');
        await wrapper.vm.$nextTick();
      
        vi.advanceTimersByTime(1000);
        await wrapper.vm.$nextTick();
      
        expect(mockRouterPush).toHaveBeenCalledWith('/login');
      
        vi.useRealTimers();
      });
      
    it('Debe mostrar un mensaje de error cuando la API falle', async () => {
        axios.post.mockRejectedValueOnce({ response: { data: { error: 'Error al restablecer la contraseña' } } });

        wrapper.vm.password = 'newpassword';
        wrapper.vm.confirmPassword = 'newpassword';

        await wrapper.find('form').trigger('submit.prevent');

        const errorMessage = wrapper.find('p.mt-3.text-danger');
        expect(errorMessage.exists()).toBe(true);
    });
});
