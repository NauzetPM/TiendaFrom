import { mount } from '@vue/test-utils'
import CookieBanner from '@/components/CookieBanner.vue'
import { describe, it, expect, vi } from 'vitest'

describe('CookieBanner.vue', () => {
  beforeEach(() => {
    localStorage.clear(); // Limpia localStorage antes de cada test
  });

  it('Muestra el banner si no se ha aceptado la cookie', () => {
    const wrapper = mount(CookieBanner)
    expect(wrapper.find('.cookie-banner').exists()).toBe(true)
  })

  it('Oculta el banner al hacer clic en "Aceptar" y guarda en localStorage', async () => {
    const wrapper = mount(CookieBanner)
    
    // Simula clic en el botón "Aceptar"
    await wrapper.find('button').trigger('click')

    // El banner debería ocultarse
    expect(wrapper.find('.cookie-banner').exists()).toBe(false)

    // Verifica que localStorage guarda la preferencia
    expect(localStorage.getItem('cookiesAccepted')).toBe('true')
  })

  it('No muestra el banner si ya se aceptaron las cookies', async () => {
    localStorage.setItem('cookiesAccepted', 'true')
  
    const wrapper = mount(CookieBanner)
  
    // Espera a que Vue actualice la reactividad
    await wrapper.vm.$nextTick()
  
    // No debe existir el banner
    expect(wrapper.find('.cookie-banner').exists()).toBe(false)
  })
  
  
  
})
