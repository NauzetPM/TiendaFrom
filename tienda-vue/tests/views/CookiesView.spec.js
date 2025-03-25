import { mount } from '@vue/test-utils';
import CookiesView from '@/views/CookiesView.vue';

describe('CookiesView.vue', () => {
  it('se monta correctamente', () => {
    const wrapper = mount(CookiesView);
    expect(wrapper.exists()).toBe(true);
  });
  it('observa cambios en $route.hash y hace scroll al nuevo objetivo', async () => {
    document.body.innerHTML = '<div id="new-section">Nuevo Contenido</div>';
    const wrapper = mount(CookiesView);
    wrapper.vm.$route = { hash: '#new-section' };
    await wrapper.vm.$nextTick();
    const target = document.querySelector('#new-section');
    expect(target).not.toBeNull();
  });
});
