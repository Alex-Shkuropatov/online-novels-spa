<template>
 <div class="container py-4">
  <h1>Edit your character</h1>

  <character-form />

  <div class="d-flex justify-content-center mt-4">
   <NuxtLink
    :to="`/profile/my-novels/${novelId}`"
    class="btn btn-outline-secondary d-flex align-items-center gap-2 mx-1"
   >
    <BIcon
     icon="bi:chevron-left"
    />
    Back
   </NuxtLink>
   <button
    class="btn btn-success mx-1"
    :disabled="isSubmitting"
    @click="onSubmitCharacter"
   >
    <span
     v-if="isSubmitting"
     class="spinner-border spinner-border-sm me-2"
    />
    {{ isSubmitting ? 'Saving...' : 'Save character' }}
   </button>
  </div>
 </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useCharacterStore } from '~/store/character';
import type { INovelCharacter } from '~/types/character';
import CharacterForm from '~/components/novel-editor/CharacterForm.vue';

definePageMeta({
 middleware: 'auth',
});

const route = useRoute();
const characterStore = useCharacterStore();
const novelId = computed(() => route.params.novel_id as string);
const characterId = computed(() => route.params.character_id as string);

// Fetch character data when the page is loaded
const { data: character } = await useAsyncData(`character-${characterId.value}`, async () => {
 const token = useCookie('access_token').value;

 const response = await fetch(`http://127.0.0.1:8000/novels/${novelId.value}/characters`, {
  method: 'GET',
  headers: {
   Authorization: `Bearer ${token}`,
   Accept: 'application/json',
  },
 });

 if (!response.ok) {
  throw createError({
   statusCode: response.status,
   message: 'Failed to load novel',
  });
 }

 const responseData = await response.json();
 // find our character in the list of all characters
 const characterData = responseData.find((char: INovelCharacter) => char.character_id === characterId.value);
 return characterData;
});

if (!character.value) {
 throw createError({
  statusCode: 404,
  statusMessage: 'Page Not Found',
 });
}
else {
 // Set novel data into Pinia store
 characterStore.setCharacter(character.value as INovelCharacter);
}

const isSubmitting = ref(false);

async function onSubmitCharacter() {

}
</script>
