import { setActivePinia, createPinia } from 'pinia';
import { useCategoryStore } from '@/store/categoryStore';
import { vi } from 'vitest';
import { fetchCategories } from '@/api/categories';

vi.mock('@/api/categories', () => ({
    fetchCategories: vi.fn()
}));

describe('Category Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });
    it('carga categorías correctamente', async () => {
        const mockCategories = [
            { id: 1, name: 'Electrónica' },
            { id: 2, name: 'Ropa' }
        ];
        fetchCategories.mockResolvedValue(mockCategories);
        const categoryStore = useCategoryStore();
        await categoryStore.loadCategories();
        expect(categoryStore.categories).toEqual(mockCategories);
    });
    it('maneja errores cuando falla la carga de categorías', async () => {
        fetchCategories.mockRejectedValue(new Error('Error de red'));
        console.error = vi.fn();
        const categoryStore = useCategoryStore();
        await categoryStore.loadCategories();
        expect(console.error).toHaveBeenCalledWith('Error loading categories:', expect.any(Error));
        expect(categoryStore.categories).toEqual([]);
    });
});
