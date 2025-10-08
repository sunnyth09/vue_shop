<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="text-center mb-4">Đăng nhập</h3>

            <!-- ⚠️ Thông báo lỗi -->
            <div v-if="errorMsg" class="alert alert-danger py-2">
              <i class="pi pi-exclamation-triangle me-2"></i>{{ errorMsg }}
            </div>

            <form @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label">Tên đăng nhập</label>
                <input
                  v-model.trim="username"
                  class="form-control"
                  placeholder="Nhập username"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Mật khẩu</label>
                <input
                  v-model.trim="password"
                  type="password"
                  class="form-control"
                  placeholder="Nhập mật khẩu"
                />
              </div>
              <button class="btn btn-primary w-100">
                <i class="pi pi-sign-in me-1"></i> Đăng nhập
              </button>
            </form>

            <p class="mt-3 text-center">
              Chưa có tài khoản?
              <router-link to="/register">Đăng ký ngay</router-link>
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

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const router = useRouter()

const login = async () => {
  if (!username.value || !password.value) {
    errorMsg.value = 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!'
    return
  }

  try {
    const { data } = await api.get(`/users?username=${username.value}&password=${password.value}`)
    if (data.length > 0) {
      const user = data[0]
      localStorage.setItem('user', JSON.stringify(user))
      errorMsg.value = ''

      // ✅ Nếu là admin → chuyển đến admin, nếu là user → về trang chủ
      if (user.role === 'admin') {
        router.push('/admin')
      } else {
        router.push('/')   // ← chuyển về trang chủ
      }

      alert('Đăng nhập thành công!')
    } else {
      errorMsg.value = 'Sai tài khoản hoặc mật khẩu!'
    }
  } catch (e) {
    errorMsg.value = 'Không thể kết nối đến server!'
  }
  window.dispatchEvent(new Event('storage'))

}
</script>
