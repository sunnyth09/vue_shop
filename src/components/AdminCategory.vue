<template>
  <div class="row">
    <div class="col-md-4">
      <div class="card shadow-sm mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ editing ? 'Sửa' : 'Thêm' }} danh mục</h5>
          <form @submit.prevent="save">
            <div class="mb-2">
              <label class="form-label">Tên danh mục</label>
              <input v-model="form.name" class="form-control" required />
            </div>
            <div class="d-grid gap-2">
              <button class="btn btn-success"><i class="pi pi-save me-1"></i>{{ editing ? 'Cập nhật' : 'Thêm mới' }}</button>
              <button v-if="editing" type="button" class="btn btn-secondary" @click="reset"><i class="pi pi-times me-1"></i>Hủy</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="col-md-8">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">Danh sách danh mục</h5>
          <div class="table-responsive">
            <table class="table table-bordered align-middle">
              <thead><tr><th>#</th><th>Tên</th><th class="text-end">Thao tác</th></tr></thead>
              <tbody>
                <tr v-for="c in categories" :key="c.id">
                  <td>{{ c.id }}</td>
                  <td>{{ c.name }}</td>
                  <td class="text-end">
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-primary" @click="edit(c)"><i class="pi pi-pencil"></i></button>
                      <button class="btn btn-danger" @click="del(c.id)"><i class="pi pi-trash"></i></button>
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
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import api from '../api'
const categories = ref([])
const editing = ref(false)
const form = reactive({ id:null, name:'' })
const load = async () => { const { data } = await api.get('/categories'); categories.value = data }
onMounted(load)
const reset = () => { editing.value = false; Object.assign(form, { id:null, name:'' }) }
const edit = (c) => { Object.assign(form, JSON.parse(JSON.stringify(c))); editing.value = true }
const del = async (id) => { if (!confirm('Xóa danh mục?')) return; await api.delete('/categories/' + id); await load() }
const save = async () => {
  if (editing.value) await api.put('/categories/' + form.id, form)
  else await api.post('/categories', form)
  await load(); reset()
}
</script>