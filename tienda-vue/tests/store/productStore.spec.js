import { setActivePinia, createPinia } from 'pinia';
import { useProductStore } from '@/store/productStore';
import { fetchProducts } from '@/api/products';
import { vi } from 'vitest';

vi.mock('@/api/products', () => ({
    fetchProducts: vi.fn()
}));

describe('Product Store', () => {
    let productStore;

    beforeEach(() => {
        setActivePinia(createPinia());
        productStore = useProductStore();
    });

    it('carga productos correctamente', async () => {
        const mockProducts = [
            { id: 1, name: 'Producto 1', price: 100 },
            { id: 2, name: 'Producto 2', price: 200 }
        ];
        fetchProducts.mockResolvedValue(mockProducts);

        await productStore.loadProducts();

        expect(productStore.products).toEqual(mockProducts);
        expect(fetchProducts).toHaveBeenCalledWith({});
    });

    it('carga productos con filtros', async () => {
        const mockProducts = [{ id: 3, name: 'Producto Filtrado', price: 300 }];
        const filters = { category: 'Electrónica' };
        fetchProducts.mockResolvedValue(mockProducts);

        await productStore.loadProducts(filters);

        expect(productStore.products).toEqual(mockProducts);
        expect(fetchProducts).toHaveBeenCalledWith(filters);
    });

    it('maneja errores si loadProducts falla', async () => {
        fetchProducts.mockRejectedValue(new Error('Error en API'));
        console.error = vi.fn();

        await productStore.loadProducts();

        expect(console.error).toHaveBeenCalledWith('Error loading products:', expect.any(Error));
        expect(productStore.products).toEqual([]);
    });
});
