<script setup lang="ts">

//set layout as none

const currentToken = localStorage.getItem('accessToken')

</script>

<template>
  <VRow class="match-height">
    <iframe :src="'https://chlg.retool.com/embedded/public/8d53c06f-ce62-4a08-9822-4f596d827c5e?access_token=' + currentToken" frameborder="0"></iframe>
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
