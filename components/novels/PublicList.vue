<template>
 <Row>
  <Col
   v-for="novel in novels"
   :key="novel.novel_id"
   col="4"
  >
   <NovelsPublicListCard
    class="my-4"
    :novel="novel"
   />
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
});
</script>
