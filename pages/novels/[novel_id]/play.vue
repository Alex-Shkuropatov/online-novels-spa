<template>
<!--  <b-container class="d-flex flex-column vh-100">
    <div class="flex-grow-1 overflow-auto" ref="chatContainer">
      <ChatMessage
          v-for="segment in segments"
          :key="segment.id"
          :segment="segment"
          @updated="handleUpdate"
          @deleted="handleDelete"
      />
    </div>
    <ChatInput @submitted="handleSubmit" @generated="handleGenerated" />
  </b-container> -->
</template>

<script setup>
// import { ref, onMounted } from 'vue';
// import ChatMessage from '@/components/ChatMessage.vue';
// import ChatInput from '@/components/MainInput.vue';
//
// const props = defineProps({ novelId: String });
// const segments = ref([]);
// const chatContainer = ref(null);
//
// const fetchSegments = async () => {
//   const res = await fetch(`http://127.0.0.1:8000/novels/${props.novelId}/text/segments`);
//   if (res.ok) {
//     segments.value = await res.json();
//   } else {
//     console.error('Failed to load segments');
//   }
// };
//
// onMounted(() => {
//   fetchSegments();
// });

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
#chatContainer::-webkit-scrollbar {
  display: none;
}
</style>
