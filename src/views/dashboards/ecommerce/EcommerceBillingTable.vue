<script setup lang="ts">
import { VDataTableServer } from 'vuetify/labs/VDataTable'
import type { Options } from '@core/types'
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
  { title: '#ID SERVICIO', key: 'code_id' },
  // { title: 'CLIENTE', key: 'client' },
  // { title: 'TRENDING', key: 'trending', sortable: false },
  { title: 'ESTADO', key: 'status', sortable: false },
  { title: 'FECHA', key: 'init_time' },
  // { title: 'CARGA', key: 'weight' },
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
        no-data-text="No hay servicios"
      >

        <template #item.code_id="{ item }">
          <RouterLink :to="{ name: 'track-order', query: { id: item.raw.code_id } }">
            {{item.raw.Customer.name}} - {{ item.raw.code_id }}
          </RouterLink>
          <p class="text-caption">
          {{ item.raw.EndCustomer.name }}
          </p>
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
        <template #item.client="{ item }">
          <div class="d-flex align-center">
         
            <div class="d-flex flex-column">
              <h6 class="text-sm font-weight-medium mb-0">
                {{ item.raw.Customer.name }}
              </h6>
              <span class="text-caption">{{ item.raw.EndCustomer.name.length > 20 ? item.raw.EndCustomer.name.slice(0,16) + '...' : item.raw.EndCustomer.name  }}</span>
            </div>
          </div>
        </template>

        <!-- init_time -->
        <template #item.init_time="{ item }">
          {{ item.raw.init_time ? moment(item.raw.init_time).locale('es-cl').format('DD/MMM') : 'Fecha por definir' }} {{ item.raw.init_time_range ? item.raw.init_time_range : 'Hora por definir' }}
        </template>

        <!-- weight -->
        <template #item.weight="{ item }">
          <VChip
            :color="'success'"
            density="comfortable"
          >
            {{ item.raw.weight }}
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
