<template>
 <b-container class="d-flex flex-column chat-wrapper">
  <div
   ref="chatContainer"
   class="flex-grow-1 overflow-auto"
  >
   <pre>{{ segments }}</pre>
   <!--      <ChatMessage -->
   <!--          v-for="segment in segments" -->
   <!--          :key="segment.id" -->
   <!--          :segment="segment" -->
   <!--          @updated="handleUpdate" -->
   <!--          @deleted="handleDelete" -->
   <!--      /> -->
  </div>
  <ChatMainInput
   v-model="mainInputValue"
   placeholder="Write your story"
   @submitted="handleSubmit"
   @ai-generate="handleGenerated"
  />
 </b-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
// import { ref, onMounted } from 'vue';
// import ChatMessage from '@/components/ChatMessage.vue';
// import ChatInput from '@/components/MainInput.vue';
//
// const props = defineProps({ novelId: String });
// const chatContainer = ref(null);

const hasPrologue = computed(() => segments.value.length > 0);

const route = useRoute();
const novelId = route.params.novel_id as string;
const segments = ref([]);

const mainInputValue = ref('');

const fetchSegments = async () => {
 const res = await fetch(`http://127.0.0.1:8000/novels/${novelId}/text/segments`);
 if (res.ok) {
  segments.value = await res.json();
 }
 else {
  console.error('Failed to load segments');
 }
};

onMounted(() => {
 fetchSegments();
});

const handleSubmit = (newText) => {
 // segments.value.push({ id: Date.now(), text: newText });
};

const handleGenerated = (generatedText) => {
 // optional: insert into input
};

const handleUpdate = (updatedSegment) => {
 // const idx = segments.value.findIndex(s => s.id === updatedSegment.id);
 // if (idx !== -1) segments.value[idx] = updatedSegment;
};

const handleDelete = (id) => {
 // segments.value = segments.value.filter(s => s.id !== id);
};
</script>

<style scoped>
.chat-wrapper {
  height: calc(100vh - 50px);
}
#chatContainer::-webkit-scrollbar {
  display: none;
}
</style>
