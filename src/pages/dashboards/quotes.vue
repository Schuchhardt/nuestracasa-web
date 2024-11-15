<script setup lang="ts">
import QuotesTable from '@/views/dashboards/ecommerce/QuotesTable.vue'
import EcommerceCongratulations from '@/views/dashboards/ecommerce/EcommerceCongratulations.vue'
import { useInvoiceStore } from '@/views/apps/invoice/useInvoiceStore'

const invoiceListStore = useInvoiceStore()
const quotes = ref<any[]>([])
const isLoading = ref(false)
const { userType } = JSON.parse(localStorage.getItem('userData') || '{}') 
const statisticsVertical = [
  {
    title: 'Viajes',
    color: 'info',
    icon: 'mdi-trending-up',
    stats: '4.5H',
    change: 38,
    subtitle: 'Horas realizadas',
  },
  {
    title: 'Peso',
    color: 'warning',
    icon: 'mdi-weight',
    stats: '2.5ton',
    change: 12,
    subtitle: 'Kilos transportados',
  },
]

// 👉 Fetch Services
const fetchQuotes = () => {
  isLoading.value = true
  invoiceListStore.fetchQuotes()
  .then(response => {
    // for each service in response.data.orders check is starting_date is greater than today then push to comingServices if not push to services

    // services.value = response.data.orders
    response.data.quotes.forEach((service: any) => {
        quotes.value.push(service)
    })
  }).catch(error => {
    console.log(error)
  })

  isLoading.value = false
}

watchEffect(() => {
  fetchQuotes()
})
</script>

<template>
  <VRow class="match-height">
    <VCol
      cols="12"
      md="12"
      class="d-flex flex-column align-self-end"
    >
      <EcommerceCongratulations />
    </VCol>

    <VCol
      v-if="userType !== 'customer'"
      v-for="statistics in statisticsVertical"
      :key="statistics.title"
      cols="12"
      sm="6"
      md="3"
      lg="2"
    >
      <CardStatisticsVertical v-bind="statistics" />
    </VCol>

    <VCol
      cols="12"
      md="8"
    >
      <QuotesTable :services="quotes" />
    </VCol>

    <VCol
      cols="12"
      md="4"
    >
        
        <NewQuoteDialog />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
