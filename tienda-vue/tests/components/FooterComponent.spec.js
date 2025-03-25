import { mount } from '@vue/test-utils'
import Footer from '@/components/FooterComponent.vue'
import { describe, it, expect } from 'vitest'

describe('FooterComponent.vue', () => {
  it('Renderiza correctamente el footer', () => {
    const wrapper = mount(Footer)
    expect(wrapper.text()).toContain('Siguenos')
    expect(wrapper.text()).toContain('Contactanos')
    expect(wrapper.text()).toContain('Terminos')
    expect(wrapper.text()).toContain('contact@yourstore.com')
    expect(wrapper.text()).toContain('+1 234 567 890')
    expect(wrapper.text()).toContain('123 Main Street, City, Country')
  })
  it('Contiene enlaces a redes sociales con los href correctos', () => {
    const wrapper = mount(Footer)
    const links = wrapper.findAll('.social-links a')
    const expectedLinks = [
      'https://facebook.com',
      'https://twitter.com',
      'https://instagram.com',
      'https://linkedin.com'
    ]
    links.forEach((link, index) => {
      expect(link.attributes('href')).toBe(expectedLinks[index])
    })
  })
  it('Muestra el año actual dinámicamente', () => {
    const wrapper = mount(Footer)
    const currentYear = new Date().getFullYear()
    expect(wrapper.text()).toContain(`© ${currentYear} Your Store. All Rights Reserved.`)
  })
})
