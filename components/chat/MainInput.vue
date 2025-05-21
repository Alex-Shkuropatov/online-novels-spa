<template>
 <div class="border-top py-2">
  <div class="d-flex">
   <BFormTextarea
    v-model="inputText"
    class="me-2"
    :placeholder="placeholder"
    rows="3"
    @keyup.enter="submit"
   />
  </div>
  <div class="d-flex justify-content-end mt-2 gap-2">
   <b-button
    color="teal"
    text-color="white"
    icon="bi:stars"
    @click="generateText"
   >
    Generate
   </b-button>
   <b-button
    color="primary"
    @click="submit"
   >
    Send
   </b-button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
 modelValue?: string;
 placeholder?: string;
}>();

const emit = defineEmits<{
 (e: 'submitted', value: string): void;
 (e: 'ai-generate'): void;
 (e: 'update:modelValue', value: string): void;
}>();

const inputText = ref<string>(props.modelValue || '');

watch(() => props.modelValue, (val) => {
 inputText.value = val || '';
});

const submit = (): void => {
 if (!inputText.value.trim()) return;
 emit('submitted', inputText.value);
 emit('update:modelValue', '');
 inputText.value = '';
};

const generateText = (): void => {
 emit('ai-generate');
};
</script>

<style scoped>
/* optional styles */
</style>
