<template>
 <div class="min-vh-100 d-flex flex-column justify-content-center align-items-center bg-body">
   <b-card class="w-100 shadow-sm border-0 px-3 py-4" style="max-width: 380px">
     <div class="text-center mb-3">
       <b-icon icon="person-circle" font-scale="2.5" class="text-primary" />
       <h5 class="mt-2">Добро пожаловать</h5>
       <p class="text-muted mb-0">Войдите в свой аккаунт</p>
     </div>

     <b-form @submit.prevent="handleLogin">
       <b-form-group label="Email" label-for="email" class="mb-3">
         <b-form-input
           id="email"
           v-model="email"
           type="email"
           placeholder="name@example.com"
           required
           size="lg"
         />
       </b-form-group>

       <b-form-group label="Пароль" label-for="password" class="mb-3">
         <b-form-input
           id="password"
           v-model="password"
           type="password"
           placeholder="Введите пароль"
           required
           size="lg"
         />
       </b-form-group>

       <b-button
         type="submit"
         variant="primary"
         size="lg"
         block
         class="mt-2"
       >
         Войти
       </b-button>
     </b-form>

     <p class="text-center text-muted mt-3 mb-0" style="font-size: 0.9rem;">
       Нет аккаунта?
       <NuxtLink to="/sign-up" class="text-primary text-decoration-none">
         Зарегистрируйтесь
       </NuxtLink>
     </p>
   </b-card>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function handleLogin() {
 console.log('Логин:', email.value, password.value)
 // Здесь может быть реальный вызов API
}
</script>

<style scoped>
.bg-body {
 background-color: #f2f4f8;
}
</style>