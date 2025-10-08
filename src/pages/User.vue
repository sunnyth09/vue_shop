<template>
  <div class="container mt-4">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h4 class="mb-3 text-center">
              <i class="pi pi-user-edit me-2"></i>Thông tin cá nhân
            </h4>

            <!-- Hiển thị lỗi -->
            <div v-if="errorMsg" class="alert alert-danger py-2">
              <i class="pi pi-exclamation-triangle me-2"></i>{{ errorMsg }}
            </div>

            <!-- Hiển thị thông báo thành công -->
            <div v-if="successMsg" class="alert alert-success py-2">
              <i class="pi pi-check-circle me-2"></i>{{ successMsg }}
            </div>

            <form @submit.prevent="save">
              <div class="mb-3">
                <label class="form-label">Họ tên</label>
                <input v-model="form.name" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input v-model="form.username" class="form-control" disabled />
              </div>
              <div class="mb-3">
                <label class="form-label">Địa chỉ</label>
                <input v-model="form.address" class="form-control" placeholder="Số nhà, đường, quận/huyện..." />
              </div>
              <div class="mb-3">
                <label class="form-label">Liên hệ</label>
                <input v-model="form.contact" class="form-control" placeholder="SĐT / Email" />
              </div>
              <button class="btn btn-primary w-100">
                <i class="pi pi-save me-1"></i> Lưu thông tin
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'

const form = reactive({})
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

onMounted(async () => {
  const currentUser = JSON.parse(localStorage.getItem('user'))
  if (!currentUser) {
    errorMsg.value = 'Vui lòng đăng nhập để xem thông tin!'
    return
  }
  try {
    const { data } = await api.get(`/users/${currentUser.id}`)
    Object.assign(form, data)
  } catch {
    errorMsg.value = 'Không thể tải thông tin người dùng!'
  }
})

const save = async () => {
  try {
    await api.put(`/users/${form.id}`, form)
    localStorage.setItem('user', JSON.stringify(form))
    successMsg.value = 'Cập nhật thông tin thành công!'
    errorMsg.value = ''

    // ⏳ Sau 1.5 giây tự quay về trang chủ
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch {
    errorMsg.value = 'Không thể lưu thông tin!'
  }
}
</script>
