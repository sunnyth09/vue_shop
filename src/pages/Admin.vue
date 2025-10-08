<template>
  <div class="container mt-3">
    <h3 class="mb-3"><i class="pi pi-cog me-2"></i>Trang quản trị</h3>
    <ul class="nav nav-tabs mb-3">
      <li class="nav-item"><router-link to="/admin/products" class="nav-link" active-class="active">Sản phẩm</router-link></li>
      <li class="nav-item"><router-link to="/admin/category" class="nav-link" active-class="active">Danh mục</router-link></li>
      <li class="nav-item"><router-link to="/admin/users" class="nav-link" active-class="active">Tài khoản</router-link></li>
    </ul>
    <router-view />
  </div>
</template>
<script setup>
</script>