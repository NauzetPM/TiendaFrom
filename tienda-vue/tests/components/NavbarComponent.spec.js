import { mount } from '@vue/test-utils'
import NavbarComponent from '@/components/NavbarComponent.vue'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/store/authStore'
import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('NavbarComponent.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('Renderiza correctamente los enlaces básicos', () => {
    const wrapper = mount(NavbarComponent)

    expect(wrapper.text()).toContain('Tienda')
    expect(wrapper.text()).toContain('Productos')
  })

  it('Muestra "Login" si el usuario NO está autenticado', () => {
    const wrapper = mount(NavbarComponent)
    expect(wrapper.text()).toContain('Login')
    expect(wrapper.find('.bi-box-arrow-in-right').exists()).toBe(true)
  })

  it('Muestra "Carrito" y "Logout" si el usuario está autenticado', async () => {
    const authStore = useAuthStore()
    authStore.token = 'mock-token'

    const wrapper = mount(NavbarComponent)

    expect(wrapper.text()).toContain('Carrito')
    expect(wrapper.text()).toContain('Logout')
  })

  it('Llama a logout al hacer clic en "Logout"', async () => {
    const authStore = useAuthStore()
    authStore.token = 'mock-token'
    authStore.logout = vi.fn()

    const wrapper = mount(NavbarComponent)
    await wrapper.find('button.nav-link').trigger('click')

    expect(authStore.logout).toHaveBeenCalled()
  })
})
