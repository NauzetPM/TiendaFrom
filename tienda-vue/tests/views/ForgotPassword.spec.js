import { shallowMount } from '@vue/test-utils';
import ForgotPassword from '@/views/ForgotPassword.vue';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

const flushPromises = () => new Promise(resolve => setTimeout(resolve, 0));

describe('ForgotPassword.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(ForgotPassword);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renderiza correctamente la vista inicial', () => {
    expect(wrapper.find('h2').text()).toBe('Recuperar Contraseña');
    expect(wrapper.find('p').text()).toContain('Ingresa tu correo electrónico');
    expect(wrapper.find('p.mt-3').exists()).toBe(false);
  });

  it('envía enlace y muestra mensaje de éxito cuando la API es exitosa', async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    const input = wrapper.find('input[type="email"]');
    await input.setValue('test@example.com');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(axios.post).toHaveBeenCalled();
    expect(wrapper.vm.message).toBe('Se ha enviado un enlace a tu correo');
    expect(wrapper.vm.status).toBe('success');

    const messageEl = wrapper.find('p.mt-3.text-success.text-center');
    expect(messageEl.exists()).toBe(true);
    expect(messageEl.text()).toBe('Se ha enviado un enlace a tu correo');
  });

  it('muestra mensaje de error cuando la API falla', async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { error: 'Error al enviar correo' } }
    });

    const input = wrapper.find('input[type="email"]');
    await input.setValue('fail@example.com');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(axios.post).toHaveBeenCalled();
    expect(wrapper.vm.message).toBe('Error al enviar correo');
    expect(wrapper.vm.status).toBe('danger');

    const messageEl = wrapper.find('p.mt-3.text-danger.text-center');
    expect(messageEl.exists()).toBe(true);
    expect(messageEl.text()).toBe('Error al enviar correo');
  });
});
