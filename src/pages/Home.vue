<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">
      🛍️ Sản phẩm
    </h2>

    <!-- Bộ lọc danh mục -->
    <div class="mb-3 text-center">
      <select v-model="selectedCategory" class="form-select w-auto d-inline-block">
        <option value="">Tất cả danh mục</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <!-- Danh sách sản phẩm -->
    <div v-if="filteredProducts.length" class="row g-4">
      <div v-for="p in filteredProducts" :key="p.id" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm border-0">
          <div class="position-relative">
            <img
              :src="p.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image'"
              class="card-img-top rounded-top"
              style="height: 250px; object-fit: cover"
            />
            <span
              v-if="p.discount"
              class="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 rounded-start"
              style="font-size: 0.85rem"
            >
              -{{ p.discount }}%
            </span>
          </div>

          <div class="card-body d-flex flex-column">
            <h6 class="card-title text-dark">{{ p.name }}</h6>
            <p class="mb-1 text-danger fw-bold">
              {{ formatPrice(p.price) }}
            </p>
            <p class="mb-1 text-muted small">SL: {{ p.quantity }}</p>
            <p class="small mb-2">
              Danh mục:
              <b>{{ getCategoryName(p.categoryId) }}</b>
            </p>

            <router-link
              :to="`/product/${p.id}`"
              class="btn btn-outline-primary mt-auto"
            >
              <i class="pi pi-eye me-1"></i>Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Nếu không có sản phẩm -->
    <div v-else class="alert alert-warning text-center mt-4">
      Không tìm thấy sản phẩm nào phù hợp.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api'

// ==== STATE ====
const products = ref([])
const categories = ref([])
const selectedCategory = ref('')

// ==== LOAD DỮ LIỆU ====
const load = async () => {
  try {
    const [pRes, cRes] = await Promise.all([
      api.get('/products'),
      api.get('/categories')
    ])
    products.value = pRes.data
    categories.value = cRes.data
  } catch (err) {
    console.error('❌ Lỗi tải dữ liệu:', err)
  }
}
onMounted(load)

// ==== LỌC THEO DANH MỤC ====
const filteredProducts = computed(() => {
  if (!selectedCategory.value) return products.value
  return products.value.filter(p => String(p.categoryId) === String(selectedCategory.value))
})

// ==== ĐỊNH DẠNG GIÁ ====
const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v) + '₫'

// ==== LẤY TÊN DANH MỤC ====
const getCategoryName = (id) => {
  const cat = categories.value.find(c => String(c.id) === String(id))
  return cat ? cat.name : 'Không rõ'
}
</script>

<style scoped>
select.form-select {
  min-width: 200px;
}
.card-title {
  font-weight: 600;
  font-size: 1rem;
}
</style>
