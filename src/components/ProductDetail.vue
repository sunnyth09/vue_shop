<template>
  <div v-if="loading" class="text-center py-5 text-muted">
    <div class="spinner-border text-primary"></div>
    <p>Đang tải sản phẩm...</p>
  </div>

  <div v-else-if="error" class="alert alert-danger text-center">
    {{ error }}
  </div>

  <div v-else-if="product" class="container py-4">
    <!-- Nút quay lại -->
    <div class="d-flex align-items-center gap-2 mb-3">
      <router-link to="/" class="btn btn-light btn-sm">
        <i class="pi pi-arrow-left"></i>
      </router-link>
      <h3 class="mb-0">{{ product.name }}</h3>
    </div>

    <div class="row g-4">
      <!-- Hình ảnh -->
      <div class="col-md-6">
        <img
          :src="currentImage"
          class="img-fluid rounded border"
          style="max-height: 400px; object-fit: cover"
        />
        <div class="d-flex gap-2 mt-3 flex-wrap">
          <img
            v-for="(img, idx) in product.images"
            :key="idx"
            :src="img"
            class="rounded border"
            style="width: 90px; height: 70px; object-fit: cover; cursor: pointer"
            @click="currentImage = img"
          />
        </div>
      </div>

      <!-- Thông tin -->
      <div class="col-md-6">
        <p class="text-muted">{{ product.description }}</p>
        <p class="fs-5 mb-2">
          Giá:
          <b class="text-danger">{{ formatPrice(product.price) }}</b>
          <span v-if="product.discount" class="badge bg-success ms-2">
            -{{ product.discount }}%
          </span>
        </p>
        <p class="mb-2">
          Số lượng còn: <b>{{ product.quantity }}</b>
        </p>
        <p>
          Danh mục: <b>{{ categoryName || 'Không rõ' }}</b>
        </p>

        <!-- Chọn màu -->
        <div class="mt-3">
          <label class="fw-semibold me-2">Màu sắc:</label>
          <select
            v-model="selectedColor"
            class="form-select form-select-sm w-auto d-inline-block"
          >
            <option disabled value="">-- Chọn màu --</option>
            <option v-for="color in colors" :key="color" :value="color">
              {{ color }}
            </option>
          </select>
        </div>

        <!-- Chọn size -->
        <div class="mt-3">
          <label class="fw-semibold me-2">Kích cỡ:</label>
          <select
            v-model="selectedSize"
            class="form-select form-select-sm w-auto d-inline-block"
          >
            <option disabled value="">-- Chọn size --</option>
            <option v-for="size in sizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>

        <!-- Số lượng -->
        <div class="mt-3 d-flex align-items-center">
          <label class="fw-semibold me-2">Số lượng:</label>
          <input
            type="number"
            v-model.number="selectedQty"
            min="1"
            :max="product.quantity"
            class="form-control form-control-sm w-auto"
          />
        </div>

        <!-- Nút hành động -->
        <div class="mt-4 d-flex gap-2">
          <button class="btn btn-outline-primary flex-fill" @click="addToCart">
            <i class="pi pi-shopping-cart me-1"></i> Thêm vào giỏ hàng
          </button>
          <button class="btn btn-primary flex-fill" @click="buyNow">
            <i class="pi pi-credit-card me-1"></i> Mua ngay
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- TOAST -->
  <div
    class="toast-container position-fixed top-0 end-0 p-3"
    style="z-index: 9999"
  >
    <div
      id="toast"
      class="toast align-items-center text-white border-0"
      :class="toastType === 'success' ? 'bg-success' : 'bg-danger'"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div class="d-flex">
        <div class="toast-body">{{ toastMsg }}</div>
        <button
          type="button"
          class="btn-close btn-close-white me-2 m-auto"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import * as bootstrap from 'bootstrap'
import api from '../api'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const currentImage = ref('')
const categoryName = ref('')
const loading = ref(true)
const error = ref('')
const toastMsg = ref('')
const toastType = ref('success')

// Options
const colors = ['Trắng', 'Đen', 'Be', 'Xanh']
const sizes = ['S', 'M', 'L', 'XL']
const selectedColor = ref('')
const selectedSize = ref('')
const selectedQty = ref(1)

// 🧭 Load sản phẩm
const load = async () => {
  loading.value = true
  error.value = ''
  try {
    const id = route.params.id
    const { data } = await api.get(`/products/${id}`)
    product.value = data
    currentImage.value = data.images?.[0] || ''
    if (data.categoryId) {
      const { data: cat } = await api.get(`/categories/${data.categoryId}`)
      categoryName.value = cat?.name || 'Không rõ'
    }
  } catch {
    error.value = 'Không tìm thấy sản phẩm này!'
  } finally {
    loading.value = false
  }
}

onMounted(load)
watch(() => route.params.id, load)

// 💬 Toast
const showToast = async (msg, type = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  await nextTick()
  const el = document.getElementById('toast')
  if (el) bootstrap.Toast.getOrCreateInstance(el).show()
}

// Định dạng giá
const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v) + '₫'

// 🛒 Thêm vào giỏ hàng
const addToCart = () => {
  if (!selectedColor.value || !selectedSize.value)
    return showToast('⚠️ Vui lòng chọn màu và size!', 'danger')

  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const existing = cart.find(
    (i) =>
      i.id === product.value.id &&
      i.color === selectedColor.value &&
      i.size === selectedSize.value
  )

  if (existing) {
    existing.quantity += selectedQty.value
  } else {
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.images?.[0] || '',
      color: selectedColor.value,
      size: selectedSize.value,
      quantity: selectedQty.value,
    })
  }

  localStorage.setItem('cart', JSON.stringify(cart))
  showToast('🛍️ Đã thêm vào giỏ hàng!')
}

// 💳 Mua ngay
const buyNow = () => {
  addToCart()
  router.push('/cart')
}
</script>

<style scoped>
.toast {
  min-width: 240px;
}
</style>
