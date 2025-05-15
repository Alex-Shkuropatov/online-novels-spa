<template>
 <Container class="py-4">
  <!-- Табуля -->
  <div class="mb-3">
   <Nav
    pills
    class="d-flex flex-nowrap overflow-auto"
   >
    <NavItem
     v-for="tab in tabs"
     :key="tab.value"
     class="flex-shrink-0 me-2"
    >
     <NavLink
      :active="activeTab === tab.value"
      @click="activeTab = tab.value"
     >
      {{ tab.label }}
     </NavLink>
    </NavItem>
   </Nav>
  </div>

  <!-- 2. Пошук -->
  <InputGroup class="mb-4">
   <FormInput
    v-model="search"
    placeholder="Search novels…"
   />
   <Button variant="outline-secondary">
    <i class="bi-search" />
   </Button>
  </InputGroup>

  <!-- 3. Сітка карток -->
  <Row>
   <Col
    v-for="novel in filteredNovels"
    :key="novel.novel_id"
    col="4"
    class="mb-4"
   >
    <PublicListCard :novel="novel" />
   </Col>
   <Col
    v-if="!filteredNovels.length"
    col="12"
   >
    <p class="text-center text-muted">
     Nothing found
    </p>
   </Col>
  </Row>
 </Container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '@/store/auth';
import PublicListCard from '@/components/novels/PublicListCard.vue';

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

// таби
const tabs: { label: string; value: TabValue }[] = [
 { label: 'All', value: 'all' },
 { label: 'Created', value: 'created' },
 { label: 'Playing', value: 'playing' },
 { label: 'Planned', value: 'planned' },
 { label: 'Completed', value: 'completed' },
 { label: 'Favorite', value: 'favorite' },
 { label: 'Abandoned', value: 'abandoned' },
];

const auth = useAuthStore();
const activeTab = ref<TabValue>('all');
const search = ref<string>('');
const novels = ref<Novel[]>([]);

// Fetch по endpoint `/novels/me/novels`
async function fetchNovels() {
 const url = new URL('http://127.0.0.1:8000/novels/me/novels');
 url.searchParams.set('user_status', activeTab.value);
 try {
  const res = await fetch(url.toString(), {
   headers: { Authorization: auth.authHeader },
  });
  if (!res.ok) throw new Error('Fetch error ' + res.status);
  novels.value = await res.json();
 }
 catch (e) {
  console.error('[MyList] fetchNovels:', e);
  novels.value = [];
 }
}

// Перезапускаем при смене таба
watch(activeTab, () => fetchNovels(), { immediate: true });

// Локальная фильтрація по назві
const filteredNovels = computed(() => {
 if (!search.value) return novels.value;
 const q = search.value.toLowerCase();
 return novels.value.filter(n => n.title.toLowerCase().includes(q));
});
</script>
