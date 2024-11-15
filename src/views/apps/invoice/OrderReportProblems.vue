<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import fileupload from '@/pages/components/fileupload.vue';

interface SubmitData {
  problemSubject: string
  problemDescription: string
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

const problemSubject = ref('')
const problemMessage = ref(``)

const onSubmit = () => {
  emit('submit',{
    problemSubject: problemSubject.value,
    problemDescription: problemMessage.value,
    fileUrls: filesURLs.value
  })
}

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}
const issueItems = [
  'Problemas relacionados al clima',
	'Problemas relacionados al cliente',
	'Problemas con la carga',
	'Imposible contactar al contacto',
  'Otro'
];
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
      title="Reportar problema"
      @cancel="$emit('update:isDrawerOpen', false)"
    />

    <PerfectScrollbar :options="{ wheelPropagation: false }">
      <VCard flat>
        <VCardText>
          <VForm @submit.prevent="onSubmit">
            <VRow>
              <VCol cols="12">
                <VSelect
                  v-model="problemSubject"
                  :items="issueItems"
                  label="Motivo"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="problemMessage"
                  rows="10"
                  label="Detalle del problema"
                />
              </VCol>

              <VCol cols="12">
                <div class="mb-6" >
                  <fileupload @isUploading="(loading) => isUploadingFiles = loading" @filesUploaded="(urls) => filesURLs = urls"/>
                </div>
              </VCol>
              
              <VCol cols="12" >
                <VBtn :disabled="!problemSubject || !problemMessage || isUploadingFiles"
                  type="submit"
                  class="me-3"
                >
                  {{ isUploadingFiles ? 'Cargando...' : 'Reportar problema'  }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
