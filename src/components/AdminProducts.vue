<template>
  <div class="row">
    <!-- FORM -->
    <div class="col-lg-5">
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <h5 class="card-title text-primary">
            <i class="pi pi-pencil me-2"></i>
            {{ editing ? '✏️ Sửa sản phẩm' : '➕ Thêm sản phẩm' }}
          </h5>

          <form @submit.prevent="save">
            <div class="row g-2">
              <div class="col-12">
                <label class="form-label">Tên sản phẩm</label>
                <input v-model="form.name" class="form-control" required />
              </div>

              <div class="col-6">
                <label class="form-label">Giá</label>
                <input v-model.number="form.price" type="number" class="form-control" required />
              </div>

              <div class="col-6">
                <label class="form-label">Số lượng</label>
                <input v-model.number="form.quantity" type="number" class="form-control" required />
              </div>

              <div class="col-6">
                <label class="form-label">Giảm giá (%)</label>
                <input v-model.number="form.discount" type="number" min="0" max="100" class="form-control" />
              </div>

              <div class="col-6">
                <label class="form-label">Danh mục</label>
                <select v-model="form.categoryId" class="form-select" required>
                  <option disabled value="">-- Chọn --</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
              </div>

              <div class="col-12">
                <label class="form-label">Ảnh sản phẩm (chọn nhiều ảnh)</label>
                <input type="file" multiple accept="image/*" class="form-control" @change="handleFileUpload" />
              </div>

              <!-- Hiển thị ảnh preview -->
              <div v-if="previewImages.length" class="mt-2 d-flex flex-wrap gap-2">
                <div v-for="(img, idx) in previewImages" :key="idx" class="position-relative">
                  <img
                    :src="img"
                    class="rounded border"
                    style="width: 90px; height: 90px; object-fit: cover"
                  />
                  <button
                    type="button"
                    class="btn btn-sm btn-danger position-absolute top-0 end-0"
                    @click="removeImage(idx)"
                    style="transform: translate(25%, -25%);"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <div class="d-grid gap-2 mt-3">
              <button class="btn btn-success">
                <i class="pi pi-save me-1"></i>
                {{ editing ? 'Cập nhật' : 'Thêm mới' }}
              </button>
              <button v-if="editing" type="button" class="btn btn-secondary" @click="resetForm">
                <i class="pi pi-times me-1"></i> Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- DANH SÁCH -->
    <div class="col-lg-7">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title text-danger mb-3">
            <i class="pi pi-list me-2"></i>Danh sách sản phẩm
          </h5>

          <div class="table-responsive">
            <table class="table table-striped align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>SL</th>
                  <th>Giảm</th>
                  <th class="text-end">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in products" :key="p.id">
                  <td>{{ p.id }}</td>
                  <td>
                    <img
                      v-if="p.images?.[0]"
                      :src="p.images[0]"
                      class="rounded border"
                      style="width: 60px; height: 60px; object-fit: cover"
                    />
                  </td>
                  <td>{{ p.name }}</td>
                  <td>{{ getCategoryName(p.categoryId) }}</td>
                  <td>{{ formatPrice(p.price) }}</td>
                  <td>{{ p.quantity }}</td>
                  <td>{{ p.discount }}%</td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-primary" @click="edit(p)">
                        <i class="pi pi-pencil"></i>
                      </button>
                      <button class="btn btn-danger" @click="del(p.id)">
                        <i class="pi pi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- TOAST -->
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
    <div
      id="liveToast"
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
import { ref, reactive, onMounted, nextTick } from 'vue'
import * as bootstrap from 'bootstrap'
import api from '../api'

// ===== STATE =====
const products = ref([])
const categories = ref([])
const editing = ref(false)
const previewImages = ref([])
const toastMsg = ref('')
const toastType = ref('success')

// ===== FORM =====
const form = reactive({
  id: null,
  name: '',
  price: 0,
  quantity: 0,
  discount: 0,
  categoryId: '',
  description: '',
  images: []
})

// ===== TOAST =====
const showToast = async (msg, type = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  await nextTick()
  const el = document.getElementById('liveToast')
  if (el) bootstrap.Toast.getOrCreateInstance(el).show()
}

// ===== LOAD DATA =====
const load = async () => {
  try {
    const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')])
    products.value = pRes.data
    categories.value = cRes.data
  } catch {
    showToast('Không thể tải dữ liệu sản phẩm!', 'danger')
  }
}
onMounted(load)

// ===== LẤY TÊN DANH MỤC =====
const getCategoryName = (id) => {
  const cat = categories.value.find(c => String(c.id) === String(id))
  return cat ? cat.name : 'Không rõ'
}

// ===== RESET =====
const resetForm = () => {
  editing.value = false
  Object.assign(form, { id: null, name: '', price: 0, quantity: 0, discount: 0, categoryId: '', description: '', images: [] })
  previewImages.value = []
}

// ===== UPLOAD ẢNH =====
const handleFileUpload = (e) => {
  const files = e.target.files
  for (let file of files) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      previewImages.value.push(ev.target.result)
      form.images.push(ev.target.result)
    }
    reader.readAsDataURL(file)
  }
}

// 🗑️ Xóa ảnh trong preview
const removeImage = (index) => {
  previewImages.value.splice(index, 1)
  form.images.splice(index, 1)
}

// ===== ĐỊNH DẠNG GIÁ =====
const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v) + '₫'

// ===== SỬA =====
const edit = (p) => {
  Object.assign(form, JSON.parse(JSON.stringify(p)))
  previewImages.value = p.images || []
  editing.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// ===== XÓA =====
const del = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return
  try {
    await api.delete(`/products/${id}`)
    products.value = products.value.filter(p => p.id !== id)
    showToast('🗑️ Xóa sản phẩm thành công!')
  } catch {
    showToast('Không thể xóa sản phẩm!', 'danger')
  }
}

// ===== LƯU =====
const save = async () => {
  if (!form.name || !form.price || !form.categoryId)
    return showToast('⚠️ Nhập đủ Tên, Giá và Danh mục!', 'danger')

  const payload = JSON.parse(JSON.stringify(form))
  payload.categoryId = String(payload.categoryId)

  try {
    if (editing.value && payload.id) {
      const { data } = await api.put(`/products/${payload.id}`, payload)
      const idx = products.value.findIndex(p => p.id === payload.id)
      if (idx !== -1) products.value[idx] = data
      showToast('✅ Cập nhật sản phẩm thành công!')
    } else {
      const maxId = products.value.length ? Math.max(...products.value.map(p => Number(p.id) || 0)) : 0
      payload.id = (maxId + 1).toString()

      const { data } = await api.post('/products', payload)
      products.value.push(data)
      showToast('✅ Thêm sản phẩm mới thành công!')
    }
    resetForm()
  } catch {
    showToast('Không thể lưu sản phẩm!', 'danger')
  }
}
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
