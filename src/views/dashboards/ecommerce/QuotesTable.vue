<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Options } from '@core/types'
import { avatarText } from '@core/utils/formatters'
import moment from 'moment'

const selectedRows = ref<string[]>([])

interface Props {
  services: any[]
}

const props = withDefaults(defineProps<Props>(), {})

const options = ref<Options>({
  page: 1,
  itemsPerPage: 8,
  sortBy: [],
  groupBy: [],
  search: undefined,
})

const isLoading = ref(false)

// 👉 headers
const headers = [
  { title: '#ID COTIZACIÓN', key: 'code_id' },
  // { title: 'TRENDING', key: 'trending', sortable: false },
  { title: 'ESTADO', key: 'status', sortable: false },
  // { title: 'CLIENTE', key: 'client' },
  { title: 'FECHA', key: 'init_time' },
    { title: 'CARGA', key: 'package_type' },
  { title: 'ORIGEN/DESTINO', key: 'origin' },
]

// 👉 Invoice status variant resolver
const resolveInvoiceStatusVariantAndIcon = (status: string) => {
  if (status === 'Inicio')
    return { variant: 'warning', icon: 'mdi-chart-timeline-variant' }
  if (status === 'En camino a Retiro')
    return { variant: 'success', icon: 'mdi-check' }
  if (status === 'Carga en Ruta')
    return { variant: 'info', icon: 'mdi-arrow-down' }
  if (status === 'Carga en Bodega/Pernocte')
    return { variant: 'secondary', icon: 'mdi-content-save-outline' }
  if (status === 'En camino a Entrega')
    return { variant: 'primary', icon: 'mdi-email-outline' }
  if (status === 'Entregado')
    return { variant: 'error', icon: 'mdi-alert-circle-outline' }

  return { variant: 'secondary', icon: 'mdi-close' }
}
</script>

<template>
  <section v-if="props.services">
    <!-- 👉 Invoice Filters  -->

    <VCard id="invoice-list">
      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="options.itemsPerPage"
        v-model:page="options.page"
        :loading="isLoading"
        :items-length="props.services.length"
        :headers="headers"
        :items="props.services"
        class="text-no-wrap text-sm"
        @update:options="options = $event"
        no-data-text="No hay cotizaciones"
      >

        <template #item.code_id="{ item }">
          <RouterLink :to="{ name: 'track-quote', query: { id: item.raw.code_id } }">
            #{{ item.raw.code_id }}
          </RouterLink>
        </template>

        <template #item.status="{ item }">
          <VChip
            :color="resolveInvoiceStatusVariantAndIcon(item.raw.status).variant"
            density="comfortable"
          >
            {{ item.raw.status }}
          </VChip>
        </template>

        <!-- client -->
        <!-- <template #item.client="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="34"
              :color="!item.raw.avatar?.length ? resolveInvoiceStatusVariantAndIcon('Sent').variant : undefined"
              :variant="!item.raw.avatar?.length ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg
                v-if="item.raw.avatar?.length"
                :src="item.raw.avatar"
              />
              <span v-else>{{ avatarText(item.raw.Customer.name) }}</span>
            </VAvatar>
            <div class="d-flex flex-column">
              <h6 class="text-sm font-weight-medium mb-0">
                {{ item.raw.Customer.name }}
              </h6>
              <span class="text-caption">{{ item.raw.Customer.dni }}</span>
            </div>
          </div>
        </template> -->

        <!-- init_time -->
        <template #item.init_time="{ item }">
          {{ moment(item.raw.init_time).locale('es-cl').format('DD/MMM') }} {{ item.raw.init_time_range }}
        </template>

        <!-- weight -->
        <template #item.package_type="{ item }">
          <VChip
            :color="'success'"
            density="comfortable"
          >
          {{ item.raw.quantity }} {{ item.raw.package_type }}
          </VChip>
        </template>

        <template #item.origin="{ item }">
          {{ item.raw.origin }} - {{ item.raw.destination }}
        </template>

        <!-- Pagination -->
        <template #bottom />
      </VDataTableServer>
      <!-- !SECTION -->
      <VDivider />
    </VCard>
  </section>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }

  .invoice-list-search {
    inline-size: 12rem;
  }
}
</style>
