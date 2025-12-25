import { computed } from 'vue'
import { useRouter } from 'vue-router'

export function useAuth() {
  const router = useRouter()

  const token = computed(() => sessionStorage.getItem('adminToken'))

  const admin = computed(() => {
    const raw = sessionStorage.getItem('admin')
    return raw ? JSON.parse(raw) : null
  })

  const isAuthenticated = computed(() => !!token.value)

  const role = computed(() => admin.value?.role || null)

  const hasRole = (roles = []) => {
    if (!admin.value) return false
    return roles.includes(admin.value.role)
  }

  const logout = () => {
    sessionStorage.removeItem('adminToken')
    sessionStorage.removeItem('admin')
    router.push('/login')
  }

  return {
    token,
    admin,
    role,
    isAuthenticated,
    hasRole,
    logout,
  }
}
