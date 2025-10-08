<template>
  <div class="container py-5">
    <h3 class="fw-bold mb-4">
      <i class="pi pi-credit-card me-2"></i> Thanh toán
    </h3>

    <!-- Nếu có sản phẩm -->
    <div v-if="checkoutItems.length" class="row g-4">
      <!-- Thông tin giao hàng -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-3 fw-semibold">Thông tin giao hàng</h5>
            <form @submit.prevent="confirmOrder">
              <div class="mb-3">
                <label class="form-label">Họ và tên</label>
                <input v-model="info.name" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Số điện thoại</label>
                <input v-model="info.phone" type="text" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Địa chỉ giao hàng</label>
                <textarea
                  v-model="info.address"
                  class="form-control"
                  rows="2"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Phương thức thanh toán</label>
                <select v-model="info.payment" class="form-select">
                  <option value="COD">Thanh toán khi nhận hàng (COD)</option>
                  <option value="Bank">Chuyển khoản ngân hàng</option>
                </select>
              </div>

              <button class="btn btn-success w-100 mt-2" type="submit">
                <i class="pi pi-check-circle me-1"></i> Xác nhận đơn hàng
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Tóm tắt đơn hàng -->
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="mb-3 fw-semibold">Tóm tắt đơn hàng</h5>

            <ul class="list-group list-group-flush mb-3">
              <li
                v-for="item in checkoutItems"
                :key="item.id + item.color + item.size"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div class="d-flex align-items-center gap-2">
                  <img
                    :src="item.image || item.images?.[0]"
                    alt="Ảnh sản phẩm"
                    class="rounded border"
                    style="width: 60px; height: 60px; object-fit: cover"
                  />
                  <div>
                    <div class="fw-semibold">{{ item.name }}</div>
                    <small class="text-muted">
                      Màu: {{ item.color }} | Size: {{ item.size }}
                    </small>
                    <div>x{{ item.quantity }}</div>
                  </div>
                </div>
                <div class="text-end fw-bold">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </li>
            </ul>

            <h5 class="text-end mt-3">
              Tổng tiền:
              <span class="text-danger fw-bold">{{ formatPrice(totalPrice) }}</span>
            </h5>

            <router-link to="/cart" class="btn btn-outline-secondary w-100 mt-3">
              <i class="pi pi-arrow-left me-1"></i> Quay lại giỏ hàng
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Nếu không có sản phẩm -->
    <div v-else class="text-center text-muted mt-5">
      <i class="pi pi-shopping-cart fs-1 d-block mb-2"></i>
      <p>Không có sản phẩm nào để thanh toán.</p>
      <router-link to="/" class="btn btn-outline-primary">
        <i class="pi pi-arrow-left me-1"></i> Quay lại mua hàng
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// ✅ Lấy sản phẩm được chọn từ localStorage
const checkoutItems = ref(JSON.parse(localStorage.getItem('checkoutItems') || '[]'))

const info = ref({
  name: '',
  phone: '',
  address: '',
  payment: 'COD',
})

const totalPrice = computed(() =>
  checkoutItems.value.reduce((sum, p) => sum + p.price * p.quantity, 0)
)

const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v) + '₫'

// ✅ Xác nhận đặt hàng
const confirmOrder = () => {
  if (!info.value.name || !info.value.phone || !info.value.address) {
    alert('Vui lòng nhập đầy đủ thông tin giao hàng!')
    return
  }

  alert(`✅ Cảm ơn ${info.value.name}! Đơn hàng của bạn đã được xác nhận.`)

  // Xóa các mục đã chọn khỏi giỏ
  const cart = JSON.parse(localStorage.getItem('cart') || '[]')
  const remaining = cart.filter(
    (item) =>
      !checkoutItems.value.some(
        (sel) =>
          sel.id === item.id && sel.color === item.color && sel.size === item.size
      )
  )
  localStorage.setItem('cart', JSON.stringify(remaining))

  // Xóa danh sách checkout
  localStorage.removeItem('checkoutItems')

  router.push('/')
}
</script>

<style scoped>
.list-group-item {
  vertical-align: middle;
}
</style>
