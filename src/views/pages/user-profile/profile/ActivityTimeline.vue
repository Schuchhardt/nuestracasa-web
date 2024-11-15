<script lang="ts" setup>
import avatar2 from '@images/avatars/avatar-2.png'

interface Item {
  title: string
  created_at: string
  description?: string
  is_ok: boolean
  file_url?: {id: number, url: string, show?: boolean}[]
}

interface Props {
  items: Item[]
}

const props = withDefaults(defineProps<Props>(), {
})
</script>

<template>
  <VCard>
    <VCardItem>
      <template #prepend>
        <VIcon icon="mdi-chart-timeline-variant" />
      </template>

      <VCardTitle>Actividad</VCardTitle>
    </VCardItem>

    <VCardText>
      <VTimeline
        density="compact"
        align="start"
        truncate-line="both"
        :line-inset="12"
        class="v-timeline-density-compact"
      >
      <VTimelineItem
          :fill-dot="true"
          dot-color="#FFF"
          size="small"
          v-for="(item,index) in props.items"
        >
        <template #icon>
            <div class="v-timeline-avatar-wrapper rounded-circle">
              <VIcon
                :icon="item.is_ok ? 'mdi-update' : 'mdi-warning'"
                size="20"
                :color="item.is_ok ? 'success' : 'error'"
              />
            </div>
          </template>
          <div class="d-flex justify-space-between align-center flex-wrap gap-2 mb-1">
            <span class="app-timeline-title">
              <strong>{{ index + 1 }}</strong> -  {{ item.title }}
            </span>
            <span class="app-timeline-meta">{{ item.created_at }}</span>
          </div>
          <p class="app-timeline-text mb-2" v-if="item.description">
           {{ item.description }}
          </p>
          <div class="d-flex align-center mt-2" v-if="item.file_url">
            <span class="font-weight-medium text-sm" v-for="(file, $index) in item.file_url" v-show="file.show">
              <VIcon
                color="error"
                icon="mdi-file"
                size="24"
                class="me-2"
              />
              <a :href="file.url" target="_blank">Ver Imagen {{ $index + 1 }}</a>
            </span>
          </div>
        </VTimelineItem>
<!-- 
        <VTimelineItem
          dot-color="error"
          size="x-small"
        >
          <div class="d-flex justify-space-between align-center flex-wrap gap-2 mb-1">
            <span class="app-timeline-title">
              8 Invoices have been paid
            </span>
            <span class="app-timeline-meta">Wednesday</span>
          </div>
          <p class="app-timeline-text mb-2">
            Invoices have been paid to the company.
          </p>
          <div class="d-flex align-center mt-2">
            <VIcon
              color="error"
              icon="mdi-file-pdf-box"
              size="24"
              class="me-2"
            />
            <span class="font-weight-medium text-sm">
              Invoices.pdf
            </span>
          </div>
        </VTimelineItem>

        <VTimelineItem
          dot-color="primary"
          size="x-small"
        >
          <div class="d-flex justify-space-between align-center flex-wrap gap-2 mb-1">
            <span class="app-timeline-title">
              Create a new project for client 😎
            </span>
            <span class="app-timeline-meta">April, 18</span>
          </div>

          <p class="app-timeline-text mb-1">
            Invoices have been paid to the company.
          </p>

          <div class="d-flex align-center mt-3">
            <VAvatar
              size="24"
              class="me-2"
              :image="avatar2"
            />
            <div>
              <span class="text-sm font-weight-medium mb-0">
                John Doe (Client)
              </span>
            </div>
          </div>
        </VTimelineItem>

        <VTimelineItem
          dot-color="info"
          size="x-small"
        >
          <div class="d-flex justify-space-between align-center flex-wrap mb-1 gap-2">
            <span class="app-timeline-title">
              Order #37745 from September
            </span>
            <span class="app-timeline-meta">January, 10</span>
          </div>
          <p class="app-timeline-text mb-0">
            Invoices have been paid to the company.
          </p>
        </VTimelineItem>

        <VTimelineItem
          dot-color="success"
          size="x-small"
        >
          <div class="d-flex justify-space-between align-center flex-wrap gap-2 mb-1">
            <span class="app-timeline-title">
              Public Meeting
            </span>
            <span class="app-timeline-meta">September, 30</span>
          </div>
        </VTimelineItem> -->
      </VTimeline>
    </VCardText>
  </VCard>
</template>
