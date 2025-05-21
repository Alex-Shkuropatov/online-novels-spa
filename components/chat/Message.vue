<template>
 <b-card class="mb-3">
  <div v-if="!isEditing">
   <p class="mb-2">
    {{ segment.text }}
   </p>
   <b-button
    size="sm"
    color="warning"
    class="me-2"
    @click="startEdit"
   >
    Редактировать
   </b-button>
   <b-button
    size="sm"
    color="danger"
    @click="emitDelete"
   >
    Удалить
   </b-button>
  </div>
  <div v-else>
   <b-form-textarea
    v-model="editedText"
    rows="3"
    class="mb-2"
   />
   <b-button
    size="sm"
    color="success"
    class="me-2"
    @click="saveEdit"
   >
    Сохранить
   </b-button>
   <b-button
    size="sm"
    variant="secondary"
    @click="cancelEdit"
   >
    Отмена
   </b-button>
  </div>
 </b-card>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({ segment: Object });
const emit = defineEmits(['updated', 'deleted']);

const isEditing = ref(false);
const editedText = ref(props.segment.text);

const startEdit = () => {
 isEditing.value = true;
 editedText.value = props.segment.text;
};

const cancelEdit = () => {
 isEditing.value = false;
};

const saveEdit = async () => {
 const response = await fetch(`http://127.0.0.1:8000/novels/segments/${props.segment.id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: editedText.value }),
 });
 if (response.ok) {
  emit('updated', { ...props.segment, text: editedText.value });
  isEditing.value = false;
 }
};

const emitDelete = async () => {
 const res = await fetch(`http://127.0.0.1:8000/novels/segments/${props.segment.id}`, {
  method: 'DELETE',
 });
 if (res.ok) emit('deleted', props.segment.id);
};
</script>
