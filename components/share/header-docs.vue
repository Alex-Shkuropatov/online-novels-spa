<template>
 <Navbar
  expand="lg"
  sticky="top"
  background-color="primary-subtle"
 >
  <Container
   type="xl"
   flex-wrap="wrap lg-nowrap"
  >
   <NavbarBrand
    to="/"
    padding="0"
    margin="0 e-2 s-md-3 s-xl-0"
   >
    <img
     src="~/assets/img/noveluna1.PNG"
     alt="use-bootstrap"
     height="30"
    >
   </NavbarBrand>
   <b-div class="bd-navbar-toggle">
    <NavbarToggler
     target="#sidebar"
     icon="bi:list"
     padding="2"
    />
   </b-div>
   <Offcanvas
    id="navbar"
    type="lg"
    placement="end"
    flex-grow="1"
   >
    <OffcanvasHeader padding="x-4 b-0">
     <OffcanvasTitle>
      Меню
     </OffcanvasTitle>
     <CloseButton dismiss="offcanvas" />
    </OffcanvasHeader>
    <OffcanvasBody padding="4 t-0 lg-0">
     <hr class="d-lg-none text-white-50">
     <NavbarNavList
      flex-direction="row"
      flex-wrap="wrap"
     >
      <NavItem col="6 lg-auto">
       <NavLink
        to="/"
        padding="x-0 x-lg-2"
        text-color="white"
       >
        Главная
       </NavLink>
      </NavItem>
     </NavbarNavList>
     <NavbarNavList
      flex-direction="row"
      flex-wrap="wrap"
     >
      <NavItem col="6 lg-auto">
       <NavLink
        to="https://usebootstrap.org/"
        target="_blank"
        padding="x-0 x-lg-2"
        text-color="white"
       >
        UseBootstrap
       </NavLink>
      </NavItem>
     </NavbarNavList>
     <hr class="d-lg-none text-white-50">
     <NavbarNavList
      flex-direction="row"
      flex-wrap="wrap"
      margin="s-md-auto"
     >
      <NavItem col="6 lg-auto">
       <NavLink
        pdding="y-2 x-0 x-lg-2"
        to="https://github.com/simplise/use-bootstrap"
        target="_blank"
        rel="noopener"
       >
        <Icon
         name="bi:github"
         class="navbar-nav-svg"
        />
       </NavLink>
      </NavItem>
      <li class="nav-item py-2 py-lg-1 col-12 col-lg-auto">
       <b-div
        display="none lg-flex"
        class="vr h-100 mx-lg-2 text-white"
       />
       <hr class="d-lg-none my-2 text-white-50">
      </li>
      <LocaleNavItemDropdown :locales="['En', 'Ja']" />
      <ColorModeNavItemDropdown class="text-light" />
     </NavbarNavList>
    </OffcanvasBody>
   </Offcanvas>
  </Container>
 </Navbar>
</template>

<script setup lang="ts">
</script>
