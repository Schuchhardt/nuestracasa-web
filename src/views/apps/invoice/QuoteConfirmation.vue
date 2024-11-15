<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

interface SubmitData {
  accept: boolean
  cancelReason: string
}
interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'submit', value: SubmitData): void
}

interface Props {
  isDrawerOpen: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const accept = ref(true)
const cancelReason = ref(``)

const onSubmit = () => {
  emit('submit',{
    accept: accept.value,
    cancelReason: cancelReason.value,
  })
}

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
</script>

<template>
  <VNavigationDrawer
    temporary
    location="end"
    :width="400"
    :model-value="props.isDrawerOpen"
    class="scrollable-content"
    @update:model-value="handleDrawerModelValueUpdate"
  >
    <!-- 👉 Header -->
    <AppDrawerHeaderSection
      title="Confirmar cotización"
      @cancel="$emit('update:isDrawerOpen', false)"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <VCheckbox
                  v-model="accept"
                  label="Apruebo cotización por el monto indicado"
                />
              </VCol>

              <VCol cols="12" v-if="accept == false">
                <VTextarea
                  v-model="cancelReason"
                  rows="10"
                  label="Motivo por el cual rechaza la cotización"
                />
              </VCol>
              
              <VCol cols="12" >
                <VBtn
                  type="submit"
                  class="me-3"
                >
                  Confirmar
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
