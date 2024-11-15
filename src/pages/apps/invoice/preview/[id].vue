<script setup lang="ts">
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import type { CheckoutData } from '@/views/wizard-examples/checkout/types'
// Components
import InvoiceAddPaymentDrawer from '@/views/apps/invoice/InvoiceAddPaymentDrawer.vue'
import InvoiceSendInvoiceDrawer from '@/views/apps/invoice/InvoiceSendInvoiceDrawer.vue'

// Store
import { useInvoiceStore } from '@/views/apps/invoice/useInvoiceStore'

const invoiceListStore = useInvoiceStore()

const route = useRoute()

const invoiceData = ref()
const paymentDetails = ref()
const isAddPaymentSidebarVisible = ref(false)
const isSendPaymentSidebarVisible = ref(false)

// 👉 fetchInvoice
invoiceListStore.fetchInvoice(Number(5036)).then(response => {
  invoiceData.value = response.data.invoice
  paymentDetails.value = response.data.paymentDetails
}).catch(error => {
  console.log(error)
})

// 👉 Invoice Description
// ℹ️ Your real data will contain this information
const purchasedProducts = [
  {
    name: 'Packaging',
    description: 'Pallets, boxes and other packaging materials',
    qty: 1,
    hours: 15,
    price: 32,
  },
]

const checkoutSteps= [
  {
    title: 'Ingreso',
    icon: 'mdi-file-document-arrow-right-outline',
  },
  {
    title: 'Llegada',
    icon: 'mdi-truck-outline',
  },
  {
    title: 'Transito',
    icon: 'mdi-truck-fast-outline',
  },
  {
    title: 'Entrega',
    icon: 'mdi-truck-check-outline',
  },
]

const checkoutData = ref<CheckoutData>({
  cartItems: [
  ],
  promoCode: '',
  orderAmount: 1198,
  deliveryAddress: 'home',
  deliverySpeed: 'free',
  deliveryCharges: 0,
  addresses: [
    {
      title: 'John Doe (Default)',
      desc: '4135 Parkway Street, Los Angeles, CA, 90017',
      subtitle: '1234567890',
      value: 'home',
    },
    {
      title: 'ACME Inc.',
      desc: '87 Hoffman Avenue, New York, NY, 10016',
      subtitle: '1234567890',
      value: 'office',
    },
  ],
})

const currentStep = ref(0)

// 👉 Print Invoice
const printInvoice = () => {
  window.print()
}
</script>

<template>
  <section v-if="invoiceData">
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard>
          <VCardText>
            <!-- 👉 Stepper -->
            <AppStepper
              v-model:current-step="currentStep"
              class="checkout-stepper"
              icon-size="60"
              :items="checkoutSteps"
              :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
            />
          </VCardText>

          <VDivider />

          <VCardText>
            <!-- 👉 stepper content -->
            <VWindow
              v-model="currentStep"
              class="disable-tab-transition"
              :touch="false"
            >
              <VWindowItem>
                <CartContent
                  v-model:current-step="currentStep"
                  v-model:checkout-data="checkoutData"
                />
              </VWindowItem>

              <VWindowItem>
                <AddressContent
                  v-model:current-step="currentStep"
                  v-model:checkout-data="checkoutData"
                />
              </VWindowItem>

              <VWindowItem>
                <PaymentContent
                  v-model:current-step="currentStep"
                  v-model:checkout-data="checkoutData"
                />
              </VWindowItem>

              <VWindowItem>
                <ConfirmationContent v-model:checkout-data="checkoutData" />
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
        <VCard>
          <!-- SECTION Header -->
          <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row">
            <!-- 👉 Left Content -->
            <div class="mb-5">
              <div class="d-flex align-center mb-6">
                <!-- 👉 Logo -->
                <!-- <VNodeRenderer
                  :nodes="themeConfig.app.logo"
                  class="me-3"
                /> -->

                <!-- 👉 Title -->
                <h6 class="text-xl text-uppercase">
                  Cliente: Juan Perez
                </h6>
              </div>

              <!-- 👉 Address -->
              <p class="mb-0">
                Origen: Puerto Valparaiso
              </p>
              <p class="mb-0">
                Destino: Puerto Valparaiso
              </p>
              <p class="mb-0">
                Contacto Origen: Pedro Perez (+5697162534)
              </p>
              <p class="mb-0">
                Contacto Destino: Jose Rojas (+5696821734)
              </p>
            </div>

            <!-- 👉 Right Content -->
            <div class="mb-4">
              <!-- 👉 Invoice ID -->
              <h6 class="text-h5 mb-4">
                Servicio AE-83QMC1
              </h6>

              <!-- 👉 Issue Date -->
              <p class="mb-2">
                <span>Fecha de inicio: </span>
                <span>{{ invoiceData.issuedDate }}</span>
              </p>

              <!-- 👉 Due Date -->
              <p class="mb-2">
                <span>Fecha de termino: </span>
                <span>{{ invoiceData.dueDate }}</span>
              </p>
            </div>
          </VCardText>
          <!-- !SECTION -->

          <VDivider />

          <!-- 👉 Payment Details -->
          <!-- <VCardText class="d-flex justify-space-between flex-wrap flex-column flex-sm-row print-row">
            <div class="my-5">
              <h6 class="text-sm font-weight-medium mb-3">
                Invoice To:
              </h6>
              <p class="mb-1">
                {{ invoiceData.client.name }}
              </p>
              <p class="mb-1">
                {{ invoiceData.client.company }}
              </p>
              <p class="mb-1">
                {{ invoiceData.client.address }}, {{ invoiceData.client.country }}
              </p>
              <p class="mb-1">
                {{ invoiceData.client.contact }}
              </p>
              <p class="mb-0">
                {{ invoiceData.client.companyEmail }}
              </p>
            </div>

            <div class="my-5">
              <h6 class="text-sm font-weight-medium mb-3">
                Bill To:
              </h6>
              <table>
                <tr>
                  <td class="pe-6">
                    Total Due:
                  </td>
                  <td>
                    {{ paymentDetails.totalDue }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    Bank Name:
                  </td>
                  <td>
                    {{ paymentDetails.bankName }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    Country:
                  </td>
                  <td>
                    {{ paymentDetails.country }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    IBAN:
                  </td>
                  <td>
                    {{ paymentDetails.iban }}
                  </td>
                </tr>
                <tr>
                  <td class="pe-6">
                    SWIFT Code:
                  </td>
                  <td>
                    {{ paymentDetails.swiftCode }}
                  </td>
                </tr>
              </table>
            </div>
          </VCardText> -->

          <!-- 👉 Table -->
          <VDivider />

          <VTable class="text-sm text-high-emphasis">
            <thead>
              <tr>
                <th scope="col">
                  ITEM
                </th>
                <th scope="col">
                  DESCRIPCION
                </th>
                <!-- <th
                  scope="col"
                  class="text-center"
                >
                  HOURS
                </th> -->
                <th
                  scope="col"
                  class="text-center"
                >
                  CANTIDAD
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  TOTAL
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="item in purchasedProducts"
                :key="item.name"
              >
                <td class="text-no-wrap">
                  {{ item.name }}
                </td>
                <td class="text-no-wrap">
                  {{ item.description }}
                </td>
                <!-- <td class="text-center">
                  {{ item.hours }}
                </td> -->
                <td class="text-center">
                  {{ item.qty }}
                </td>
                <td class="text-center">
                  ${{ item.price }}
                </td>
              </tr>
            </tbody>
          </VTable>

          <VDivider class="mb-2" />

          <!-- Total -->
          <VCardText class="d-flex justify-space-between flex-column flex-sm-row print-row">
            <div class="mb-2">
              <div class="d-flex align-center mb-1">
                <h6 class="text-sm font-weight-medium me-1">
                  Comercial encargad:
                </h6>
                <span>Ricardo Soto</span>
              </div>
            </div>

            <div class="mb-1">
              <table class="w-100">
                <tr>
                  <td class="pe-16">
                    Subtotal:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-sm font-weight-medium">
                      $1800
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16">
                    Discount:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-sm font-weight-medium">
                      $28
                    </h6>
                  </td>
                </tr>
                <tr>
                  <td class="pe-16">
                    Tax:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-sm font-weight-medium">
                      21%
                    </h6>
                  </td>
                </tr>
              </table>

              <VDivider class="mt-4 mb-3" />

              <table class="w-100">
                <tr>
                  <td class="pe-16">
                    Total:
                  </td>
                  <td :class="$vuetify.locale.isRtl ? 'text-start' : 'text-end'">
                    <h6 class="text-sm font-weight-medium">
                      $1690
                    </h6>
                  </td>
                </tr>
              </table>
            </div>
          </VCardText>

          <VDivider class="mt-2" />

          <VCardText>
            <div class="d-flex">
              <h6 class="text-sm font-weight-medium me-1">
                Note:
              </h6>
              <span>Camion abierto</span>
            </div>

            <div class="d-flex flex-wrap justify-end d-print-none gap-5 mt-10">
              <VBtn color="success">
                Descargar PDF
              </VBtn>
            </div>
          </VCardText>
        </VCard>
        <TimelineWithIcons />
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <VCard>
          <VCardText>
            <!-- 👉 Send Invoice Trigger button -->
            <VBtn
              block
              prepend-icon="mdi-send-outline"
              class="mb-4"
              @click="isSendPaymentSidebarVisible = true"
            >
              Siguiente etapa
            </VBtn>

            <!-- <VBtn
              block
              color="secondary"
              variant="outlined"
              class="mb-4"
              :to="{ name: 'apps-invoice-edit-id', params: { id: route.params.id } }"
            >
              Actualizar
            </VBtn> -->

            <VBtn
              block
              prepend-icon="mdi-archive-outline"
              color="warning"
              variant="outlined"
              @click="isAddPaymentSidebarVisible = true"
            >
              Mensaje con Administrador
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 Add Payment Sidebar -->
    <InvoiceAddPaymentDrawer v-model:isDrawerOpen="isAddPaymentSidebarVisible" />

    <!-- 👉 Send Invoice Sidebar -->
    <InvoiceSendInvoiceDrawer v-model:isDrawerOpen="isSendPaymentSidebarVisible" />
  </section>
</template>

<style lang="scss">
@media print {
  .v-application {
    background: none !important;
  }

  .product-buy-now {
    display: none;
  }

  .v-navigation-drawer,
  .layout-vertical-nav,
  .app-customizer-toggler,
  .layout-footer,
  .layout-navbar,
  .layout-navbar-and-nav-container {
    display: none;
  }

  .v-card {
    box-shadow: none !important;

    .print-row {
      flex-direction: row !important;
    }
  }

  .layout-content-wrapper {
    padding-inline-start: 0 !important;
  }
}
</style>

<style lang="scss" scoped>
.v-table {
  --v-table-header-height: 48px !important;
}

.v-table--density-default > .v-table__wrapper > table > tbody > tr > td {
  block-size: 48px !important;
}
</style>
