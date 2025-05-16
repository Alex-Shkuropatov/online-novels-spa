<!-- components/novels/MyList.vue -->
<template>
  <b-container class="py-4">
    <!-- Tabs -->
    <div class="mb-3">
      <b-nav pills class="d-flex flex-nowrap overflow-auto">
        <b-nav-item
          v-for="tab in tabs"
          :key="tab.value"
          class="flex-shrink-0 me-2"
        >
          <b-nav-link
            :active="activeTab === tab.value"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </b-nav-link>
        </b-nav-item>
      </b-nav>
    </div>

    <!-- Search bar -->
    <div class="input-group mb-4">
      <!-- Plain bootstrap input -->
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
        <i class="bi-search me-1" />Search
      </button>
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

      <b-col v-if="filteredNovels.length === 0" cols="12">
        <p class="text-center text-muted">Nothing found</p>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/store/auth'
import PublicListCard from '@/components/novels/PublicListCard.vue'

interface Novel {
  novel_id: string
  title: string
  cover_image_url?: string
  state: string
}

type TabValue =
  | 'all'
  | 'created'
  | 'playing'
  | 'planned'
  | 'completed'
  | 'favorite'
  | 'abandoned'

const tabs = [
  { label: 'All',       value: 'all'       },
  { label: 'Created',   value: 'created'   },
  { label: 'Playing',   value: 'playing'   },
  { label: 'Planned',   value: 'planned'   },
  { label: 'Completed', value: 'completed' },
  { label: 'Favorite',  value: 'favorite'  },
  { label: 'Abandoned', value: 'abandoned' },
] as const

const auth      = useAuthStore()
const activeTab = ref<TabValue>('all')
const search    = ref<string>('')
const novels    = ref<Novel[]>([])

// Pull your “/novels/me/novels” endpoint
async function fetchNovels() {
  const url = new URL('http://127.0.0.1:8000/novels/me/novels')
  if (activeTab.value !== 'all') {
    url.searchParams.set('user_status', activeTab.value)
  }
  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: auth.authHeader }
    })
    if (!res.ok) throw new Error(`Fetch error ${res.status}`)
    novels.value = await res.json()
  }
  catch (e) {
    console.error('[MyList] fetchNovels:', e)
    novels.value = []
  }
}

// Re-load whenever the tab changes
watch(activeTab, () => {
  search.value = ''    // reset the search box
  fetchNovels()
}, { immediate: true })

// If you want the Search button to *refetch* from server,
// uncomment this instead of filtering locally
// function onSearchClick() {
//   fetchNovels()
// }

function onSearchClick() {
  // no-op, since we filter locally below
  // But you could also re-query backend `/search?q=${search.value}`
}

const filteredNovels = computed(() => {
  if (!search.value.trim()) return novels.value
  const q = search.value.toLowerCase()
  return novels.value.filter(n =>
    n.title.toLowerCase().includes(q)
  )
})
</script>
