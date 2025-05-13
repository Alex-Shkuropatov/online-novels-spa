<template>
 <PageLayout type="three-columns">
  <template #header>
   <ShareHeaderDocs />
  </template>
  <template #start>
    <Sidebar
        id="sidebar"
        active-background-color="teal-700"
        :data="computedSidebarRoutes"
    />
  </template>
  <template #end>
   <Toc
    selector="#content"
    display="none lg-block print-none"
    color="teal-700"
   >
    <Localization>
     <template #en>
      On this page
     </template>
     <template #ja>
      項目
     </template>
    </Localization>
   </Toc>
  </template>
  <template #default>
   <b-div
    id="content"
   >
    <slot />
   </b-div>
  </template>
<!--  <template #footer>-->
<!--   <ShareFooter />-->
<!--  </template>-->
 </PageLayout>
</template>

<script lang="ts" setup>
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();

const defaultSidebarRoutes = [
  {
    "name": "Online Novels",
    "icon": "bi:book-half",
    "color": "indigo",
    "children": [
      {
        "name": "Главная",
        "path": "/"
      },
    ],
  },
];

const loggedInSidebarRoutes = [
  {
    "name": "Профиль",
    "icon": "bi:person-circle",
    "color": "indigo",
    "children": [
      {
        "name": "Мои новелы",
        "path": "/"
      },
      {
        "name": "Выйти",
        "path": "/logout"
      },
    ],
  },
];

const anonymousSidebarRoutes = [
  {
    "name": "Авторизация",
    "icon": "bi:person-circle",
    "color": "indigo",
    "children": [
      {
        "name": "Вход",
        "path": "/sign-in"
      },
      {
        "name": "Регистрация",
        "path": "/sign-up"
      },
    ],
  },
];


const isLoggedIn = computed(() => auth.isAuthenticated);

const computedSidebarRoutes = computed(() => {
  if(isLoggedIn.value) {
    return [...defaultSidebarRoutes, ...loggedInSidebarRoutes];
  } else {
    return [...defaultSidebarRoutes, ...anonymousSidebarRoutes];
  }
});


</script>
