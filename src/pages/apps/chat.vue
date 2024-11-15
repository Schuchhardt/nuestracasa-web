<script lang="ts" setup>
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useDisplay } from 'vuetify'
import type { ChatContact as TypeChatContact } from '@/@fake-db/types'
import ChatLeftSidebarContent from '@/views/apps/chat/ChatLeftSidebarContent.vue'
import ChatLog from '@/views/apps/chat/ChatLog.vue'
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { useResponsiveLeftSidebar } from '@core/composable/useResponsiveSidebar'
import { avatarText } from '@core/utils/formatters'
import { useRoute, useRouter } from 'vue-router'

// composables
const vuetifyDisplays = useDisplay()
const store = useChatStore()
const { isLeftSidebarOpen } = useResponsiveLeftSidebar(vuetifyDisplays.smAndDown)

// Perfect scrollbar
const chatLogPS = ref()

const scrollToBottomInChatLog = () => {
  const scrollEl = chatLogPS.value.$el || chatLogPS.value
  scrollEl.scrollTop = scrollEl.scrollHeight
}

const { id: userId } = JSON.parse(localStorage.getItem('userData') || '{}') 
const route = useRoute()
const router = useRouter()
const q = ref('')
store.fetchChatsAndContacts()

// Open Sidebar in smAndDown when "start conversation" is clicked
const startConversation = async () => {
  isLeftSidebarOpen.value = true
  const contact = {
    id: route.query.order_id as string,
    fullName: "Servicio " + route.query.order_id,
    name: "Servicio " + route.query.order_id,
    role: "Equipo soporte",
  }
  store.setNewActiveChat(contact,userId)
}

// Chat message
const msg = ref('')

const sendMessage = async () => {
  if (!msg.value)
    return

  await store.sendMsg(msg.value, userId, route.query.order_id as string)

  // Reset message input
  msg.value = ''

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

const openChatOfContact = async (conversationId: string) => {
  router.push({ name: 'apps-chat', query: { order_id: conversationId }})
  if (store.activeChat?.contact?.code_id === conversationId)
    return
  await store.getChat(conversationId)

  // Reset message input
  msg.value = ''

  // Set unseenMsgs to 0
  const contact = store.chatsContacts.find(c => c.id === conversationId)
  if (contact)
    contact.chat.unseenMsgs = 0

  // if smAndDown =>  Close Chat & Contacts left sidebar
  if (vuetifyDisplays.smAndDown.value)
    isLeftSidebarOpen.value = false

  // Scroll to bottom
  nextTick(() => {
    scrollToBottomInChatLog()
  })
}

// User profile sidebar
const isUserProfileSidebarOpen = ref(false)

// Active chat user profile sidebar
const isActiveChatUserProfileSidebarOpen = ref(false)

let intervalPolling: any = null

if (route.query.order_id) {
  startConversation()
  openChatOfContact(route.query.order_id as string)
  if (intervalPolling)
    clearInterval(intervalPolling)
  intervalPolling = setInterval(() => {
    console.log('get meessages')
    store.getChat(route.query.order_id as string)
    // Scroll to bottom
    nextTick(() => {
      scrollToBottomInChatLog()
    })
  }, 5000);
}

onBeforeUnmount(() => {
  if (intervalPolling)
    clearInterval(intervalPolling)
})

</script>

<template>
  <VLayout class="chat-app-layout bg-surface">
    <!-- 👉 user profile sidebar -->
    <!-- <VNavigationDrawer
      v-model="isUserProfileSidebarOpen"
      temporary
      touchless
      absolute
      class="user-profile-sidebar"
      location="start"
      width="370"
    >
      <ChatUserProfileSidebarContent @close="isUserProfileSidebarOpen = false" />
    </VNavigationDrawer> -->

    <!-- 👉 Active Chat sidebar -->
    <!-- <VNavigationDrawer
      v-model="isActiveChatUserProfileSidebarOpen"
      width="374"
      absolute
      temporary
      location="end"
      touchless
      class="active-chat-user-profile-sidebar"
    >
      <ChatActiveChatUserProfileSidebarContent @close="isActiveChatUserProfileSidebarOpen = false" />
    </VNavigationDrawer> -->

    <!-- 👉 Left sidebar   -->
    <VNavigationDrawer
      v-model="isLeftSidebarOpen"
      absolute
      touchless
      location="start"
      width="370"
      :temporary="$vuetify.display.smAndDown"
      class="chat-list-sidebar"
      :permanent="$vuetify.display.mdAndUp"
    >
      <ChatLeftSidebarContent
        v-model:isDrawerOpen="isLeftSidebarOpen"
        v-model:search="q"
        @open-chat-of-contact="openChatOfContact"
        @show-user-profile="isUserProfileSidebarOpen = true"
        @close="isLeftSidebarOpen = false"
      />
    </VNavigationDrawer>

    <!-- 👉 Chat content -->
    <VMain class="chat-content-container">
      <!-- 👉 Right content: Active Chat -->
      <div
        v-if="store.activeChat"
        class="d-flex flex-column h-100"
      >
        <!-- 👉 Active chat header -->
        <div class="active-chat-header d-flex align-center text-medium-emphasis">
          <!-- Sidebar toggler -->
          <IconBtn
            class="d-md-none me-3"
            @click="isLeftSidebarOpen = true"
          >
            <VIcon icon="mdi-menu" />
          </IconBtn>

          <!-- avatar -->
          <div
            class="d-flex align-center cursor-pointer"
            @click="isActiveChatUserProfileSidebarOpen = true"
          >
            <VBadge
              dot
              location="bottom right"
              offset-x="3"
              offset-y="3"
              :color="'success'" 
              bordered
            >
              <VAvatar
                size="40"
                :variant="!store.activeChat.contact?.avatar ? 'tonal' : undefined"
                :color="'success'"
                class="cursor-pointer"
              >
                <span >{{ avatarText(store.activeChat.contact?.fullName || store.activeChat.contact?.name || 'Servicio') }}</span>
              </VAvatar>
            </VBadge>

            <div class="flex-grow-1 ms-4 overflow-hidden">
              <h6 class="text-base font-weight-regular text-medium-emphasis">
                Servicio {{ store.activeChat.contact?.fullName }}
              </h6>
              <span class="d-block text-sm text-truncate text-disabled">Equipo soporte</span>
            </div>
          </div>

          <VSpacer />

          <!-- Header right content -->
          <div class="d-sm-flex align-center d-none">
            <IconBtn>
              <VIcon icon="mdi-phone" />
            </IconBtn>
          </div>

          <!-- <MoreBtn :menu-list="moreList" /> -->
        </div>

        <VDivider />

        <!-- Chat log -->
        <PerfectScrollbar
          ref="chatLogPS"
          tag="ul"
          :options="{ wheelPropagation: false }"
          class="flex-grow-1"
        >
          <ChatLog />
        </PerfectScrollbar>

        <!-- Message form -->
        <VForm
          class="chat-log-message-form mb-5 mx-5"
          @submit.prevent="sendMessage"
        >
          <VTextField
            :key="store.activeChat?.contact?.id"
            v-model="msg"
            variant="solo"
            class="chat-message-input"
            placeholder="Escribe tu mensaje..."
            autofocus
          >
            <template #append-inner>
              <!-- <IconBtn>
                <VIcon
                  icon="mdi-microphone-outline"
                  size="22"
                />
              </IconBtn> -->

              <IconBtn
                class="me-4"
              >
                <VIcon
                  icon="mdi-attachment"
                  size="22"
                />
              </IconBtn> 

              <VBtn @click="sendMessage">
                Enviar
              </VBtn>
            </template>
          </VTextField>

          <!-- <input
            ref="refInputEl"
            type="file"
            name="file"
            accept=".jpeg,.png,.jpg,GIF"
            hidden
          > -->
        </VForm>
      </div>

      <!-- 👉 Start conversation -->
      <div
        v-else
        class="d-flex h-100 align-center justify-center flex-column"
      >
        <VAvatar
          size="109"
          class="elevation-3 mb-6 bg-surface"
        >
          <VIcon
            size="50"
            class="rounded-0 text-high-emphasis"
            icon="mdi-message-outline"
          />
        </VAvatar>
        <p
          class="mb-0 px-6 py-1 font-weight-medium text-lg elevation-3 rounded-xl text-high-emphasis bg-surface cursor-pointer"
          @click="startConversation"
        >
          Nueva conversación
        </p>
      </div>
    </VMain>
  </VLayout>
</template>

<route lang="yaml">
meta:
  layoutWrapperClasses: layout-content-height-fixed
</route>

<style lang="scss">
@use "@styles/variables/_vuetify.scss";
@use "@core/scss/base/_mixins.scss";
@use "@layouts/styles/mixins" as layoutsMixins;

// Variables
$chat-app-header-height: 68px;

// Placeholders
%chat-header {
  display: flex;
  align-items: center;
  min-block-size: $chat-app-header-height;
  padding-inline: 1rem;
}

.chat-app-layout {
  border-radius: vuetify.$card-border-radius;

  @include mixins.elevation(vuetify.$card-elevation);

  $sel-chat-app-layout: &;

  @at-root {
    .skin--bordered {
      @include mixins.bordered-skin($sel-chat-app-layout);
    }
  }

  .active-chat-user-profile-sidebar,
  .user-profile-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }

  .chat-list-header,
  .active-chat-header {
    @extend %chat-header;
  }

  .chat-list-search {
    .v-field__outline__start {
      flex-basis: 20px !important;
      border-radius: 28px 0 0 28px !important;
    }

    .v-field__outline__end {
      border-radius: 0 28px 28px 0 !important;
    }

    @include layoutsMixins.rtl {
      .v-field__outline__start {
        flex-basis: 20px !important;
        border-radius: 0 28px 28px 0 !important;
      }

      .v-field__outline__end {
        border-radius: 28px 0 0 28px !important;
      }
    }
  }

  .chat-list-sidebar {
    .v-navigation-drawer__content {
      display: flex;
      flex-direction: column;
    }
  }
}

.chat-content-container {
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));

  // Adjust the padding so text field height stays 48px
  .chat-message-input {
    .v-field__append-inner {
      align-items: center;
      padding-block-start: 0;
    }

    .v-field--appended {
      padding-inline-end: 6px;
    }
  }
}

.chat-user-profile-badge {
  .v-badge__badge {
    /* stylelint-disable liberty/use-logical-spec */
    min-width: 12px !important;
    height: 0.75rem;
    /* stylelint-enable liberty/use-logical-spec */
  }
}
</style>
