<script setup lang="ts">

//set layout as none

const currentToken = localStorage.getItem('accessToken')
const userData = localStorage.getItem('userData')
const { id } = JSON.parse(userData || '{}')

</script>

<template>
  <VRow class="match-height">
    <iframe :src="'https://chlg.retool.com/embedded/public/a0a18e0d-77a1-4417-97e1-f95188cb80f9?access_token=' + currentToken + '&customer_id=' + id" frameborder="0"></iframe>
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
