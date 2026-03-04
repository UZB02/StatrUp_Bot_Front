import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from '../layouts/AppLayout.vue'
import AuthLayout from '../layouts/AythLayout.vue'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      permission: 'dashboard'
    },
  },
  {
    path: '/admins',
    name: 'Adminlar',
    component: () => import('../views/Admins/AdminView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'],
      permission: 'admins'
    },
  },
  {
    path: '/admins/:id',
    name: 'Admin qo\'shish',
    component: () => import('../views/Admins/AddAdminView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'],
      permission: 'admins'
    },
  },
  {
    path: '/admins/edit/:id',
    name: 'Adminni Tahrirlash',
    component: () => import('../views/Admins/EditAdminView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'],
      permission: 'admins'
    },
  },
  {
    path: '/products',
    name: 'Mahsulotlar',
    component: () => import('../views/Products/ProductsView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      permission: 'products'
    },
  },
  {
    path: '/filials',
    name: 'Filiallar',
    component: () => import('../views/Filials/FilialsView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      permission: 'filials'
    },
  },
  {
    path: '/filials/:id',
    name: 'Filial',
    component: () => import('../views/Filials/FilialIdView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      permission: 'filials'
    },
  },
  {
    path: '/marketing',
    name: 'Marketing',
    component: () => import('../views/Marketing/MarketingView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      permission: 'marketing'
    },
  },
  {
    path: '/vacancies',
    name: 'Vakansiyalar',
    component: () => import('../views/Vacancies/VacanciesView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      permission: 'vacancies'
    },
  },
  {
    path: '/users',
    name: 'Mijozlar',
    component: () => import('../views/Users/UsersView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'],
      permission: 'users'
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Auth/LoginView.vue'),
    meta: {
      layout: AuthLayout,
      guest: true,
    },
  },

  // ❌ ruxsat yo‘q sahifa
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('../views/Forbidden.vue'),
    meta: { layout: AuthLayout },
  },

  // ❌ topilmadi
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { layout: AuthLayout },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/* =========================
   🔐 GLOBAL AUTH + ROLE GUARD
========================= */
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('adminToken')
  const adminRaw = sessionStorage.getItem('admin')

  // 🔓 Guest sahifa (login) - Agar token bo'lsa, ichkariga yo'naltirish
  if (to.meta.guest) {
    if (token) {
      return next('/')
    }
    return next()
  }

  // 🔐 Auth talab qilinadi
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }

  // 🎭 Role tekshiruvi
  if (to.meta.roles && token) {
    if (!adminRaw) {
      return next({ name: 'Login' })
    }

    try {
      const admin = JSON.parse(adminRaw)

      // Superadmin hammasiga kira oladi
      if (admin.role === 'superadmin') {
        return next()
      }

      // Role tekshiruvi
      if (!to.meta.roles.includes(admin.role)) {
        return next({ name: 'Forbidden' })
      }

      // Permission tekshiruvi (faqat adminlar uchun)
      if (to.meta.permission && (!admin.permissions || !admin.permissions.includes(to.meta.permission))) {
        return next({ name: 'Forbidden' })
      }

    } catch (e) {
      sessionStorage.clear()
      return next({ name: 'Login' })
    }
  }

  next()
})

export default router
