import { defineStore } from 'pinia';
import { fetchCategories } from '@/api/categories';

export const useCategoryStore = defineStore('category', {
    state: () => ({ categories: [] }),
    actions: {
        async loadCategories() {
            try {
                this.categories = await fetchCategories();
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        }
    }
});