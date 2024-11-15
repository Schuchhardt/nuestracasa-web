<script setup lang="ts">
import moment from 'moment'
import 'moment/locale/es'
// Components
import ActivityTimeline from '@/views/pages/user-profile/profile/ActivityTimeline.vue'
import QuoteConfirmationModal from '@/views/apps/invoice/QuoteConfirmation.vue'
// Store
import { useInvoiceStore } from '@/views/apps/invoice/useInvoiceStore'
import { useRoute } from 'vue-router'
// @ts-ignore
import { createToaster } from "@meforma/vue-toaster";

const currentStep = ref(0)
const progressValue = ref(0)

const invoiceListStore = useInvoiceStore()
const { id: userId } = JSON.parse(localStorage.getItem('userData') || '{}') 
const route = useRoute()
const router = useRouter()
const toaster = createToaster({
  position: "top",
  duration: 8000
})
const serviceData = ref()
const IsConfirmationVisible = ref(false)

let purchasedProducts = ref()

const orderStatus = {
    'Creada por cliente': 0,
    'Pendiente confirmación': 1,
    'Aceptada por cliente': 2,
    'Rechazada': 3,
}

const progressStatus = {
    'Creada por cliente': 0,
    'Pendiente confirmación': 50,
    'Aceptada por cliente': 100,
    'Rechazada': 100,
}


invoiceListStore.fetchQuote(route.query.id as string).then(response => {
    console.log(response.data)
    serviceData.value = response.data.quote
    purchasedProducts.value = [
        {
            name: serviceData.value.package_type,
            quantity: serviceData.value.quantity,
            weight: serviceData.value.weight + '(kg)',
            volume: serviceData.value.volume + '(m3)',
        }
    ]
    currentStep.value = orderStatus[serviceData.value.status as keyof typeof orderStatus]
    progressValue.value = progressStatus[serviceData.value.status as keyof typeof orderStatus]
    //// loadServiceActivity(response.data.order.id)
}).catch(error => {
  console.log(error)
})

// 👉 Invoice Description
// ℹ️ Your real data will contain this information

const checkoutSteps= [
  {
    title: 'Creada por cliente',
    icon: 'mdi-file-document-arrow-right-outline',
  },
  {
    title: 'Pendiente de confirmación',
    icon: 'mdi-truck-outline',
  },
  {
    title: 'Aceptada por cliente',
    icon: 'mdi-truck-check-outline',
  },
]

const showConfirmDrawer = () => {
    IsConfirmationVisible.value = true
}

const submitConfirmation = async (payload: any) =>{
    const submitPayload = {
        quote_id: serviceData.value.id,
        accept: payload.accept,
        cancelReason: payload.cancelReason
    }
    console.log(submitPayload)
    await invoiceListStore.confirmQuote(submitPayload).then(response => {
        console.log(response.data)
        toaster.success("Cotizacion aceptada correctamente!", {
          // optional options Object
          onClose: ()=> {
             IsConfirmationVisible.value = false
             router.replace('/track-order?id=' + route.query.id)
          }
        });
        
    }).catch(error => {
        console.log(error)
        toaster.error("No se pudo aceptar la cotización");
    })
}

const getIconFromOrderType = (orderType: string) => {
    if (orderType == 'AE'){
        return 'mdi-airplane'
    }
    if (orderType == 'PU'){
        return 'mdi-ferry'
    }
    if (orderType == 'FS' || orderType == 'FR'){
        return 'mdi-truck-check-outline'
    }
    if (orderType == 'DS'){
        return 'mdi-truck-delivery-outline'
    }
}

const formatRut = (rut: string) => {
    const cleanRUT = rut.replace(/[^0-9kK]+/g, '');
    if (cleanRUT.length <= 1) return cleanRUT;

    let result = cleanRUT.slice(-4, -1) + '-' + cleanRUT.substr(cleanRUT.length - 1);
    for (let i = 4; i < cleanRUT.length; i += 3) {
        result = cleanRUT.slice(-3 - i, -i) + '.' + result;
    }
    return result;
}

function thousandSeparator(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

const { text: textCopied, copy } = useClipboard()

</script>

<template>
  <section v-if="serviceData">
    <VRow>
      <VCol
      >
      <!-- SECTION Title with quote id -->
      <h2 class="p-1 mb-2">Cotización #{{ serviceData.code_id }}</h2>

        <VCard>
          <!-- SECTION Header -->
          <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-primary">
            <!-- 👉 Left Content -->
            <!-- <div class="mb-1"> -->

            <VRow>
              <VCol>
              <div class="d-flex align-center mb-1">
              
                <!-- 👉 Title -->
                <h3 class="text-h4 text-uppercase font-bolder">
                    {{serviceData.Customer.name}}
                </h3>
              </div>
            </VCol>
            <VCol>
            <VChip class="mb-2" color="dark" style="width: 40vw;">
                <VIcon
                    start
                    size="18"
                    :icon="getIconFromOrderType(serviceData.order_type)"
                />
                {{serviceData.order_type_description}} - {{ serviceData.order_category }}
            </VChip>
          </VCol>
            </VRow>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
              <!-- 👉 Address -->
              <p class="mb-2">
                <strong>Origen:</strong><a class="mlink" :href="'https://www.google.com/maps/search/' + encodeURI(serviceData.origin)" target="_blank">{{serviceData.origin}}</a> 
              </p>
              <p class="mb-0">
                <strong>Destino:</strong><a class="mlink" :href="'https://www.google.com/maps/search/' + encodeURI(serviceData.destination)" target="_blank">{{serviceData.destination}}</a> 
              </p>
              <p class="mb-0" v-if="serviceData.contact_origin">
                <strong>Contacto Origen:</strong> {{ serviceData.contact_origin }}
                <IconBtn
                  class="app-card-code-copy-icon"
                  color="white"
                  @click="() => { copy(serviceData.contact_origin) }"
                >
                  <VIcon
                    :icon="textCopied == serviceData.contact_origin ? 'mdi-check' : 'mdi-content-copy'"
                    size="20"
                  />
                </IconBtn>
              </p>
              <p class="mb-0" v-if="serviceData.contact_destination">
                <strong>Contacto Destino:</strong> {{ serviceData.contact_destination ? serviceData.contact_destination : '-' }}
                <IconBtn v-if="serviceData.contact_destination"
                  class="app-card-code-copy-icon"
                  color="white"
                  @click="() => { copy(serviceData.contact_destination) }"
                >
                  <VIcon
                    :icon="textCopied == serviceData.contact_destination ? 'mdi-check' : 'mdi-content-copy'"
                    size="20"
                  />
                </IconBtn>
              </p>
              </VCol>
              <VCol
                cols="12"
                md="6"
                v-if="serviceData.Driver || serviceData.Truck"
              >
                <p class="mb-0" v-if="serviceData.Driver">
                  <strong>Conductor: </strong>  {{serviceData.Driver.name}} {{serviceData.Driver.lastname}}
                  <IconBtn v-if="serviceData.Driver"
                  class="app-card-code-copy-icon"
                  color="white"
                  @click="() => { copy(serviceData.Driver.name + ' ' + serviceData.Driver.lastname) }"
                  >
                    <VIcon
                      :icon="textCopied == serviceData.Driver.name + ' ' + serviceData.Driver.lastname ? 'mdi-check' : 'mdi-content-copy'"
                      size="20"
                    />
                  </IconBtn>
                </p>
                <p class="mb-0" v-if="serviceData.Driver">
                    <strong >RUT: </strong> {{formatRut(serviceData.Driver.dni)}}
                    <IconBtn v-if="serviceData.Driver"
                    class="app-card-code-copy-icon"
                    color="white"
                    @click="() => { copy(formatRut(serviceData.Driver.dni)) }"
                    >
                      <VIcon
                        :icon="textCopied == formatRut(serviceData.Driver.dni) ? 'mdi-check' : 'mdi-content-copy'"
                        size="20"
                      />
                    </IconBtn>
                </p>
                <p class="mb-0" v-if="serviceData.Driver?.phone">
                    <strong>Fono: </strong> {{serviceData.Driver.phone}}
                    <IconBtn v-if="serviceData.Driver"
                      class="app-card-code-copy-icon"
                      color="white"
                      @click="() => { copy(serviceData.Driver.phone) }"
                      >
                        <VIcon
                          :icon="textCopied == serviceData.Driver.phone ? 'mdi-check' : 'mdi-content-copy'"
                          size="20"
                        />
                      </IconBtn>
                </p>
                <p class="mb-0" v-if="serviceData.Truck">
                    <strong>Patente: </strong>  {{serviceData.Truck.license}}
                    <IconBtn v-if="serviceData.Truck"
                      class="app-card-code-copy-icon"
                      color="white"
                      @click="() => { copy(serviceData.Truck.license) }"
                      >
                        <VIcon
                          :icon="textCopied == serviceData.Truck.license ? 'mdi-check' : 'mdi-content-copy'"
                          size="20"
                        />
                      </IconBtn>
                </p>
              </VCol>

            </VRow>

            <!-- </div> -->

            <!-- 👉 Right Content -->
            <div class="mb-1">
              <!-- 👉 Invoice ID -->
              
              
              <!-- 👉 Issue Date -->
                <p class="mb-2">
                  <strong>Fecha de inicio: </strong>
                  <span>{{ moment(serviceData.init_time).locale("es").format("DD/MM/YYYY") }}</span>
                </p>
                
                <h5 class="text-h6 mb-1 font-bolder" v-if="serviceData.reference">
                    Ref: {{serviceData.reference}}
                </h5>
                
                <!-- 👉 Due Date -->
                <p class="mb-2" v-if="serviceData.end_time">
                    <strong>Fecha de termino: </strong>
                    <span>{{ moment( serviceData.end_time).locale("es").format("DD/MM/YYYY") }}</span>
                </p>
                <!-- <h5 class="text-h6 mb-0 font-bolder" style="color:#154882">
                  {{serviceData.code_id}}
                </h5> -->

            </div>
          </VCardText>
        </VCard>
        <VCard>
          <VCardText>
              <!-- 👉 Stepper -->
              <AppStepper
              v-model:current-step="currentStep"
              class="checkout-stepper"
              :icon-size="$vuetify.display.smAndUp ? 50 : 35"
              :items="checkoutSteps"
              :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
              />
              <!-- <div class="progress-line-order">
                  <VProgressLinear
                      color="#154882"
                      :model-value="progressValue"
                      rounded
                      height="20"
                      />
              </div> -->
          </VCardText>

          <VDivider />

        </VCard>
        <VCard>

          <!-- 👉 Table -->
          <VDivider />

          <VTable class="text-sm text-high-emphasis">
            <thead>
              <tr>
                <th scope="col">
                  CARGA
                </th>
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
                    PESO
                </th>
                <th
                  scope="col"
                  class="text-center"
                >
                  VOLUMEN
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
                <td class="text-center">
                  {{ item.quantity }}
                </td>
                <td class="text-center">
                    {{ item.weight }}
                </td>
                <td class="text-center">
                   {{ item.volume }}
                </td>
              </tr>
            </tbody>
          </VTable>

          <VDivider class="mb-2" />

          <VCardText>
            <div class="d-flex">
              <h6 class="text-sm font-weight-medium me-1" v-if="serviceData.description">
                Nota:
              </h6>
              <span>{{ serviceData.description }}</span>
            </div>

            <div class="d-flex">

                <h5 class="text-h5 mb-1 mt-2 font-bolder" v-if="serviceData.price" style="color: black;">
                    Precio total: ${{thousandSeparator(serviceData.price)}}
                </h5>

            </div>

            <!-- <div class="d-flex flex-wrap justify-end d-print-none gap-5 mt-10">
              <VBtn color="success">
                Descargar PDF
              </VBtn>
            </div> -->
          </VCardText>
        </VCard>
        <!-- <TimelineWithIcons /> -->
        <!-- <ActivityTimeline :items="servicesActivity" /> -->
      </VCol>
    </VRow>
    <!-- new section with a button to approve the quote-->
    <VRow v-if="serviceData.price && serviceData.status == 'Pendiente confirmación' ">
      <VCol
      >
          <VBtn class="text-center" color="info" @click="() => { showConfirmDrawer() }" style="display: block;margin: auto;">
            Aprobar o rechazar cotización
          </VBtn>
      </VCol>
    </VRow>

    <!-- 👉 confirmation drawer -->
    <QuoteConfirmationModal v-model:isDrawerOpen="IsConfirmationVisible" @submit="submitConfirmation" />

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

.font-bolder{
    font-weight: bolder;
    color: white;
}
.v-table {
  --v-table-header-height: 48px !important;
}

.v-table--density-default > .v-table__wrapper > table > tbody > tr > td {
  block-size: 48px !important;
}

.progress-line-order{
    margin: 0px auto;
    width: 65%;
    margin-top: 20px;
}

.btn-containers{
    .v-btn{
        height: 50px;
    }
}

.mlink{
    margin: 5px 5px;
    color: white !important;
    text-decoration: underline;
}

</style>
