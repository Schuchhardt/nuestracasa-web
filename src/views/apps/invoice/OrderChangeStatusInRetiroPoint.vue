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
  let description = 'Chofer confirmó que llego al punto de retiro'
  if (checkboxTwo.value){
    description = description + ' y adjunto la documentación de retiro'
  }
  if(checkboxThree.value){
    description = description + ', reviso la carga y está todo en orden.'
  }
  emit('submit',{
    step: 2,
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
const checkboxTwo = ref(false)
const checkboxThree = ref(false)
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
                  label="Confirmo llegada al punto de retiro"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="checkboxTwo"
                  label="Adjunte la documentación necesaria para hacer el retiro (guias de despacho, factura, etc)"
                />
              </VCol>
              <VCol cols="12">
                <VCheckbox
                  v-model="checkboxThree"
                  label="Revise la carga y esta todo en orden"
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
                  {{ isUploadingFiles ? 'Cargando...' : 'Siguiente etapa: Carga en ruta' }}
                </VBtn>

              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
