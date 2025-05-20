
<template>
 <div>
<!-- Кнопка открытия -->
  <b-button
    color="primary"
    toggle="modal"
    target="#genreFilterModal"
  >
    Filter
  </b-button>

  <!-- Модальное окно -->
  <Modal id="genreFilterModal">
    <ModalDialog>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Choose genres</ModalTitle>
          <CloseButton dismiss="modal" />
        </ModalHeader>

        <ModalBody>
          <!-- <div v-if="genres.length === 0">Loading genres...</div>
          <div v-else class="d-flex flex-column gap-2">
            <div
              v-for="genre in genres"
              :key="genre"
              class="form-check"
            >
              <input
                class="form-check-input"
                type="checkbox"
                :id="genre"
                :value="genre"
                v-model="localSelectedGenres"
              />
              <label class="form-check-label" :for="genre">
                {{ genre }}
              </label>
            </div>
          </div> -->
        </ModalBody>

        <ModalFooter>
          <!-- <b-button
            color="secondary"
            dismiss="modal"
          >
            Cancel
          </b-button>
          <b-button
            color="primary"
            @click="applyFilter"
            dismiss="modal"
          >
            Filter
          </b-button> -->
        </ModalFooter>
      </ModalContent>
    </ModalDialog>
  </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  modelValue: Array
});
const emit = defineEmits(['update:modelValue']);

const genres = ref([]);
const localSelectedGenres = ref([...props.modelValue]);

watch(
  () => props.modelValue,
  (newVal) => {
    localSelectedGenres.value = [...newVal];
  }
);

const applyFilter = () => {
  emit('update:modelValue', localSelectedGenres.value);
};

onMounted(async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/novels/genres');
    if (!response.ok) throw new Error('Failed to fetch genres');
    const data = await response.json();
    genres.value = data;
  } catch (error) {
    console.error('Failed to fetch genres:', error);
  }
});

</script>
