import { setActivePinia, createPinia } from 'pinia';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { vi } from 'vitest';

vi.mock('axios');

vi.mock('@/store/authStore', () => ({
    useAuthStore: vi.fn()
}));

describe('Order Store', () => {
    let orderStore, authStore;

    beforeEach(() => {
        setActivePinia(createPinia()); 
        authStore = { token: 'mock-token' };
        useAuthStore.mockReturnValue(authStore);
        orderStore = useOrderStore();
    });

    it('carga órdenes correctamente', async () => {
        const mockOrders = [{ id: 1, status: 'Pending' }];
        axios.get.mockResolvedValue({ data: mockOrders });

        await orderStore.loadOrders();

        expect(orderStore.orders).toEqual(mockOrders);
        expect(axios.get).toHaveBeenCalledWith('http://127.0.0.1:8000/api/orders/', expect.any(Object));
    });

    it('maneja error si loadOrders falla', async () => {
        axios.get.mockRejectedValue(new Error('Error de red'));
        console.error = vi.fn();

        await orderStore.loadOrders();

        expect(console.error).toHaveBeenCalledWith('Error loading orders:', 'Error de red');
        expect(orderStore.orders).toEqual([]);
    });

    it('agrega productos al carrito', () => {
        const product = { id: 1, name: 'Producto', quantity: 2 };

        orderStore.addToCart(product);

        expect(orderStore.cart).toHaveLength(2);
        expect(orderStore.cart[0]).toEqual({ ...product, quantity: 1 });
    });

    it('realiza checkout correctamente', async () => {
        axios.post
            .mockResolvedValueOnce({ data: { id: 123 } })
            .mockResolvedValueOnce()
            .mockResolvedValueOnce(); 

        orderStore.cart = [{ slug: 'producto-1', quantity: 1 }];
        vi.spyOn(orderStore, 'loadOrders').mockImplementation(() => {}); 

        await orderStore.checkout();

        expect(orderStore.cart).toEqual([]);
        expect(orderStore.loadOrders).toHaveBeenCalled(); 
    });

    it('muestra error si checkout falla', async () => {
        axios.post.mockRejectedValue(new Error('Error en checkout'));
        console.error = vi.fn();

        await orderStore.checkout();

        expect(console.error).toHaveBeenCalledWith('Error during checkout:', 'Error en checkout');
    });

    it('realiza pago correctamente', async () => {
        axios.post.mockResolvedValue();
        vi.spyOn(orderStore, 'loadOrders').mockImplementation(() => {});

        await orderStore.payOrder(123, { cardNumber: '4111', expDate: '12/25', cvc: '123' });

        expect(orderStore.loadOrders).toHaveBeenCalled();
    });

    it('muestra error si payOrder falla', async () => {
        axios.post.mockRejectedValue(new Error('Error en pago'));
        console.error = vi.fn();

        await orderStore.payOrder(123, {});

        expect(console.error).toHaveBeenCalledWith('Error paying order:', 'Error en pago');
    });
});
