import { defineStore } from 'pinia';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { urlPeticiones } from '@/global.js';
const ordersUri = urlPeticiones+"/api/orders/";
export const useOrderStore = defineStore('order', {
    state: () => ({
        cart: [],
        orders: []
    }),
    actions: {
        getGroupedCart() {
            const groupedCart = {};
            this.cart.forEach(item => {
                if (!groupedCart[item.slug]) {
                    groupedCart[item.slug] = { ...item, quantity: 0 };
                }
                groupedCart[item.slug].quantity += item.quantity;
            });
            return Object.values(groupedCart);
        },
        async loadOrders() {
            const authStore = useAuthStore();
            if (!authStore.token) {
                console.error('No token available.');
                return;
            }
            try {
                const response = await axios.get(ordersUri, {
                    headers: { 
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                this.orders = response.data;
            } catch (error) {
                console.error('Error loading orders:', error.response?.data || error.message);
            }
        },
        addToCart(product) {
            for (let i = 0; i < product.quantity; i++) {
                this.cart.push({ ...product, quantity: 1 });
            }
        },
        async checkout() {
            const authStore = useAuthStore();
            if (!authStore.token) {
                alert('You must be logged in to checkout');
                return;
            }
            try {
                const orderResponse = await axios.post(`${ordersUri}add/`, {}, {
                    headers: { 
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const orderId = orderResponse.data.id;
                for (const item of this.cart) {
                    await axios.post(`${ordersUri}${orderId}/products/add/`, {
                        "product-slug": item.slug
                    }, {
                        headers: { 
                            'Authorization': `Bearer ${authStore.token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                }
                await axios.post(`${ordersUri}${orderId}/status/`, {
                    status: 2
                }, {
                    headers: { 
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                this.cart = [];
                this.loadOrders();
            } catch (error) {
                console.error('Error during checkout:', error.response?.data || error.message);
            }
        },
        async payOrder(orderId, cardInfo) {
            const authStore = useAuthStore();
            if (!authStore.token) {
                alert('You must be logged in to pay');
                return;
            }
            try {
                await axios.post(`${ordersUri}${orderId}/pay/`, {
                    "card-number": cardInfo.cardNumber,
                    "exp-date": cardInfo.expDate,
                    "cvc": cardInfo.cvc
                }, {
                    headers: { 
                        'Authorization': `Bearer ${authStore.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                alert('Payment successful!');
                this.loadOrders();
            } catch (error) {
                console.error('Error paying order:', error.response?.data || error.message);
            }
        }
    }
});
