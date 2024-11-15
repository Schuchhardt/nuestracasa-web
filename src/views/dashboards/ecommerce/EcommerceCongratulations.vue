<script setup lang="ts">
import illustrationJohn2 from '@images/cards/illustration-john-2.png'
import illustrationJohn from '@images/cards/illustration-john.png'
const { name, userType } = JSON.parse(localStorage.getItem('userData') || '{}') 
</script>

<template>
  <VCard class="pa-2 overflow-visible">
    <VRow no-gutters>
      <VCol
        cols="12"
        sm="10"
        md="6"
        order="2"
        order-sm="1"
      >
        <VCardItem>
          <VCardTitle class="text-md-h5">
            <span class="me-1">Bienvenido</span><strong class="me-1">{{name}}!</strong><span>🚚</span>
          </VCardTitle>
        </VCardItem>

        <VCardText class="mt-3">
          ¡Que tengas una excelente semana 🤩!
        </VCardText>
      </VCol>

      <VCol
        cols="12"
        sm="2"
        md="6"
        order="1"
        order-sm="2"
        class="text-center"
      >
        <img
          :src="userType == 'customer' ? illustrationJohn : illustrationJohn2"
          width="295"
          :class="$vuetify.display.xs ? 'position-relative' : 'position-absolute'"
          class="john-illustration flip-in-rtl"
        >
      </VCol>
    </VRow>
  </VCard>
</template>
<style lang="scss" scoped>
@use "@layouts/styles/mixins" as layoutsMixins;

.john-illustration {
  inset-block-end: -0.0625rem;
  inset-inline-end: 0;
}

@media screen and (max-width: 440px) {
  .john-illustration {
    inline-size: 100%;
  }
}
</style>
