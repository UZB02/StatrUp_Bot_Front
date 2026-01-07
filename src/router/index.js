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
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/admins',
    name: 'AdminsView',
    component: () => import('../views/Admins/AdminView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/admins/:id',
    name: 'AddAdminsView',
    component: () => import('../views/Admins/AddAdminView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/admins/edit/:id',
    name: 'EditAdminsView',
    component: () => import('../views/Admins/EditAdminView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/products',
    name: 'ProductsView',
    component: () => import('../views/Products/ProductsView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/filials',
    name: 'FilialsView',
    component: () => import('../views/Filials/FilialsView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/filials/:id',
    name: 'FilialsIdView',
    component: () => import('../views/Filials/FilialIdView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/vacancies',
    name: 'VacanciesView',
    component: () => import('../views/Vacancies/VacanciesView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['superadmin'], // 🔐 ikkalasi ham kira oladi
    },
  },
  {
    path: '/users',
    name: 'UsersView',
    component: () => import('../views/Users/UsersView.vue'),
    meta: {
      layout: AppLayout,
      requiresAuth: true,
      roles: ['admin', 'superadmin'], // 🔐 ikkalasi ham kira oladi
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
  // {
  //   path: '/403',
  //   name: 'Forbidden',
  //   component: () => import('../views/Forbidden.vue'),
  //   meta: { layout: AuthLayout },
  // },

  // ❌ topilmadi
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../views/NotFound.vue'),
  //   meta: { layout: AuthLayout },
  // },
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

  // 🔓 Guest sahifa (login)
  if (to.meta.guest && token) {
    return next({ name: 'home' })
  }

  // 🔐 Auth talab qilinadi
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'Login' })
  }

  // 🎭 Role tekshiruvi
  if (to.meta.roles) {
    if (!adminRaw) {
      return next({ name: 'Login' })
    }

    const admin = JSON.parse(adminRaw)

    if (!to.meta.roles.includes(admin.role)) {
      return next({ name: 'Forbidden' })
    }
  }

  next()
})

export default router
