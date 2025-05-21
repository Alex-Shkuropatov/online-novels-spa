<template>
 <div class="d-flex border-top p-3">
  <b-form-input
   v-model="inputText"
   class="me-2"
   placeholder="Введите текст..."
   @keyup.enter="submit"
  />
  <b-button
   color="primary"
   class="me-2"
   @click="submit"
  >
   Отправить
  </b-button>
  <b-button
   color="info"
   @click="generateText"
  >
   Сгенерировать
  </b-button>
 </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submitted', 'generated']);
const inputText = ref('');

const submit = () => {
 if (!inputText.value.trim()) return;
 emit('submitted', inputText.value);
 inputText.value = '';
};

const generateText = async () => {
 const res = await fetch('http://127.0.0.1:8000/ai/generate-text');
 if (res.ok) {
  const data = await res.json();
  inputText.value = data.text;
  emit('generated', data.text);
 }
};
</script>
