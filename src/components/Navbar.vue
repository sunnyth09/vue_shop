<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-2">
    <div class="container px-4">
      <!-- Logo -->
      <router-link to="/" class="navbar-brand fw-bold text-light d-flex align-items-center">
        <i class="pi pi-shopping-bag fs-5 me-2 text-warning"></i> Sunny Store
      </router-link>

      <!-- Nút thu gọn khi trên mobile -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMain"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-center" id="navbarMain">
        <!-- Menu chính -->
        <ul class="navbar-nav mx-auto mb-2 mb-lg-0 d-flex align-items-center">
          <li class="nav-item mx-2">
            <router-link class="nav-link" to="/">Sản phẩm</router-link>
          </li>
          <li v-if="user?.role === 'admin'" class="nav-item mx-2">
            <router-link class="nav-link" to="/admin">Quản trị</router-link>
          </li>
          <li v-if="user" class="nav-item mx-2">
            <router-link class="nav-link" to="/user">Trang cá nhân</router-link>
          </li>
        </ul>

        <!-- Ô tìm kiếm -->
        <form class="d-flex me-lg-3 my-2 my-lg-0" @submit.prevent="search">
          <div class="input-group input-group-sm">
            <input
              v-model="query"
              type="text"
              class="form-control"
              placeholder="Tìm sản phẩm..."
            />
            <button class="btn btn-outline-light" type="submit">
              <i class="pi pi-search"></i>
            </button>
          </div>
        </form>

        <!-- 🔹 GIỎ HÀNG -->
        <div class="me-3 position-relative">
          <router-link to="/cart" class="btn btn-outline-warning btn-sm position-relative">
            <i class="pi pi-shopping-cart"></i>
            <!-- Badge hiển thị số lượng -->
            <span
              v-if="cartCount > 0"
              class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              style="font-size: 0.6rem;"
            >
              {{ cartCount }}
            </span>
          </router-link>
        </div>

        <!-- Tài khoản -->
        <div class="d-flex align-items-center gap-2">
          <template v-if="!user">
            <router-link to="/login" class="btn btn-outline-light btn-sm">
              <i class="pi pi-sign-in me-1"></i> Đăng nhập
            </router-link>
            <router-link to="/register" class="btn btn-outline-info btn-sm">
              <i class="pi pi-user-plus me-1"></i> Đăng ký
            </router-link>
          </template>

          <template v-else>
            <span class="text-white small">
              <i class="pi pi-user me-1"></i>{{ user.username }}
            </span>
            <button class="btn btn-danger btn-sm" @click="logout">
              <i class="pi pi-sign-out me-1"></i> Đăng xuất
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const query = ref('')
const user = ref(null)
const cartCount = ref(0)

// ✅ Load user từ localStorage
const loadUser = () => {
  const data = localStorage.getItem('user')
  user.value = data ? JSON.parse(data) : null
}

// ✅ Load giỏ hàng từ localStorage
const loadCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  cartCount.value = cart.reduce((sum, item) => sum + (item.qty || 1), 0)
}

// ✅ Khi tìm kiếm
const search = () => {
  if (query.value.trim()) {
    router.push(`/?q=${encodeURIComponent(query.value.trim())}`)
  }
}

// ✅ Đăng xuất
const logout = () => {
  localStorage.removeItem('user')
  user.value = null
  router.push('/')
  window.dispatchEvent(new Event('storage'))
}

// ✅ Gắn event listener
onMounted(() => {
  loadUser()
  loadCartCount()
  window.addEventListener('storage', () => {
    loadUser()
    loadCartCount()
  })
})
onBeforeUnmount(() => {
  window.removeEventListener('storage', loadCartCount)
})
</script>

<style scoped>
.navbar {
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  color: #ffc107 !important;
}

.nav-link {
  transition: color 0.3s;
  font-weight: 500;
}

.nav-link.router-link-exact-active {
  color: #ffc107 !important;
}

.form-control {
  border-radius: 0.25rem 0 0 0.25rem;
}

.form-control:focus {
  box-shadow: none;
  border-color: #ffc107;
}

/* Style cho nút giỏ hàng */
.btn-outline-warning:hover {
  background-color: #ffc107;
  color: #212529 !important;
}
</style>
