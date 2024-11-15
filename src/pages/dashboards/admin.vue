<script setup lang="ts">

//set layout as none

const currentToken = localStorage.getItem('accessToken')

</script>

<template>
  <VRow class="match-height">
    <iframe :src="'https://chlg.retool.com/embedded/public/82a2c008-5bda-4aba-91ea-31f025a30322?access_token=' + currentToken" frameborder="0"></iframe>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
iframe{
  width: 100%;
  height: 100vh;
  border: none;
}
</style>
