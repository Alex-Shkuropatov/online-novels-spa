<template>
 <div class="min-vh-100 d-flex align-items-center justify-content-center">
  <div
   class="card shadow-sm p-4"
   style="width: 100%; max-width: 400px;"
  >
   <div class="text-center mb-4">
    <i class="bi bi-person-plus fs-1 text-primary" />
    <h4 class="mt-2">
     Registration
    </h4>
    <p class="text-muted">
     Create a new account
    </p>
   </div>

   <form @submit.prevent="handleRegister">
    <div class="mb-3">
     <label
      for="email"
      class="form-label"
     >Email</label>
     <input
      id="email"
      v-model="email"
      type="email"
      class="form-control"
      placeholder="you@example.com"
      required
     >
    </div>

    <div class="mb-3">
     <label
      for="username"
      class="form-label"
     >User Name</label>
     <input
      id="username"
      v-model="username"
      type="text"
      class="form-control"
      placeholder="nickname"
      required
     >
    </div>

    <div class="mb-3">
     <label
      for="password"
      class="form-label"
     >Password</label>
     <input
      id="password"
      v-model="password"
      type="password"
      class="form-control"
      placeholder="Enter your password"
      required
     >
    </div>

    <div class="mb-3">
     <label
      for="birthday"
      class="form-label"
     >Date of birth</label>
     <input
      id="birthday"
      v-model="birthday"
      type="date"
      class="form-control"
      :max="today"
      required
     >
    </div>

    <div class="d-flex justify-content-center mt-4">
     <button
      type="submit"
      class="btn btn-primary px-4"
     >
      Sign up
     </button>
    </div>
   </form>

   <p class="text-center text-muted mt-3 mb-0">
    Already have an account?
    <NuxtLink
     to="/sign-in"
     class="text-decoration-none text-primary"
    >
     Sign in
    </NuxtLink>
   </p>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const username = ref('');
const password = ref('');
const birthday = ref('');
const today = new Date().toISOString().split('T')[0];

async function handleRegister() {
 try {
  const response = await fetch('http://127.0.0.1:8000/auth/register', {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json',
   },
   body: JSON.stringify({
    email: email.value,
    username: username.value,
    password: password.value,
    birthday: new Date(birthday.value).toISOString(),
   }),
  });

  // const data = await response.json();

  alert('Registration was successful');
  navigateTo('/sign-in');
 }
 catch (err) {
  console.error(err);
  alert('Something went wrong');
 }
}
</script>
