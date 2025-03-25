import { shallowMount } from '@vue/test-utils';
import OrderView from '@/views/OrderView.vue';
import { useOrderStore } from '@/store/orderStore';
import { vi } from 'vitest';

vi.mock('@/store/orderStore', () => ({
  useOrderStore: vi.fn()
}));
describe('OrderView.vue', () => {
  let orderStoreMock;
  beforeEach(() => {
    orderStoreMock = {
      orders: [],
      cart: [],
      loadOrders: vi.fn(),
      checkout: vi.fn(),
      payOrder: vi.fn(),
      getGroupedCart: vi.fn() 
    };
    useOrderStore.mockReturnValue(orderStoreMock);
  });
  it('Renderiza correctamente cuando hay pedidos', async () => {
    orderStoreMock.orders = [{ id: 1, status: 'Pending' }];
    orderStoreMock.getGroupedCart.mockReturnValue([]);
    const wrapper = shallowMount(OrderView);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Tus Pedidos');
    expect(wrapper.text()).toContain('Pedido #1');
    expect(wrapper.findAll('li.list-group-item')).toHaveLength(1);
  });
  it('Muestra mensaje cuando no hay pedidos', async () => {
    orderStoreMock.orders = [];
    orderStoreMock.getGroupedCart.mockReturnValue([]);
    const wrapper = shallowMount(OrderView);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Sin Compras Anteriores');
  });
  it('Muestra mensaje cuando el carrito está vacío', async () => {
    orderStoreMock.cart = [];
    orderStoreMock.getGroupedCart.mockReturnValue([]); 
    const wrapper = shallowMount(OrderView);
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('Sin productos en el carrito');
  });
  it('Confirma pedido cuando hay productos en el carrito', async () => {
    orderStoreMock.cart = [{ id: 1, name: 'Producto 1', price: 10 }];
    orderStoreMock.getGroupedCart.mockReturnValue(orderStoreMock.cart); 
    const wrapper = shallowMount(OrderView);
    await wrapper.find('button.btn-success').trigger('click');
    expect(orderStoreMock.checkout).toHaveBeenCalled();
  });
  it('Ejecuta el pago correctamente', async () => {
    orderStoreMock.orders = [{ id: 1, status: 'Pending' }];
    orderStoreMock.getGroupedCart.mockReturnValue([]);
    vi.spyOn(window, 'prompt').mockImplementation(() => 'test-data');
    const wrapper = shallowMount(OrderView);
    await wrapper.vm.$nextTick();
    await wrapper.vm.handlePayment(1);
    expect(orderStoreMock.payOrder).toHaveBeenCalledWith(1, {
      cardNumber: 'test-data',
      expDate: 'test-data',
      cvc: 'test-data'
    });
    window.prompt.mockRestore();
  });
});
