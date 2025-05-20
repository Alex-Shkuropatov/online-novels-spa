<template>
 <b-container class="py-4">
  <!-- Tabs -->
  <div class="mb-3">
   <b-nav
    pills
    class="d-flex flex-nowrap overflow-auto"
   >
    <b-nav-item
     v-for="tab in tabs"
     :key="tab.value"
     class="flex-shrink-0 me-2"
    >
     <!-- Удалили :active -->
     <b-nav-link
      :class="[
       'px-3',
       activeTab === tab.value
        ? 'bg-success text-white'
        : 'bg-transparent text-success',
      ]"
      style="cursor: pointer; white-space: nowrap;"
      @click="activeTab = tab.value"
     >
      {{ tab.label }}
     </b-nav-link>
    </b-nav-item>
   </b-nav>
  </div>

<!-- Search bar -->
<div class="input-group mb-4">
  <input
    v-model="search"
    type="text"
    class="form-control"
    placeholder="Search novels…"
  />
  <button
    class="btn btn-outline-primary"
    type="button"
    @click="onSearchClick"
  >
    <i class="bi-search me-1" /> Search
  </button>
  <!-- Фильтр по жанрам -->
  <GenreFilterModal
    v-model="selectedGenres"

  />
</div>

  <!-- Grid of cards -->
  <b-row>
   <b-col
    v-for="novel in filteredNovels"
    :key="novel.novel_id"
    cols="4"
    class="mb-4"
   >
    <PublicListCard
     :novel="novel"
     :novel-url="`/profile/my-novels/${novel.novel_id}`"
    />
   </b-col>

   <b-col
    v-if="filteredNovels.length === 0"
    cols="12"
   >
    <p class="text-center text-muted">
     Nothing found
    </p>
   </b-col>
  </b-row>
 </b-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import GenreFilterModal from "./GenreFilterModal.vue";
import PublicListCard from '@/components/novels/PublicListCard.vue';


const selectedGenres = ref<string[]>([]);

interface Novel {
 novel_id: string;
 title: string;
 cover_image_url?: string;
 state: string;
}

type TabValue =
 | 'all'
 | 'created'
 | 'playing'
 | 'planned'
 | 'completed'
 | 'favorite'
 | 'abandoned';

const tabs = [
 { label: 'All', value: 'all' },
 { label: 'Created', value: 'created' },
 { label: 'Playing', value: 'playing' },
 { label: 'Planned', value: 'planned' },
 { label: 'Completed', value: 'completed' },
 { label: 'Favorite', value: 'favorite' },
 { label: 'Abandoned', value: 'abandoned' },
] as const;

const auth = useAuthStore();
const activeTab = ref<TabValue>('all');
const search = ref<string>('');
const novels = ref<Novel[]>([]);

async function fetchNovels() {
  const url = new URL('http://127.0.0.1:8000/novels/me/novels');

  if (activeTab.value !== 'all') {
    url.searchParams.set('user_status', activeTab.value);
  }

  if (selectedGenres.value.length > 0) {
    selectedGenres.value.forEach((genre) =>
      url.searchParams.append('genres', genre)
    );
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: auth.authHeader },
    });
    if (!res.ok) throw new Error(`Fetch error ${res.status}`);
    novels.value = await res.json();
    console.log('Fetched novels:', novels.value);
  } catch {
    novels.value = [];
  }
}


watch([activeTab, selectedGenres], () => {
  search.value = '';
  fetchNovels();
}, { immediate: true });


function onSearchClick() {
 /* оставить пустым или вызвать fetchNovels() */
}

const filteredNovels = computed(() => {
  // если данных ещё нет или массив пуст — вернуть пустой
  if (!novels.value || novels.value.length === 0) {
    return [];
  }

  // без поискового запроса — показываем всё
  if (!search.value.trim()) {
    return novels.value;
  }

  // иначе фильтруем по title
  const q = search.value.toLowerCase();
  return novels.value.filter(n =>
    n.title.toLowerCase().includes(q),
  );
});
;

</script>
