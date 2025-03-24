import { defineStore } from 'pinia';
import { fetchProducts } from '@/api/products';

export const useProductStore = defineStore('product', {
    state: () => ({ products: [] }),
    actions: {
        async loadProducts(filters = {}) {
            try {
                this.products = await fetchProducts(filters);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        }
    }
});