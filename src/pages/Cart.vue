<template>
  <div class="container py-5">
    <h3 class="fw-bold mb-4">
      🛒 Giỏ hàng của bạn
    </h3>

    <div v-if="cart.length">
      <div class="table-responsive">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>#</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th style="width: 120px">Số lượng</th>
              <th>Tổng</th>
              <th>Chọn</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in cart" :key="item.id">
              <td>{{ index + 1 }}</td>

              <!-- Ảnh sản phẩm -->
              <td>
                <img
                  :src="item.image || item.images?.[0]"
                  class="rounded border"
                  width="60"
                  height="60"
                  style="object-fit: cover"
                  alt="Ảnh sản phẩm"
                />
              </td>

              <td>{{ item.name }}</td>
              <td>{{ formatPrice(item.price) }}</td>

              <!-- Số lượng -->
              <td>
                <input
                  type="number"
                  v-model.number="item.quantity"
                  min="1"
                  class="form-control text-center"
                  @change="updateCart"
                  style="width: 80px"
                />
              </td>

              <td>{{ formatPrice(item.price * item.quantity) }}</td>

              <td>
                <input type="checkbox" v-model="selectedItems" :value="item.id" />
              </td>

              <td>
                <button class="btn btn-sm btn-danger" @click="removeItem(item.id)">
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Tổng cộng -->
      <div class="d-flex justify-content-between align-items-center mt-3">
        <router-link to="/" class="btn btn-outline-secondary">
          <i class="pi pi-arrow-left me-1"></i> Tiếp tục mua sắm
        </router-link>

        <div class="text-end">
          <h5 class="fw-bold">
            Tổng cộng: <span class="text-danger">{{ formatPrice(totalSelected) }}</span>
          </h5>
          <button
            class="btn btn-primary mt-2"
            :disabled="selectedItems.length === 0"
            @click="checkoutSelected"
          >
            <i class="pi pi-credit-card me-1"></i> Thanh toán
          </button>
        </div>
      </div>
    </div>

    <div v-else class="alert alert-warning text-center mt-5">
      Giỏ hàng của bạn đang trống.
      <router-link to="/" class="alert-link">Mua ngay!</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cart = ref(JSON.parse(localStorage.getItem('cart') || '[]'))
const selectedItems = ref([])

// Nếu số lượng sản phẩm chưa có quantity -> set = 1
cart.value.forEach((item) => {
  if (!item.quantity || isNaN(item.quantity)) item.quantity = 1
})

// Cập nhật localStorage khi thay đổi
watch(
  cart,
  (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart))
  },
  { deep: true }
)

const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v) + '₫'

// Xóa sản phẩm
const removeItem = (id) => {
  cart.value = cart.value.filter((item) => item.id !== id)
  selectedItems.value = selectedItems.value.filter((i) => i !== id)
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

// Cập nhật localStorage khi thay đổi số lượng
const updateCart = () => {
  cart.value.forEach((item) => {
    if (item.quantity < 1) item.quantity = 1
  })
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

// Tính tổng chỉ cho sản phẩm được chọn
const totalSelected = computed(() => {
  return cart.value
    .filter((item) => selectedItems.value.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// Thanh toán
const checkoutSelected = () => {
  if (selectedItems.value.length === 0) {
    alert('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!')
    return
  }
  const selectedProducts = cart.value.filter((item) =>
    selectedItems.value.includes(item.id)
  )
  localStorage.setItem('checkoutItems', JSON.stringify(selectedProducts))
  router.push('/checkout')
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
