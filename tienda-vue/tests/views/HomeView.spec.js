import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { describe, it, expect } from 'vitest';


const routes = [{ path: '/products', component: { template: '<div>Products</div>' } }];

describe('HomeView.vue', () => {
  it('Renderiza correctamente el título y el texto', () => {
    const wrapper = mount(HomeView);
    expect(wrapper.find('h1').text()).toBe('Bienvenido a nuestra Tienda');
    expect(wrapper.find('p').text()).toBe('Encuentra los mejores productos a los mejores precios.');
  });

  it('Contiene un botón que redirige a /products', async () => {
    const router = createRouter({
      history: createWebHistory(),
      routes,
    });

    router.push('/');
    await router.isReady();

    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    const button = wrapper.find('a');
    expect(button.exists()).toBe(true);
    expect(button.attributes('href')).toBe('/products');
  });
});
