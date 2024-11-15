<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import pdf from '@images/icons/project-icons/pdf.png'
import pumaShoes from '@images/pages/puma-shoes.jpeg'

const serverSwitch = ref(false)
</script>

<template>
  <VCard title="Actividad">
    <VCardText>
      <VTimeline
        align="start"
        line-inset="20"
        truncate-line="start"
        justify="center"
        :density="$vuetify.display.smAndDown ? 'compact' : 'default'"
      >
        <!-- SECTION Timeline Item: Flight -->
        <VTimelineItem
          fill-dot
          size="small"
          class="text-start"
        >
          <template #icon>
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="32"
                color="error"
                variant="tonal"
              >
                <VIcon
                  icon="mdi-note-text-outline"
                  size="20"
                />
              </VAvatar>
            </div>
          </template>

          <!-- 👉 Header -->
          <div class="d-flex justify-space-between flex-wrap align-center gap-2">
            <span class="app-timeline-title">
              Servicio creado
            </span>
            <span class="app-timeline-meta">Viernes</span>
          </div>

          <!-- 👉 Content -->
          <p class="app-timeline-text mb-1">
            <span>Chofer y camion asignados al servicio</span>
            <VIcon
              size="20"
              icon="mdi-arrow-right"
              class="mx-2"
            />
            <span>Felipe Salinas, CHTH86</span>
          </p>

          <p class="app-timeline-meta">
            10:30 PM
          </p>

          <!-- <div class="d-flex align-center">
            <img
              :src="pdf"
              width="22"
              class="me-2"
              alt="img"
            >

            <span class="app-timeline-text">
              orden-de-ingreso.pdf
            </span>
          </div> -->
        </VTimelineItem>
        <!-- !SECTION -->

        <!-- SECTION Timeline Item: Interview -->
        <VTimelineItem
          fill-dot
          size="small"
          class="text-start"
        >
          <template #icon>
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="32"
                color="success"
                variant="tonal"
              >
                <VIcon
                  size="20"
                  icon="mdi-clock-time-four-outline"
                />
              </VAvatar>
            </div>
          </template>

          <!-- 👉 Header -->
          <div class="d-flex justify-space-between flex-wrap align-center gap-2">
            <span class="app-timeline-title">
              Inicio del servicio:
            </span>
            <span class="app-timeline-meta">18/Abril</span>
          </div>

          <p class="app-timeline-text mb-0">
            A la espera del chofer para iniciar servicio
          </p>

          <!-- 👉 Divider -->
          <!-- <VDivider class="my-2" /> -->

          <!-- 👉 Person -->
          <!-- <div class="d-flex justify-space-between align-center flex-wrap"> -->
            <!-- 👉 Avatar & Personal Info -->
            <!-- <span class="d-flex align-bottom mt-2">
              <VAvatar
                size="32"
                :image="avatar2"
                class="me-2"
              />
              <div>
                <h6 class="text-sm font-weight-medium">Juan Perez</h6>
                <span class="text-xs">Contacto Origen</span>
              </div>
            </span> -->

            <!-- 👉 Person Actions -->
            <!-- <div>
              <IconBtn class="me-2">
                <VIcon
                  size="20"
                  icon="mdi-message-outline"
                />
              </IconBtn>
              <IconBtn>
                <VIcon
                  size="20"
                  icon="mdi-phone"
                />
              </IconBtn>
            </div> -->
          <!-- </div> -->
        </VTimelineItem>
        <!-- !SECTION -->

        <!-- SECTION Timeline Item: Puma Shoes -->
        <!-- <VTimelineItem
          fill-dot
          size="small"
        >
          <template #icon>
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="32"
                color="warning"
                variant="tonal"
              >
                <VIcon
                  size="20"
                  icon="mdi-cart-outline"
                />
              </VAvatar>
            </div>
          </template>

          <div class="d-flex align-start flex-sm-row flex-column mb-3">
            <VImg
              aspect-ratio="1"
              width="100"
              :src="pumaShoes"
              class="rounded me-4"
            />

            <div>
              <div class="d-flex justify-space-between flex-wrap align-center gap-2">
                <span class="app-timeline-title">
                  Sold Puma POPX Blue Color
                </span>
                <span class="app-timeline-meta">January, 10</span>
              </div>
              <span class="app-timeline-text">PUMA presents the latest shoes from its collection. Light &amp; comfortable made with highly durable material.</span>
            </div>
          </div>  -->

          <!-- 👉 Timeline Item: Meta Content -->
          <!-- <div class="d-flex justify-space-between flex-column flex-sm-row gap-3">
            <div class="text-sm-center">
              <h6 class="text-sm font-weight-medium mb-1">
                Customer
              </h6>
              <span class="text-xs">Micheal Scott</span>
            </div>
            <div class="text-sm-center">
              <h6 class="text-sm font-weight-medium mb-1">
                Price
              </h6>
              <span class="text-xs">$375.00</span>
            </div>
            <div class="text-sm-center">
              <h6 class="text-sm font-weight-medium mb-1">
                Quantity
              </h6>
              <span class="text-xs">1</span>
            </div>
          </div>
        </VTimelineItem> -->
        <!-- !SECTION -->

        <!-- SECTION Timeline Item: Location -->
        <!-- <VTimelineItem
          fill-dot
          size="small"
        >
          <template #icon>
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VAvatar
                size="32"
                color="success"
                variant="tonal"
              >
                <VIcon
                  size="20"
                  icon="mdi-map-marker-outline"
                />
              </VAvatar>
            </div>
          </template>

          <div class="d-flex justify-space-between flex-wrap mb-1">
            <div class="d-flex align-end">
              <VIcon
                icon="mdi-map-marker-outline"
                class="me-1"
              />

              <span class="app-timeline-title">En camino a destino</span>
            </div> -->

            <!-- <VChip
              color="error"
              size="small"
            >
              High
            </VChip> -->
          <!-- </div> -->

          <!-- 👉 Content -->
          <!-- <p class="app-timeline-text mb-1">
            Chofer indica que va en camino a destino
          </p>

          <VDivider />

          <div class="d-flex justify-space-between align-center flex-wrap mt-1">
            <div>
              <IconBtn class="me-2">
                <VIcon
                  size="20"
                  icon="mdi-link-variant"
                />
              </IconBtn>

              <IconBtn class="me-2">
                <VIcon
                  size="20"
                  icon="mdi-message-outline"
                />
              </IconBtn>
              <IconBtn>
                <VIcon
                  size="20"
                  icon="mdi-account-outline"
                />
              </IconBtn>
            </div>

            <span class="app-timeline-meta">15/Julio</span>
          </div>
        </VTimelineItem> -->
        <!-- !SECTION -->
      </VTimeline>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.v-timeline-avatar-wrapper {
  background-color: rgb(var(--v-theme-surface));
}
</style>
