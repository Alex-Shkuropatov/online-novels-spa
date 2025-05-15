<template>
 <div class="container py-4">
  <h1>Edit Novel</h1>
  <ClientOnly>
   <p v-if="!novel">
    Loading...
   </p>
   <div v-else>
    <NovelImageUploader
     :novel-id="novelId"
     :image-url="novel.cover_image_url"
     @update:image-url="handleImageUpdate"
    />

    <div class="form-text my-4 text-primary">
     <BIcon
      icon="bi:info-circle"
     />
     If you want to Generate based on what you entered, then save the data first and try to Generate.
    </div>
    <AiAssistedInput
     label="Title"
     name="title"
     :model-value="novel.title"
     :loading="isLoadingTitle"
     @update:model-value="handleTitleUpdate"
     @generate="generateMetadataFieldWithAi('title')"
    />

    <AiAssistedInput
     label="Description"
     name="description"
     :model-value="novel.description"
     :loading="isLoadingDescription"
     hint="Briefly describe the main idea of the story - who your characters are, what their purpose is, and what conflict is unfolding."
     @update:model-value="handleDescriptionUpdate"
     @generate="generateMetadataFieldWithAi('description')"
    />

    <AiAssistedInput
     label="Setting"
     name="setting"
     :model-value="novel.setting"
     :loading="isLoadingSetting"
     hint="Specify the time and place of the action, the atmosphere of the world (city, nature, futuristic/historical setting) and key features of the location."
     @update:model-value="handleSettingUpdate"
     @generate="generateMetadataFieldWithAi('setting')"
    />

    <div class="form-check form-switch mt-4">
     <input
      id="isPublic"
      v-model="novel.is_public"
      class="form-check-input"
      type="checkbox"
     >
     <label
      class="form-check-label"
      for="isPublic"
     >
      Public novel
     </label>
    </div>

    <div class="d-flex justify-content-center mt-4">
     <button
      class="btn btn-success"
      :disabled="isSubmitting"
      @click="submitEditedNovel"
     >
      <span
       v-if="isSubmitting"
       class="spinner-border spinner-border-sm me-2"
      />
      {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
     </button>
    </div>
   </div>
  </ClientOnly>
 </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useNovelStore } from '@/store/novel-editor';

import NovelImageUploader from '~/components/novel-editor/NovelImageUploader.vue';

definePageMeta({
 middleware: 'auth',
});

const route = useRoute();
const novelId = computed(() => route.params.novel_id as string);

const novelStore = useNovelStore();
const novel = novelStore.novel;

// Fetch novel data when the page is loaded
await useAsyncData(`novel-${novelId.value}`, async () => {
 const token = useCookie('access_token').value;

 const response = await fetch(`http://127.0.0.1:8000/novels/${novelId.value}`, {
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

 const data = await response.json();

 // Set novel data into Pinia store
 novelStore.setNovel(data);

 return data;
});

function handleImageUpdate(url: string): void {
 novelStore.updateField('cover_image_url', url);
}

function handleTitleUpdate(text: string): void {
 novel.title = text;
}
function handleDescriptionUpdate(text: string): void {
 novel.description = text;
}
function handleSettingUpdate(text: string): void {
 novel.setting = text;
}

const isLoadingTitle = ref(false);
const isLoadingDescription = ref(false);
const isLoadingSetting = ref(false);

async function generateMetadataFieldWithAi(fieldName: 'title' | 'description' | 'setting'): Promise<void> {
 if (!novel || !novel.novel_id) {
  console.error('No novel loaded or novel_id missing');
  return;
 }

 const token = useCookie('access_token').value;

 const loadingMap = {
  title: isLoadingTitle,
  description: isLoadingDescription,
  setting: isLoadingSetting,
 };

 const fieldLoading = loadingMap[fieldName];
 fieldLoading.value = true;

 try {
  const response = await fetch(`http://127.0.0.1:8000/ai/novels/${novel.novel_id}/metadata`, {
   method: 'POST',
   headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
   },
   body: JSON.stringify({
    fields: [fieldName],
   }),
  });

  if (!response.ok) {
   throw new Error(`AI generation failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  const generatedValue = result[fieldName];

  if (generatedValue) {
   novelStore.updateField(fieldName, generatedValue);
  }
  else {
   console.warn(`Field "${fieldName}" not found in AI response`);
  }
 }
 catch (err) {
  console.error('Error during AI-assisted metadata generation:', err);
  alert('Failed to generate content. Please try again.');
 }
 finally {
  fieldLoading.value = false;
 }
}

const isSubmitting = ref(false);

async function submitEditedNovel(): Promise<void> {
 if (!novel || !novel.novel_id) {
  alert('No novel loaded.');
  return;
 }

 isSubmitting.value = true;
 const token = useCookie('access_token').value;

 try {
  const response = await fetch(`http://127.0.0.1:8000/novels/${novel.novel_id}`, {
   method: 'PUT',
   headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
   },
   body: JSON.stringify(novel),
  });

  if (!response.ok) {
   const errorText = await response.text();
   throw new Error(`Server responded with ${response.status}: ${errorText}`);
  }

  alert('Novel saved successfully.');
 }
 catch (err) {
  console.error('Failed to save novel:', err);
  alert('Failed to save novel.');
 }
 finally {
  isSubmitting.value = false;
 }
}
</script>
