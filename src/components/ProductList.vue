<template>
  <div class="container py-5">
    <h3 class="fw-bold mb-4 text-center">🛍️ Sản phẩm</h3>

    <!-- Bộ lọc danh mục -->
    <div class="row mb-4 justify-content-center">
      <div class="col-md-3 col-sm-6">
        <select v-model="selectedCategory" class="form-select">
          <option value="">Tất cả danh mục</option>
          <option v-for="c in categories" :key="c.id" :value="c.name">
            {{ c.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Danh sách sản phẩm -->
    <div v-if="filteredProducts.length" class="row g-4">
      <div
        v-for="p in filteredProducts"
        :key="p.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3"
      >
        <div class="card h-100 shadow-sm border-0 product-card">
          <div class="overflow-hidden position-relative rounded-top">
            <img
              :src="p.images?.[0]"
              class="card-img-top product-img"
              alt="thumb"
            />
            <span
              v-if="p.discount > 0"
              class="badge bg-danger position-absolute top-0 end-0 m-2"
            >
              -{{ p.discount }}%
            </span>
          </div>

          <div class="card-body d-flex flex-column">
            <h6 class="card-title text-truncate fw-semibold mb-2">
              {{ p.name }}
            </h6>
            <p class="card-text mb-3 small text-muted">
              Giá:
              <span class="fw-bold text-danger">{{ formatPrice(p.price) }}</span>
              <br />
              SL: {{ p.quantity }}
              <br />
              Danh mục:
              <span class="fw-semibold text-dark">{{ categoryName(p.categoryId) }}</span>
            </p>

            <router-link
              :to="'/product/' + p.id"
              class="btn btn-outline-primary mt-auto w-100"
            >
              <i class="pi pi-eye me-1"></i> Xem chi tiết
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted mt-5">
      Không tìm thấy sản phẩm nào phù hợp.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import api from '../api'
import { useRoute } from 'vue-router'

// ===== STATE =====
const products = ref([])
const categories = ref([])
const selectedCategory = ref('')
const route = useRoute()
const searchQuery = ref(route.query.q || '')

// ===== LẮNG NGHE THAY ĐỔI QUERY =====
watch(
  () => route.query.q,
  (newVal) => {
    searchQuery.value = newVal || ''
  }
)

// ===== FETCH DATA =====
onMounted(async () => {
  const [pRes, cRes] = await Promise.all([
    api.get('/products'),
    api.get('/categories')
  ])
  products.value = pRes.data
  categories.value = cRes.data
})

// ===== HÀM CHUẨN HÓA (bỏ dấu, viết thường) =====
const normalizeText = (str) =>
  str
    ? str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // loại bỏ dấu tiếng Việt
        .trim()
    : ''

// ===== LẤY TÊN DANH MỤC =====
const categoryName = (id) => {
  const cat = categories.value.find((c) => String(c.id) === String(id))
  return cat ? cat.name : 'Không rõ'
}

// ===== LỌC SẢN PHẨM =====
const filteredProducts = computed(() => {
  const query = normalizeText(searchQuery.value)
  return products.value.filter((p) => {
    const name = normalizeText(p.name)
    const category = normalizeText(categoryName(p.categoryId))
    const selected = normalizeText(selectedCategory.value)

    const matchSearch = !query || name.includes(query) || category.includes(query)
    const matchCategory = !selected || category.includes(selected)

    return matchSearch && matchCategory
  })
})

// ===== ĐỊNH DẠNG GIÁ =====
const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v) + '₫'
</script>

<style scoped>
.product-card {
  transition: all 0.3s ease;
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}
.product-img {
  height: 240px;
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.product-card:hover .product-img {
  transform: scale(1.05);
}
</style>
