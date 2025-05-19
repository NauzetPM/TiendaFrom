import { mount, RouterLinkStub } from '@vue/test-utils';
import HomeView from '@/views/HomeView.vue';
import { describe, it, expect } from 'vitest';

describe('HomeView.vue – depuración', () => {
  it('Imprime el HTML para ver qué se monta', () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          'router-link': RouterLinkStub
        }
      }
    });
    expect(wrapper.html()).toContain('Bienvenido a nuestra Tienda');
    expect(wrapper.html()).toContain('Encuentra los mejores productos a los mejores precios.');
  });
});
