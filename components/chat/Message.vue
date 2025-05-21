<template>
 <div
  v-if="!isEditing"
  class="mb-3"
 >
  <b-card
   class="p-2 mb-1"
   color="teal-100"
  >
   <p class="mb-2">
    {{ segment.content }}
   </p>
  </b-card>
  <div class="d-flex justify-content-end">
   <b-button
    size="sm"
    icon="bi:trash"
    @click="emitDelete"
   >
    Delete
   </b-button>
   <b-button
    size="sm"
    class="me-2"
    icon="bi:pencil"
    @click="startEdit"
   >
    Edit
   </b-button>
  </div>
 </div>
 <div v-else>
  <b-card
   class="p-2 mb-1"
   color="teal-100"
  >
   <b-form-textarea
    v-model="editedText"
    rows="5"
    class="mb-2"
   />
   <div class="d-flex justify-content-end">
    <b-button
     size="sm"
     icon="bi:x"
     variant="secondary"
     @click="cancelEdit"
    >
     Cancel
    </b-button>
    <b-button
     class="me-2"
     size="sm"
     color="success"
     icon="bi:check"
     @click="saveEdit"
    >
     Save
    </b-button>
   </div>
  </b-card>
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Segment {
 segment_id: string;
 author_id: string;
 content: string;
 created_at: string;
}

const props = defineProps<{
 segment: Segment;
 novelId: string;
}>();

const emit = defineEmits<{
 (e: 'updated', segment: Segment): void;
 (e: 'deleted', segmentId: string): void;
}>();

const isEditing = ref<boolean>(false);
const editedText = ref<string>(props.segment.content);

const startEdit = (): void => {
 isEditing.value = true;
 editedText.value = props.segment.content;
};

const cancelEdit = (): void => {
 isEditing.value = false;
};

const saveEdit = async (): Promise<void> => {
 const response = await fetch(`http://127.0.0.1:8000/novels/segments/${props.segment.segment_id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: editedText.value }),
 });
 if (response.ok) {
  emit('updated', { ...props.segment, content: editedText.value });
  isEditing.value = false;
 }
 else {
  console.error('Failed to update segment');
 }
};

const emitDelete = async (): Promise<void> => {
 const res = await fetch(`http://127.0.0.1:8000/novels/segments/${props.segment.segment_id}`, {
  method: 'DELETE',
 });
 if (res.ok) {
  emit('deleted', props.segment.segment_id);
 }
 else {
  console.error('Failed to delete segment');
 }
};
</script>

<style scoped>
/* optional styles */
</style>
