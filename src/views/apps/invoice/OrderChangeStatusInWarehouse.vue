<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

interface SubmitData {
  step: number,
  is_ok: boolean;
  problemSubject: string
  problemMessage: string
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

const problemSubject = ref('')
const toggleCheckboxProblems = ref(false)
const problemMessage = ref(``)

const onSubmit = () => {
  emit('update:isDrawerOpen', false)
  emit('submit',{
    step: 4,
    is_ok: !toggleCheckboxProblems.value,
    problemSubject: problemSubject.value,
    problemMessage: problemMessage.value,
  })
}

const handleDrawerModelValueUpdate = (val: boolean) => {
  emit('update:isDrawerOpen', val)
}

const checkboxOne = ref(false)
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
                  label="Confirmo unidad en Ruta"
                />
              </VCol>
             
              <VCol cols="12" v-if="toggleCheckboxProblems">
                <VSelect
                  v-model="problemSubject"
                  :items="issueItems"
                  label="Motivo"
                />
              </VCol>

              <VCol cols="12" v-if="toggleCheckboxProblems">
                <VTextarea
                  v-model="problemMessage"
                  rows="10"
                  label="Detalle del problema"
                />
              </VCol>

              <VCol cols="12">
                <div class="mb-6" >
                  <VChip
                    label
                    color="primary"
                    size="small"
                  >
                    <VIcon
                      start
                      icon="mdi-link"
                    />
                    Adjuntar archivos
                  </VChip>
                </div>
              </VCol>
              
              <VCol cols="12" >
                <VBtn :disabled="!checkboxOne"
                  type="submit"
                  class="me-3"
                >
                  Siguiente etapa
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
