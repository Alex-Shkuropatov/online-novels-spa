<script setup lang="ts">
// Опционально, если нужно другой layout
// definePageMeta({ layout: 'default' })

import { ref, computed, onMounted } from 'vue'
import { useAuthStore }            from '@/store/auth'
import { useRuntimeConfig }        from '#app'
import MyList                      from '@/components/novels/MyList.vue'

const auth   = useAuthStore()
const config = useRuntimeConfig()

// Собираем полный URL аватарки (если у вас в auth.user.avatar лежит относительная ссылка)
const avatarUrl = computed(() => {
  const a = auth.user?.avatar
  if (!a) return ''
  // если уже абсолютный URL — возвращаем как есть
  if (a.startsWith('http')) return a
  // иначе — склеиваем с базой
  return `${config.public.apiBase}${a}`
})

const loading = ref(true)
onMounted(async () => {
  // подтягиваем профиль c /auth/me
  await auth.fetchProfile()
  loading.value = false
})
</script>

<template>
  <Container class="py-4">

    <!-- Шапка профиля -->
    <div v-if="!loading">
      <div v-if="auth.user" class="d-flex flex-column align-items-center mb-4">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="Avatar"
          class="rounded-circle mb-2"
          style="width: 80px; height: 80px;"
        />
        <h4 class="mb-2">{{ auth.user.username }}</h4>
        <Button
          class="btn btn-outline-secondary"
          size="sm"
          variant="outline-secondary"
          @click="$router.push('/settings')"
        >
          Profile settings
        </Button>
      </div>
      <div v-else class="text-center py-5">
        Could not upload profile
      </div>
    </div>
    <div v-else class="text-center py-5">
      Loading profile…
    </div>

    <!-- существующий компонент со списком новел -->
    <MyList v-if="!loading && auth.user" />
  </Container>
</template>
