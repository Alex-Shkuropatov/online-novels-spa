<template>
  <b-container class="py-4">
    <div class="d-flex gap-2 mb-4">
      <div class="input-group flex-grow-1">
        <input
          v-model="search"
          type="text"
          class="form-control"
          placeholder="Search novels…"
        />
        <button
          class="btn btn-outline-primary"
          @click="onSearchClick"
        >
          <i class="bi-search me-1" /> Search
        </button>
      </div>
      <GenreFilterModal v-model="selectedGenres" />
    </div>

    <b-row>
      <b-col
        v-for="novel in filteredNovels"
        :key="novel.novel_id"
        cols="4"
        class="mb-4"
      >
        <PublicListCard
          :novel="novel"
          :novel-url="`/novels/${novel.novel_id}`"
        />
      </b-col>
      <b-col v-if="filteredNovels.length === 0" cols="12">
        <p class="text-center text-muted">Nothing found</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import GenreFilterModal from './GenreFilterModal.vue';
import PublicListCard from './PublicListCard.vue';

interface Novel { novel_id: string; title: string; genres?: string[]; genre?: string; }

const search = ref('');
const selectedGenres = ref<string[]>([]);
const novels = ref<Novel[]>([]);

async function fetchNovels() {
  try {
    let endpoint: string;
    if (selectedGenres.value.length > 0) {
      const url = new URL('http://127.0.0.1:8000/novels/public/by-all-genres');
      selectedGenres.value.forEach(g => url.searchParams.append('genres', g));
      endpoint = url.toString();
    } else {
      endpoint = 'http://127.0.0.1:8000/novels/public';
    }

    console.log('Fetching from', endpoint);
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error(`Fetch ${res.status}`);
    novels.value = await res.json();
  } catch (e) {
    console.error(e);
    novels.value = [];
  }
}

watch(selectedGenres, () => {
  search.value = '';
  fetchNovels();
}, { immediate: true });

function onSearchClick() {
  // поиск будет применён в computed ниже
}

const filteredNovels = computed(() => {
  let list = novels.value;
  if (search.value.trim()) {
    const q = search.value.toLowerCase();
    list = list.filter(n => n.title.toLowerCase().includes(q));
  }
  return list;
});

onMounted(fetchNovels);
</script>
