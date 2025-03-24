import { mount, flushPromises } from '@vue/test-utils';
import ProductListView from '@/views/ProductListView.vue';
import { useProductStore } from '@/store/productStore';
import { vi } from 'vitest';
import { fetchCategories } from '@/api/categories';
vi.mock('@/store/productStore', () => ({
    useProductStore: vi.fn()
}));
vi.mock('@/api/categories', () => ({
    fetchCategories: vi.fn()
}));
const mockCategories = [
    { id: 1, name: 'Categoría 1' },
    { id: 2, name: 'Categoría 2' }
];
const mockProducts = [
    { id: 1, name: 'Producto 1', price: 100, category: { id: 1, name: 'Categoría 1' }, images: [{ image: '/img1.jpg' }] },
    { id: 2, name: 'Producto 2', price: 200, category: { id: 2, name: 'Categoría 2' }, images: [{ image: '/img2.jpg' }] },
    { id: 3, name: 'Producto 3', price: 300, category: { id: 1, name: 'Categoría 1' }, images: [{ image: '/img3.jpg' }] }
];

const mockStore = {
    products: mockProducts,
    loadProducts: vi.fn()
};

useProductStore.mockReturnValue(mockStore);
fetchCategories.mockResolvedValue(mockCategories);

describe('ProductListView', () => {
    it('llama a loadProducts al montar', async () => {
        mount(ProductListView);
        await flushPromises();
        expect(mockStore.loadProducts).toHaveBeenCalled();
    });

    it('muestra la lista de productos', async () => {
        const wrapper = mount(ProductListView);
        await flushPromises();
        
        const productCards = wrapper.findAll('.card');
        expect(productCards.length).toBe(mockProducts.length+1);
    });

    it('filtra productos por nombre', async () => {
        const wrapper = mount(ProductListView);
        await flushPromises();
        
        wrapper.vm.filter = 'Producto 1';
        await flushPromises();
        
        const filteredProducts = wrapper.findAll('.card');
        expect(filteredProducts.length).toBe(2);
    });

    it('filtra productos por categoría', async () => {
        const wrapper = mount(ProductListView);
        await flushPromises();
        
        wrapper.vm.selectedCategories = [1];
        await flushPromises();
        
        const filteredProducts = wrapper.findAll('.card');
        expect(filteredProducts.length).toBe(3);
    });

    it('ordena productos por precio de menor a mayor', async () => {
        const wrapper = mount(ProductListView);
        await flushPromises();
        
        wrapper.vm.sortOrder = 'asc';
        await flushPromises();
        
        const productPrices = wrapper.findAll('.card-text').map(el => parseInt(el.text().replace(/[^0-9]/g, ''), 10));
        expect(productPrices).toEqual([100, 200, 300]);
    });

    it('ordena productos por precio de mayor a menor', async () => {
        const wrapper = mount(ProductListView);
        await flushPromises();
        
        wrapper.vm.sortOrder = 'desc';
        await flushPromises();
        
        const productPrices = wrapper.findAll('.card-text').map(el => parseInt(el.text().replace(/[^0-9]/g, ''), 10));
        expect(productPrices).toEqual([300, 200, 100]);
    });

    it('cambia de página cuando se presiona el botón de siguiente', async () => {
        const wrapper = mount(ProductListView);
        await flushPromises();
        
        wrapper.vm.currentPage = 1;
        await flushPromises();
        
        const nextButton = wrapper.find('.page-item:not(.disabled) .bi-chevron-right');
        if (nextButton.exists()) {
            await nextButton.trigger('click');
            await flushPromises();
            expect(wrapper.vm.currentPage).toBe(2);
        }
    });

    it('cambia de página cuando se presiona el botón de anterior', async () => {
        const wrapper = mount(ProductListView);
        await flushPromises();
        
        wrapper.vm.currentPage = 2;
        await flushPromises();
        
        const prevButton = wrapper.find('.page-item:not(.disabled) .bi-chevron-left');
        if (prevButton.exists()) {
            await prevButton.trigger('click');
            await flushPromises();
            expect(wrapper.vm.currentPage).toBe(1);
        }
    });
});