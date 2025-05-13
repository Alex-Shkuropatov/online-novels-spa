<template>
  <Anchor
    class="card-link"
    :to="`/novels/${novel.novel_id}`"
   >
   <Card text-alignment="center">
    <CardImgTop
     :src="novel.cover_image_url"
    />
    <CardBody>
     <CardTitle :small="true">{{ novel.title }}</CardTitle>
    </CardBody>
   </Card>
 </Anchor>
</template>

<script setup>
defineProps({
  novel: Object,
});
</script>

<style lang="scss" scoped>
.card-link {
 text-decoration: none;
}
</style>