<script setup lang="ts">

</script>

<template>
  <div class="home-page-header">
    <h4 class="home-page-header__title">
      Team Balancer
    </h4>
    <h6 class="home-page-header__subtitle"><i>Created by Nick Doxa</i></h6>
  </div>
</template>

<style scoped lang="scss">
.home-page-header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
  margin: 1rem;
  gap: 2rem;
  align-items: center;
  &__title {
    font-family: TeamBalancerHeader, sans-serif;
    font-size: 2rem;
    font-weight: 700;
    color: white;
  }
  &__subtitle {
    font-family: TeamBalancerHeader, sans-serif;
    font-size: 1.5rem;
    font-weight: 400;
    color: #a4a4a4;
  }
}
</style>
