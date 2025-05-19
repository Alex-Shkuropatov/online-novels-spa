<!-- components/novels/MyList.vue -->
<template>
  <b-container class="py-4">
    <!-- Tabs (unchanged) -->
    <div class="mb-3">
      <b-nav pills class="d-flex flex-nowrap overflow-auto">
        <b-nav-item
          v-for="tab in tabs"
          :key="tab.value"
          class="flex-shrink-0 me-2"
        >
          <b-nav-link
            @click="activeTab = tab.value"
            :class="[
              'px-3',
              activeTab === tab.value
                ? 'bg-success text-white'
                : 'bg-transparent text-success'
            ]"
            style="cursor: pointer; white-space: nowrap;"
          >
            {{ tab.label }}
          </b-nav-link>
        </b-nav-item>
      </b-nav>
    </div>

    <!-- Search + Filter bar -->
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
      <button
        class="btn btn-outline-secondary ms-2"
        type="button"
        @click="showFilter = true"
      >
        <i class="bi-filter me-1" /> Filter
      </button>
    </div>

    <!-- grid of cards -->
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

    <!-- Full-screen genres filter modal -->
    <BModal
      v-model:visible="showFilter"
      :title="`Filter by genres`"
      hide-footer
      modal-class="modal-fullscreen"
    >
      <!-- header actions -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <b-button variant="link" @click="showFilter = false">
          ← Back
        </b-button>
        <b-button variant="link" @click="clearGenres">
          Reset
        </b-button>
      </div>

      <!-- genre search -->
      <b-form-input
        v-model="genreSearch"
        placeholder="Filter genres…"
        class="mb-3"
      />

      <!-- scrollable list -->
      <div
        style="max-height: calc(100vh - 200px); overflow-y: auto; padding-right: .5rem;"
      >
        <b-form-checkbox-group
          v-model="selectedGenres"
          stacked
        >
          <b-form-checkbox
            v-for="g in filteredGenreOptions"
            :key="g"
            :value="g"
          >
            {{ g }}
          </b-form-checkbox>
        </b-form-checkbox-group>
      </div>

      <!-- bottom-fixed apply -->
      <div
        class="position-fixed bottom-0 start-0 w-100 p-3 bg-white border-top"
      >
        <b-button variant="primary" block @click="applyGenres">
          Apply
        </b-button>
      </div>
    </BModal>
  </b-container>
</template>

<script setup lang="ts">
import { BModal } from 'bootstrap-vue-3'
import { ref, computed, watch, onMounted } from 'vue'
import { useAuthStore } from '@/store/auth'
import PublicListCard from '@/components/novels/PublicListCard.vue'
defineExpose({ components: { BModal } })

interface Novel {
  novel_id: string
  title: string
  cover_image_url?: string
  genres: string[]
  state: string
}

// --- tabs & state ---
type TabValue =
  | 'all' | 'created' | 'playing' | 'planned'
  | 'completed' | 'favorite' | 'abandoned'

const tabs = [
  { label: 'All',       value: 'all' },
  { label: 'Created',   value: 'created' },
  { label: 'Playing',   value: 'playing' },
  { label: 'Planned',   value: 'planned' },
  { label: 'Completed', value: 'completed' },
  { label: 'Favorite',  value: 'favorite' },
  { label: 'Abandoned', value: 'abandoned' },
] as const

const auth      = useAuthStore()
const activeTab = ref<TabValue>('all')
const search    = ref('')
const novels    = ref<Novel[]>([])

// --- genre filter state ---
const showFilter      = ref(false)
const allGenres       = ref<string[]>([])
const genreSearch     = ref('')
const selectedGenres  = ref<string[]>([])

// fetch your  /novels/genres endpoint once
onMounted(async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/novels/genres')
    allGenres.value = await res.json()
  } catch {
    allGenres.value = []
  }
})

// computed to filter the genre options by genreSearch
const filteredGenreOptions = computed(() => {
  if (!genreSearch.value.trim()) return allGenres.value
  const q = genreSearch.value.toLowerCase()
  return allGenres.value.filter(g => g.toLowerCase().includes(q))
})

// reset both search box and selected genres
function clearGenres() {
  genreSearch.value = ''
  selectedGenres.value = []
}

// apply: close modal and refetch/filter novels
function applyGenres() {
  showFilter.value = false
  // either call backend search:
  // fetchNovels(`/novels/search?q=${encodeURIComponent(selectedGenres.join(','))}`)
  // or just filter client-side by intersection:
  // e.g. only keep novels having at least one of selectedGenres:
  if (selectedGenres.value.length) {
    novels.value = novels.value.filter(n =>
      n.genres.some(g => selectedGenres.value.includes(g))
    )
  } else {
    fetchNovels()  // reset if none selected
  }
}


// --- existing code to get your novels list ---
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
  } catch {
    novels.value = []
  }
}

// reload on tab change
watch(activeTab, () => {
  search.value = ''
  fetchNovels()
}, { immediate: true })

function onSearchClick() {
  /* no-op, we filter locally */
}

const filteredNovels = computed(() => {
  let list = novels.value
  // filter by text
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    list = list.filter(n => n.title.toLowerCase().includes(q))
  }
  // if genres selected, filter further
  if (selectedGenres.value.length) {
    list = list.filter(n =>
      n.genres.some(g => selectedGenres.value.includes(g))
    )
  }
  return list
})
</script>
