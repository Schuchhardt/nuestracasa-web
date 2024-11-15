<script setup lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'

interface SubmitData {
  emailFrom: string
  emailTo: string
  invoiceSubject: string
  paymentMessage: string
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

const emailFrom = ref('shelbyComapny@email.com')
const emailTo = ref('qConsolidated@email.com')
const invoiceSubject = ref('')
const toggleCheckboxProblems = ref(false)
const paymentMessage = ref(``)

const onSubmit = () => {
  emit('update:isDrawerOpen', false)
  emit('submit', {
    emailFrom: emailFrom.value,
    emailTo: emailTo.value,
    invoiceSubject: invoiceSubject.value,
    paymentMessage: paymentMessage.value,
  })
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
                  label="Tengo claro el servicio a realizar"
                />
              </VCol>
              <VCol cols="12">
                <VSwitch
                  v-model="toggleCheckboxProblems"
                  inset
                  label="Reportar problemas?"
                />
              </VCol> 

              <VCol cols="12" v-if="toggleCheckboxProblems">
                <VTextField
                  v-model="invoiceSubject"
                  label="Motivo"
                />
              </VCol>

              <VCol cols="12" v-if="toggleCheckboxProblems">
                <VTextarea
                  v-model="paymentMessage"
                  rows="10"
                  label="Detalle del problema"
                />
              </VCol>

              <VCol cols="12" v-if="toggleCheckboxProblems">
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
                  Siguiente etapa: Llegada
                </VBtn>

                <!-- <VBtn
                  color="secondary"
                  variant="tonal"
                  @click="$emit('update:isDrawerOpen', false)"
                >
                  Cancelar
                </VBtn> -->
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </PerfectScrollbar>
  </VNavigationDrawer>
</template>
