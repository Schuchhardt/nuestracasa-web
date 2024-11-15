<script setup lang="ts">
import EcommerceBillingTable from '@/views/dashboards/ecommerce/EcommerceBillingTable.vue'
import EcommerceCongratulations from '@/views/dashboards/ecommerce/EcommerceCongratulations.vue'
import EcommerceMeetingSchedule from '@/views/dashboards/ecommerce/EcommerceMeetingSchedule.vue'
import { useInvoiceStore } from '@/views/apps/invoice/useInvoiceStore'
import moment from 'moment'

const invoiceListStore = useInvoiceStore()
const services = ref<any[]>([])
const comingServices = ref<any[]>([])
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
const fetchServices = () => {
  isLoading.value = true
  invoiceListStore.fetchServices()
  .then(response => {
    // for each service in response.data.orders check is starting_date is greater than today then push to comingServices if not push to services

    // services.value = response.data.orders
    response.data.orders.forEach((service: any) => {
      if (moment(service.init_time).isAfter(moment())) {
        comingServices.value.push(service)
      } else {
        services.value.push(service)
      }
    })
  }).catch(error => {
    console.log(error)
  })

  isLoading.value = false
}

watchEffect(() => {
  fetchServices()
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

    <!-- <VCol
      v-if="userType !== 'customer'"
      v-for="statistics in statisticsVertical"
      :key="statistics.title"
      cols="12"
      sm="6"
      md="3"
      lg="2"
    >
      <CardStatisticsVertical v-bind="statistics" />
    </VCol> -->

    <VCol
      cols="12"
      md="12"
    >
      <EcommerceBillingTable :services="services" />
    </VCol>

    <VCol
      cols="12"
      md="12"
    >
      <EcommerceMeetingSchedule :services="comingServices" />
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
