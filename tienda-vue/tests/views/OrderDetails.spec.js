import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OrderDetails from '@/views/OrderDetails.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import axios from 'axios';

vi.mock('axios');
describe('OrderDetails.vue', () => {
  let router, orderStoreMock, authStoreMock;
  beforeEach(() => {
    setActivePinia(createPinia());
    orderStoreMock = useOrderStore();
    orderStoreMock.payOrder = vi.fn().mockResolvedValueOnce();
    authStoreMock = useAuthStore();
    authStoreMock.token = 'fake-token';
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/', component: { template: '<div>Home</div>' } }],
    });
  });
  it('Muestra "Cargando Detalles..." si no hay pedido', async () => {
    axios.get.mockResolvedValueOnce({ data: null });
    const wrapper = mount(OrderDetails, {
      global: { plugins: [router] },
    });
    expect(wrapper.text()).toContain('Cargando Detalles...');
  });
  it('Renderiza los detalles del pedido cuando se cargan los datos', async () => {
    const mockOrder = {
      id: 1,
      status: 'Pending',
      price: 100,
      products: [
        { id: 1, name: 'Producto 1', price: 50, quantity: 1 },
        { id: 2, name: 'Producto 2', price: 50, quantity: 1 },
      ],
    };
    axios.get.mockResolvedValueOnce({ data: mockOrder });
    const wrapper = mount(OrderDetails, {
      global: { plugins: [router] },
    });
    await flushPromises();
    expect(wrapper.text()).toContain('Detalles Pedido');
    expect(wrapper.text()).toContain('Identificador:');
    expect(wrapper.text()).toContain('Estado:');
    expect(wrapper.text()).toContain('Total:');
    expect(wrapper.text()).toContain('Producto 1 - 50€');
    expect(wrapper.text()).toContain('Producto 2 - 50€');
  });
  it('Llama a payOrder y redirige tras el pago', async () => {
    window.alert = vi.fn();
    const mockOrder = {
      id: 1,
      status: 'Pending',
      price: 100,
      products: [],
    };
    axios.get.mockResolvedValueOnce({ data: mockOrder });
    const wrapper = mount(OrderDetails, {
      global: { plugins: [router] },
    });
    await flushPromises();
    const button = wrapper.find('button');
    expect(button.exists()).toBe(true);
    await button.trigger('click');
    expect(orderStoreMock.payOrder).toHaveBeenCalledWith(1);
    expect(window.alert).toHaveBeenCalledWith('Pago Correcto!');
  });
});
