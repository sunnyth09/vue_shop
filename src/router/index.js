import { createRouter, createWebHistory } from 'vue-router'

// 🌟 Lazy load cho hiệu suất tốt hơn
const Home = () => import('../pages/Home.vue')
const AdminLayout = () => import('../pages/Admin.vue')
const UserPage = () => import('../pages/User.vue')
const ProductDetail = () => import('../components/ProductDetail.vue')
const LoginForm = () => import('../components/LoginForm.vue')
const RegisterForm = () => import('../components/RegisterForm.vue')
const AdminProducts = () => import('../components/AdminProducts.vue')
const AdminCategory = () => import('../components/AdminCategory.vue')
const AdminUsers = () => import('../components/AdminUsers.vue')
const CartPage = () => import('../pages/Cart.vue')           // 🛒 Trang giỏ hàng
const CheckoutPage = () => import('../pages/Checkout.vue')   // 💳 Trang thanh toán
const NotFound = () => import('../pages/NotFound.vue')       // ⚠️ Trang 404

// ========================
// 🗺️ KHAI BÁO ROUTES
// ========================
const routes = [
  // 🏠 Trang chính
  { path: '/', name: 'home', component: Home },

  // 🔑 Xác thực
  { path: '/login', name: 'login', component: LoginForm },
  { path: '/register', name: 'register', component: RegisterForm },

  // 🛍️ Chi tiết sản phẩm
  {
    path: '/product/:id',
    name: 'product-detail',
    component: ProductDetail,
    props: true,
  },

  // 🛒 Giỏ hàng & Thanh toán
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/checkout', name: 'checkout', component: CheckoutPage },

  // 👑 Khu vực ADMIN
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', redirect: '/admin/products' },
      { path: 'products', name: 'admin-products', component: AdminProducts },
      { path: 'category', name: 'admin-category', component: AdminCategory },
      { path: 'users', name: 'admin-users', component: AdminUsers },
    ],
  },

  // 👤 Khu vực USER
  {
    path: '/user',
    name: 'user',
    component: UserPage,
    meta: { requiresAuth: true },
  },

  // ⚠️ Trang không tồn tại
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

// ========================
// ⚙️ TẠO ROUTER
// ========================
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Khi chuyển trang thì tự động cuộn lên đầu
    return { top: 0, behavior: 'smooth' }
  },
})

// ========================
// 🔐 KIỂM TRA QUYỀN TRUY CẬP
// ========================
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (to.meta.requiresAuth && !user) {
    // Nếu chưa đăng nhập → chuyển đến Login
    return next('/login')
  }

  if (to.meta.role && user?.role !== to.meta.role) {
    // Nếu role không phù hợp → về trang chủ
    return next('/')
  }

  next()
})

export default router
