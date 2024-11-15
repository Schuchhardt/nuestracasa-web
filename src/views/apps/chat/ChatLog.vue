<script lang="ts" setup>
import type { ChatOut } from '@/@fake-db/types'
import { useChatStore } from '@/views/apps/chat/useChatStore'
import { formatDate } from '@core/utils/formatters'
import avatar8 from '@images/avatars/avatar-8.png'
const store = useChatStore()

interface MessageGroup {
  senderId: ChatOut['messages'][number]['sender_id']
  messages: Omit<ChatOut['messages'][number], 'sender_id'>[]
}
const { id: userId, avatar } = JSON.parse(localStorage.getItem('userData') || '{}') 
const contact = computed(() => ({
  id: userId,
  avatar: avatar,
}))

// Feedback icon
// const resolveFeedbackIcon = (feedback: ChatOut['messages'][number]['feedback']) => {
//   if (feedback.isSeen)
//     return { icon: 'mdi-check-all', color: 'success' }
//   else if (feedback.isDelivered)
//     return { icon: 'mdi-check-all', color: undefined }
//   else
//     return { icon: 'mdi-check', color: undefined }
// }

const msgGroups = computed(() => {
  let messages: ChatOut['messages'] = []

  const _msgGroups: MessageGroup[] = []

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  if (store.activeChat!.chat) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    messages = store.activeChat!.chat.messages

    let msgSenderId = messages.length > 0 ? messages[0].sender_id : 1

    let msgGroup: MessageGroup = {
      senderId: msgSenderId,
      messages: [],
    }

    messages.forEach((msg, index) => {
      if (msgSenderId === msg.sender_id) {
        msgGroup.messages.push({
          text: msg.text,
          created_at: msg.created_at,
        })
      }
      else {
        msgSenderId = msg.sender_id
        _msgGroups.push(msgGroup)
        msgGroup = {
          senderId: msg.sender_id,
          messages: [
            {
              text: msg.text,
              created_at: msg.created_at,
            },
          ],
        }
      }

      if (index === messages.length - 1)
        _msgGroups.push(msgGroup)
    })
  }

  return _msgGroups
})
</script>

<template>
  <div class="chat-log pa-5">
    <div
      v-for="(msgGrp, index) in msgGroups"
      :key="msgGrp.senderId + String(index)"
      class="chat-group d-flex align-start"
      :class="[{
        'flex-row-reverse': msgGrp.senderId === contact.id,
        'mb-8': msgGroups.length - 1 !== index,
      }]"
    >
      <div
        class="chat-avatar"
        :class="msgGrp.senderId === contact.id ? 'ms-4' : 'me-4'"
      >
        <VAvatar size="32">
          <VImg :src="msgGrp.senderId == contact.id ? contact.avatar : avatar8" />
        </VAvatar>
      </div>
      <div
        class="chat-body d-inline-flex flex-column"
        :class="msgGrp.senderId === contact.id ? 'align-end' : 'align-start'"
      >
        <p
          v-for="(msgData, msgIndex) in msgGrp.messages"
          :key="msgData.created_at"
          class="chat-content text-sm py-3 px-4 elevation-1"
          :class="[
            msgGrp.senderId !== contact.id ? 'bg-surface chat-left' : 'bg-primary text-white chat-right',
            msgGrp.messages.length - 1 !== msgIndex ? 'mb-3' : 'mb-1',
          ]"
        >
          {{ msgData.text }}
        </p>
        <div :class="{ 'text-right': msgGrp.senderId === contact.id }">
          <span class="text-xs me-1 text-disabled">{{ formatDate(msgGrp.messages[msgGrp.messages.length - 1].created_at, { hour: 'numeric', minute: 'numeric' }) }}</span>
          <!-- <VIcon
            v-if="msgGrp.senderId !== contact.id"
            size="16"
            :color="resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).color"
          >
            {{ resolveFeedbackIcon(msgGrp.messages[msgGrp.messages.length - 1].feedback).icon }}
          </VIcon> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang=scss>
.chat-log {
  .chat-content {
    border-end-end-radius: 6px;
    border-end-start-radius: 6px;

    &.chat-left {
      border-start-end-radius: 6px;
    }

    &.chat-right {
      border-start-start-radius: 6px;
    }
  }
}
</style>
