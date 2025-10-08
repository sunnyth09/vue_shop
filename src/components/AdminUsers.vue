<template>
  <div class="card shadow-sm">
    <div class="card-body">
      <h5 class="card-title mb-3">
        <i class="pi pi-users me-2"></i>Quản lý tài khoản người dùng
      </h5>

      <div class="table-responsive">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>#</th>
              <th>Họ tên</th>
              <th>Username</th>
              <th>Role</th>
              <th>Liên hệ</th>
              <th>Địa chỉ</th>
              <th class="text-end">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td>{{ u.id }}</td>
              <td><input v-model="u.name" class="form-control form-control-sm" /></td>
              <td>{{ u.username }}</td>
              <td>
                <select v-model="u.role" class="form-select form-select-sm">
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td><input v-model="u.contact" class="form-control form-control-sm" /></td>
              <td><input v-model="u.address" class="form-control form-control-sm" /></td>
              <td class="text-end">
                <div class="btn-group btn-group-sm">
                  <button class="btn btn-primary" @click="save(u)">
                    <i class="pi pi-save"></i>
                  </button>
                  <button class="btn btn-danger" :disabled="u.username === 'admin'" @click="remove(u.id)">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'

const users = ref([])

onMounted(async () => {
  const { data } = await api.get('/users')
  users.value = data
})

const save = async (u) => {
  await api.put(`/users/${u.id}`, u)
  alert('Đã lưu thay đổi!')
}

const remove = async (id) => {
  if (!confirm('Xóa tài khoản này?')) return
  await api.delete(`/users/${id}`)
  users.value = users.value.filter((x) => x.id !== id)
}
</script>
