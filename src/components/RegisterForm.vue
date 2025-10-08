<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="text-center mb-4">Đăng ký tài khoản</h3>

            <!-- ⚠️ Hiển thị thông báo lỗi -->
            <div v-if="errorMsg" class="alert alert-danger py-2">
              <i class="pi pi-exclamation-triangle me-2"></i>{{ errorMsg }}
            </div>

            <!-- ✅ Hiển thị thông báo thành công -->
            <div v-if="successMsg" class="alert alert-success py-2">
              <i class="pi pi-check-circle me-2"></i>{{ successMsg }}
            </div>

            <form @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Họ tên</label>
                <input v-model.trim="name" class="form-control" placeholder="Nhập họ tên" />
              </div>
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input v-model.trim="username" class="form-control" placeholder="Nhập username" />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input v-model.trim="password" type="password" class="form-control" placeholder="Nhập mật khẩu" />
              </div>
              <button class="btn btn-success w-100">
                <i class="pi pi-user-plus me-1"></i> Tạo tài khoản
              </button>
            </form>

            <p class="mt-3 text-center">
              Đã có tài khoản?
              <router-link to="/login">Đăng nhập ngay</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '../api'
import { useRouter } from 'vue-router'

const name = ref('')
const username = ref('')
const password = ref('')
const errorMsg = ref('')
const successMsg = ref('')
const router = useRouter()

const register = async () => {
  // 🧩 Kiểm tra nhập đủ thông tin
  if (!name.value || !username.value || !password.value) {
    errorMsg.value = 'Vui lòng nhập đầy đủ họ tên, tên đăng nhập và mật khẩu!'
    successMsg.value = ''
    return
  }

  try {
    // 🧩 Kiểm tra username đã tồn tại chưa
    const { data: existing } = await api.get(`/users?username=${username.value}`)
    if (existing.length > 0) {
      errorMsg.value = 'Tên đăng nhập đã tồn tại, vui lòng chọn tên khác!'
      successMsg.value = ''
      return
    }

    // 🧩 Gửi dữ liệu đăng ký
    const user = {
      name: name.value,
      username: username.value,
      password: password.value,
      role: 'user',
      address: '',
      contact: ''
    }
    await api.post('/users', user)

    // ✅ Thành công
    errorMsg.value = ''
    successMsg.value = 'Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập...'

    setTimeout(() => router.push('/login'), 1500)
  } catch (err) {
    errorMsg.value = 'Không thể kết nối đến server!'
    successMsg.value = ''
  }
}
</script>
