import { mount } from '@vue/test-utils'
import CookieBanner from '@/components/CookieBanner.vue'
import { describe, it, expect, vi } from 'vitest'

describe('CookieBanner.vue', () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it('Muestra el banner si no se ha aceptado la cookie', () => {
    const wrapper = mount(CookieBanner)
    expect(wrapper.find('.cookie-banner').exists()).toBe(true)
  })
  it('Oculta el banner al hacer clic en "Aceptar" y guarda en localStorage', async () => {
    const wrapper = mount(CookieBanner)
    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.cookie-banner').exists()).toBe(false)
    expect(localStorage.getItem('cookiesAccepted')).toBe('true')
  })
  it('No muestra el banner si ya se aceptaron las cookies', async () => {
    localStorage.setItem('cookiesAccepted', 'true')
    const wrapper = mount(CookieBanner)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.cookie-banner').exists()).toBe(false)
  })
})
