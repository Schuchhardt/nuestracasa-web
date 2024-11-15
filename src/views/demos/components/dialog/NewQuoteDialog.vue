<script lang="ts" setup>
const isDialogVisible = ref(false)
const { id } = JSON.parse(localStorage.getItem('userData') || '{}') 
</script>

<template>
  <VDialog
    v-model="isDialogVisible"
    max-width="800"
  >
    <!-- Dialog Activator -->
    <template #activator="{ props }">
      <VBtn v-bind="props">
        Nueva cotización
      </VBtn>
    </template>

    <iframe class="new-quote" :src="'https://chlg.retool.com/embedded/public/f17a076e-5844-4132-99de-55c115cfa7d5?customerId=' + id " frameborder="0"></iframe>
  </VDialog>
</template>

<style lang="scss">
iframe.new-quote{
    height: 700px;
    
    width: 70vw;
    margin: auto;
    display: block;
    border-radius: 20px;
}
</style>
