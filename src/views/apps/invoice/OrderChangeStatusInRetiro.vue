<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import fileupload from '@/pages/components/fileupload.vue';

interface SubmitData {
  step: number,
  description: string
  fileUrls: string[]
}

interface Emit {
  (e: 'update:isDrawerOpen', value: boolean): void
  (e: 'submit', value: SubmitData): void
}

interface Props {
  isDrawerOpen: boolean
}
const filesURLs = ref<string[]>([])
const props = defineProps<Props>()
const isUploadingFiles = ref(false)
const emit = defineEmits<Emit>()

const onSubmit = () => {
  let description = 'Chofer confirmó que va al punto de retiro'
  
  emit('submit',{
    step: 1,
    description,
    fileUrls: filesURLs.value
  })
  setTimeout(() => {
    emit('update:isDrawerOpen', false)
  }, 1000);
}

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}

const checkboxOne = ref(false)
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
      title="Siguiente Etapa"
      @cancel="$emit('update:isDrawerOpen', false)"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <VCheckbox
                  v-model="checkboxOne"
                  label="Confirmo en camino al punto de retiro"
                />
              </VCol>
      

              <VCol cols="12">
                <div class="mb-6" >
                  <fileupload @isUploading="(loading) => isUploadingFiles = loading" @filesUploaded="(urls) => filesURLs = urls"/>
                </div>
              </VCol>
              
              <VCol cols="12" >
                <VBtn :disabled="!checkboxOne || isUploadingFiles"
                  type="submit"
                  class="me-3"
                >
                  {{ isUploadingFiles ? 'Cargando...' : 'Siguiente etapa: En punto de Retiro' }}
                </VBtn>

              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
