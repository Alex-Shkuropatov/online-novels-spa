<template>
  <Row>
    <Col col="4" v-for="novel in novels">
      
      <NovelsPublicListCard class="my-4" :novel="novel"></NovelsPublicListCard>
    </Col>
  </Row>
</template>

<script setup>

const novels = ref([]);

async function fetchNovels() {
  const novelsEndpoint = 'http://127.0.0.1:8000/novels/public';
  const response = await fetch(novelsEndpoint);

  const fetchedNovels = await response.json();
  novels.value = [...fetchedNovels];
}

onMounted(() => {
  fetchNovels();
})
</script>