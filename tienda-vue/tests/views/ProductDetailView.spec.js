import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useAuthStore } from '@/store/authStore';
import ProductDetailView from '@/views/ProductDetailView.vue';
import { createRouter, createWebHistory } from 'vue-router';

describe('ProductDetailView.vue', () => {
  let wrapper;
  let productStore;
  let orderStore;
  let authStore;
  let router;

  beforeEach(async () => {
    router = createRouter({
      history: createWebHistory(),
      routes: [{ path: '/product/:slug', component: ProductDetailView }],
    });

    router.push('/product/example-product');
    await router.isReady();

    wrapper = mount(ProductDetailView, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn }), router],
      },
    });

    productStore = useProductStore();
    orderStore = useOrderStore();
    authStore = useAuthStore();

    productStore.products = [
      {
        id: 1,
        slug: 'example-product',
        name: 'Producto de prueba',
        category: { name: 'Categoría 1' },
        description: 'Descripción del producto',
        price: 100,
        stock: 10,
        images: [{ image: '/image1.jpg' }, { image: '/image2.jpg' }],
      },
    ];

    await wrapper.vm.$nextTick();
  });

  it('Carga los detalles del producto correctamente', async () => {
    expect(wrapper.find('.card-title').text()).toBe('Producto de prueba');
    expect(wrapper.find('.text-muted').text()).toContain('Categoría: Categoría 1');
    expect(wrapper.find('.card-text').text()).toBe('Descripción del producto');
    expect(wrapper.find('.text-primary').text()).toBe('Precio: $100');
  });

  it('Muestra imágenes en el carrusel', async () => {
    const images = wrapper.findAll('.carousel-item img');
    expect(images.length).toBe(2);
    expect(images[0].attributes('src')).toBe('/image1.jpg');
    expect(images[1].attributes('src')).toBe('/image2.jpg');
  });

  it('Muestra el mensaje de alerta al agregar al carrito', async () => {
    authStore.token = 'mock-token';
    await wrapper.find('#quantity').setValue(2);
    await wrapper.find('button.btn-success').trigger('click');

    expect(orderStore.addToCart).toHaveBeenCalled();
    expect(wrapper.find('.alert-success').exists()).toBe(true);
  });

  it('No permite agregar al carrito si el usuario no está autenticado', async () => {
    authStore.token = null;
    await wrapper.find('button.btn-success').trigger('click');

    expect(orderStore.addToCart).not.toHaveBeenCalled();
  });

  it('Cambia la imagen a la predeterminada si hay un error al cargar', async () => {
    const img = wrapper.find('.carousel-item img');
    await img.trigger('error');

    expect(img.attributes('src')).toBe('/default-image.jpg');
  });
});
