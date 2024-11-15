<script setup lang="ts">
import moment from 'moment'
import 'moment/locale/es'
// Components
import OrderChangeStatusInCreated from '@/views/apps/invoice/OrderChangeStatusInCreated.vue'
import OrderChangeStatusInRetiro from '@/views/apps/invoice/OrderChangeStatusInRetiro.vue'
import OrderChangeStatusInRetiroPoint from '@/views/apps/invoice/OrderChangeStatusInRetiroPoint.vue'
import OrderChangeStatusInRoute from '@/views/apps/invoice/OrderChangeStatusInRoute.vue'
import OrderChangeStatusInWarehouse from '@/views/apps/invoice/OrderChangeStatusInWarehouse.vue'
import OrderChangeStatusInEntrega from '@/views/apps/invoice/OrderChangeStatusInEntrega.vue'
import OrderChangeStatusInEntregaPoint from '@/views/apps/invoice/OrderChangeStatusInEntregaPoint.vue'
import OrderReportProblems from '@/views/apps/invoice/OrderReportProblems.vue'
import ActivityTimeline from '@/views/pages/user-profile/profile/ActivityTimeline.vue'
// Store
import { useInvoiceStore } from '@/views/apps/invoice/useInvoiceStore'
import { useRoute, useRouter } from 'vue-router'
// @ts-ignore
import { createToaster } from "@meforma/vue-toaster";

const router = useRouter()
const currentStep = ref(0)
const progressValue = ref(0)

const invoiceListStore = useInvoiceStore()
const { id: userId, userType } = JSON.parse(localStorage.getItem('userData') || '{}')
const route = useRoute()
const toaster = createToaster({
  position: "top",
  duration: 8000
})
const serviceData = ref()
const servicesActivity = ref()
const IsCreatedVisible = ref(false)
const IsRetiroVisible = ref(false)
const IsRetiroPointVisible = ref(false)
const IsRouteVisible = ref(false)
const IsWarehouseVisible = ref(false)
const IsEntregaVisible = ref(false)
const IsReportVisible = ref(false)
const IsEntregaPointVisible = ref(false)
const driverInfo = ref('')
const isOrderCancelled = ref(false)
const cancelReason = ref('')
const checkoutStepsWithError = ref() 

let purchasedProducts = ref()

const orderStatus = {
    'Inicio': 0,
    'En camino a Retiro': 1,
    'En punto de Retiro': 2,
    'Carga en Ruta': 3,
    'Carga en Bodega/Pernocte': 4,
    'En camino a Entrega': 5,
    'En punto de Entrega': 6,
    'Entregado': 7
}

const progressStatus = {
    'Inicio': 10,
    'En camino a Retiro': 25,
    'En punto de Retiro': 35,
    'Carga en Ruta': 50,
    'Carga en Bodega/Pernocte': 70,
    'En camino a Entrega': 80,
    'En punto de Entrega': 90,
    'Entregado': 100
}

const loadServiceActivity = (serviceId: number) => {
    invoiceListStore.fetchServiceActivity(serviceId).then(response => {
        console.log(response.data)
        servicesActivity.value = response.data.orderUpdates
        .filter( (o: {update_type: string}) => o.update_type !== 'error')
        .map( (ou: { status_to: any; created_at: any; file_url: any; status_from: string, description: string, is_ok: boolean }) => {
            return {
                title: ou.status_to,
                created_at: moment(ou.created_at).format("DD/MM HH:mm"),
                file_url: ou.file_url,
                description: ou.description ? ou.description : 'Etapa anterior: ' + ou.status_from,
                is_ok: ou.is_ok
            }
        })

        if(isOrderCancelled.value == true){
          console.log('order cancelled', response.data.orderUpdates)
          const lastStep = response.data.orderUpdates[0]
          currentStep.value = orderStatus[lastStep.status_from as keyof typeof orderStatus]
          cancelReason.value = lastStep.status_to
          checkoutStepsWithError.value = checkoutSteps.map((step, index) => {
            if (index == currentStep.value){
              return {
                ...step,
                subtitle: lastStep.status_to,
                icon: 'mdi-alert-circle-outline',
              }
            }
            return step
          })
        }

    }).catch(error => {
        console.log(error)
    })
}

invoiceListStore.fetchService(route.query.id as string).then(response => {
    console.log(response.data)
    serviceData.value = {...response.data.order, EndCustomer: response.data.end_customer}
    purchasedProducts.value = [
        {
            name: serviceData.value.package_type,
            quantity: serviceData.value.quantity,
            weight: serviceData.value.weight + '(kg)',
            volume: serviceData.value.volume + '(m3)',
        }
    ]
    // if order status is not in the orderStatus object, set it to 0
    if (!orderStatus[serviceData.value.status as keyof typeof orderStatus]){
      isOrderCancelled.value = true
    } else {
      currentStep.value = orderStatus[serviceData.value.status as keyof typeof orderStatus]
      progressValue.value = progressStatus[serviceData.value.status as keyof typeof orderStatus]
    }
    driverInfo.value = `Conductor: ${serviceData.value.Driver.name} ${serviceData.value.Driver?.lastname} \nRUT: ${formatRut(serviceData.value.Driver?.dni)} \nFono: ${serviceData.value.Driver?.phone} \nPatente: ${serviceData.value.Truck?.license}`
    loadServiceActivity(response.data.order.id)
}).catch(error => {
  console.log(error)
  //show error to user
  toaster.error("No se pudo cargar la información del servicio. Por favor revisa que la URL esté correcta.");
})

// 👉 Invoice Description
// ℹ️ Your real data will contain this information

const checkoutSteps= [
  {
    title: 'Inicio',
    icon: 'mdi-file-document-arrow-right-outline',
  },
  {
    title: 'En camino a Retiro',
    icon: 'mdi-truck-outline',
  },
  {
    title: 'En punto de Retiro',
    icon: 'mdi-truck-check',
  },
  {
    title: 'Carga en Ruta',
    icon: 'mdi-truck-fast-outline',
  },
  {
    title: 'Carga en Bodega/Pernocte',
    icon: 'mdi-warehouse',
  },
  {
    title: 'En camino a Entrega',
    icon: 'mdi-truck-delivery-outline',
  },
  {
    title: 'En punto de Entrega',
    icon: 'mdi-truck-check',
  },
  {
    title: 'Entregado',
    icon: 'mdi-truck-check-outline',
  },
]

const showNextDrawer = () => {
    const currentStatus = serviceData.value.status
    if (currentStatus == 'Inicio'){
        IsCreatedVisible.value = true
    }
    if (currentStatus == 'En camino a Retiro'){
        IsRetiroVisible.value = true
    }
    if (currentStatus == 'En punto de Retiro'){
        IsRetiroPointVisible.value = true
    }
    if (currentStatus == 'Carga en Ruta'){
        IsRouteVisible.value = true
    }
    if (currentStatus == 'Carga en Bodega/Pernocte'){
        IsWarehouseVisible.value = true
    }
    if (currentStatus == 'En camino a Entrega'){
        IsEntregaVisible.value = true
    }
    if (currentStatus == 'En punto de Entrega'){
        IsEntregaPointVisible.value = true
    }
}

const showHelpDrawer = () => {
    IsReportVisible.value = true
}

const goToMessages = () => {
  router.push({ name: 'apps-chat', query: { order_id: serviceData.value.code_id }})
}

const submitStatusChange = async (payload: any) => {
    console.log(payload)
    const { step: stepNumber } = payload
    checkoutSteps[stepNumber].title
    const submitPayload = {
        order_id: serviceData.value.id,
        status_from: checkoutSteps[stepNumber].title,
        status_to: checkoutSteps[stepNumber + 1].title,
        driver_id: userId,
        is_ok: payload.is_ok,
        description: payload.description,
        file_url: payload.fileUrls
    }
    await invoiceListStore.updateOrderStatus(submitPayload).then(response => {
        console.log(response.data)
        currentStep.value = stepNumber + 1
        progressValue.value = Object.values(progressStatus)[stepNumber + 1]
        serviceData.value.status = checkoutSteps[stepNumber + 1].title
        toaster.success("¡Etapa actualizada!");
        loadServiceActivity(response.data.order.id)
    }).catch(error => {
        console.log(error)
        toaster.error("No se pudo actualizar la etapa");
    })
}

const submitProblem = async (payload: any) =>{
    const submitPayload = {
        order_id: serviceData.value.id,
        status_from: checkoutSteps[currentStep.value].title,
        status_to: checkoutSteps[currentStep.value].title,
        driver_id: userId,
        problems: payload.problemSubject,
        description: payload.problemDescription,
        file_url: payload.fileUrls,
        is_ok: false
    }
    console.log(submitPayload)
    await invoiceListStore.postOrderProblem(submitPayload).then(response => {
        console.log(response.data)
        toaster.success("¡Problema reportado!", {
          // optional options Object
          onClose: ()=> IsReportVisible.value = false
        });
        
    }).catch(error => {
        console.log(error)
        toaster.error("No se pudo reportar el problema");
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

// open link in a new tab
const goTo = (url: string) => {
    window.open(url, '_blank')
}

const { text: textCopied, copy } = useClipboard()

</script>

<template>
  <section v-if="serviceData">
    <VRow>
      <VCol
        cols="12"
        md="9"
      >
        <VCard>
          <!-- SECTION Header -->
          <VCardText class="d-flex flex-wrap justify-space-between flex-column flex-sm-row print-row bg-primary">
            <!-- 👉 Left Content -->
            <!-- <div class="mb-1"> -->
              <div class="d-flex align-center mb-1">
              
                <!-- 👉 Title -->
                <h3 class="text-h4 text-uppercase font-bolder">
                    {{serviceData.Customer.name}}
                </h3>

            </div>
            <VChip class="mb-2" color="dark">
                <VIcon
                    start
                    size="18"
                    :icon="getIconFromOrderType(serviceData.order_type)"
                />
                {{serviceData.order_type_description}} - {{ serviceData.order_category }}
            </VChip>
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
              <p class="mb-2">
                <strong>Cliente:</strong>  {{serviceData.EndCustomer.name}}
              </p>
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
              >
                <p class="mb-0" v-if="serviceData.Driver">
                  <strong>Conductor: </strong>  {{serviceData.Driver.name}} {{serviceData.Driver.lastname}}
                  <IconBtn v-if="serviceData.Driver"
                  class="app-card-code-copy-icon"
                  color="white"
                  @click="() => { copy(driverInfo) }"
                    >
                    
                    <VIcon
                            :icon="textCopied == driverInfo ? 'mdi-check' : 'mdi-content-copy'"
                            size="20"
                          />
                  </IconBtn>
                </p>
                <p class="mb-0" v-if="serviceData.Driver">
                    <strong >RUT: </strong> {{formatRut(serviceData.Driver.dni)}}
                    <!-- <IconBtn v-if="serviceData.Driver"
                    class="app-card-code-copy-icon"
                    color="white"
                    @click="() => { copy(formatRut(serviceData.Driver.dni)) }"
                    >
                      <VIcon
                        :icon="textCopied == formatRut(serviceData.Driver.dni) ? 'mdi-check' : 'mdi-content-copy'"
                        size="20"
                      />
                    </IconBtn> -->
                </p>
                <p class="mb-0" v-if="serviceData.Driver?.phone">
                    <strong>Fono: </strong> {{serviceData.Driver.phone}}
                    <!-- <IconBtn v-if="serviceData.Driver"
                      class="app-card-code-copy-icon"
                      color="white"
                      @click="() => { copy(serviceData.Driver.phone) }"
                      >
                        <VIcon
                          :icon="textCopied == serviceData.Driver.phone ? 'mdi-check' : 'mdi-content-copy'"
                          size="20"
                        />
                      </IconBtn> -->
                </p>
                <p class="mb-0" v-if="serviceData.Truck">
                    <strong>Patente: </strong>  {{serviceData.Truck.license}}
                    <!-- <IconBtn v-if="serviceData.Truck"
                      class="app-card-code-copy-icon"
                      color="white"
                      @click="() => { copy(serviceData.Truck.license) }"
                      >
                        <VIcon
                          :icon="textCopied == serviceData.Truck.license ? 'mdi-check' : 'mdi-content-copy'"
                          size="20"
                        />
                      </IconBtn> -->
                </p>
                <!-- <p>Copiar Datos Conductor
                  <IconBtn v-if="serviceData.Driver"
                    class="app-card-code-copy-icon"
                    color="white"
                    @click="() => { copy(driverInfo) }"
                    >
                    
                    <VIcon
                            :icon="textCopied == driverInfo ? 'mdi-check' : 'mdi-content-copy'"
                            size="20"
                          />
                    </IconBtn>
                  </p> -->
              </VCol>

            </VRow>

            <!-- </div> -->

            <!-- 👉 Right Content -->
            <div class="mb-1">
              <!-- 👉 Invoice ID -->
              
              
              <!-- 👉 Issue Date -->
                <p class="mb-2">
                  <strong>Fecha de Inicio: </strong>
                  <span>{{ moment(serviceData.init_time).add(1,'day').locale("es").format("DD/MM/YYYY") + ' ' + serviceData.init_time_range }}</span>
                </p>
                <h5 class="text-h6 mb-1 font-bolder">
                    Ref: {{serviceData.reference}}
                </h5>
                
                <!-- 👉 Due Date -->
                <p class="mb-2" v-if="serviceData.end_time">
                    <strong>Fecha de termino: </strong>
                    <span>{{ serviceData.end_time }}</span>
                </p>
                <!-- <h5 class="text-h6 mb-0 font-bolder" style="color:#154882">
                  {{serviceData.code_id}}
                </h5> -->
            </div>
          </VCardText>
        </VCard>
        <VCard >
          <VCardText>
              <!-- 👉 Stepper -->
              <AppStepper
              v-model:current-step="currentStep"
              :isActiveStepValid="!isOrderCancelled"
              :orderCancelledReason="cancelReason"
              class="checkout-stepper"
              :icon-size="$vuetify.display.smAndUp ? 50 : 35"
              :items="isOrderCancelled ? checkoutStepsWithError: checkoutSteps"
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
              <h6 class="text-sm font-weight-medium me-1">
                Nota:
              </h6>
              <span>{{ serviceData.description }}</span>
            </div>
            <div class="d-flex flex-wrap justify-end d-print-none gap-5 mt-10" v-if="serviceData.invoice_url">
              <VBtn color="success" @click="goTo(serviceData.invoice_url)">
                Descargar Factura
              </VBtn>
            </div>
          </VCardText>
        </VCard>
        <!-- <TimelineWithIcons /> -->
        <ActivityTimeline :items="servicesActivity" />
      </VCol>

      <VCol
        cols="12"
        md="3"
        class="d-print-none"
      >
        <!-- only show to drivers -->
        <VCard v-if="userId && userType === 'driver' ">
          <VCardText class="btn-containers">
            <!-- 👉 Send Invoice Trigger button -->
            <VBtn
              :disabled="currentStep == 3"
              block
              prepend-icon="mdi-send-outline"
              class="mb-4"
              @click="showNextDrawer()"
            >
            {{currentStep == 3 ? 'Esperando actualizacion': 'Siguiente etapa'}}
            </VBtn>

            <VBtn
                v-if="currentStep !== 5"
              block
              prepend-icon="mdi-warning-outline"
              class="mb-4"
              color="warning"
              variant="outlined"
              @click="showHelpDrawer()"
            >
              Reportar problemas
            </VBtn>

            <VBtn
              block
              prepend-icon="mdi-message-outline"
              color="info"
              variant="outlined"
              @click="goToMessages()"
            >
              Soporte
            </VBtn>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- 👉 report problem drawer -->
    <OrderReportProblems v-model:isDrawerOpen="IsReportVisible" @submit="submitProblem" />

    <!-- 👉 Services update forms drawe -->
    <OrderChangeStatusInCreated v-model:isDrawerOpen="IsCreatedVisible" @submit="submitStatusChange" />
    <OrderChangeStatusInRetiro v-model:isDrawerOpen="IsRetiroVisible" @submit="submitStatusChange" />
    <OrderChangeStatusInRetiroPoint v-model:isDrawerOpen="IsRetiroPointVisible" @submit="submitStatusChange" />
    <OrderChangeStatusInRoute v-model:isDrawerOpen="IsRouteVisible" @submit="submitStatusChange" />
    <OrderChangeStatusInWarehouse v-model:isDrawerOpen="IsWarehouseVisible" @submit="submitStatusChange" />
    <OrderChangeStatusInEntrega v-model:isDrawerOpen="IsEntregaVisible" @submit="submitStatusChange" />
    <OrderChangeStatusInEntregaPoint v-model:isDrawerOpen="IsEntregaPointVisible" @submit="submitStatusChange" />
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
