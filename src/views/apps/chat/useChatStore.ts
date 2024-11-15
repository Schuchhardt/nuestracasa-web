import type { ActiveChat } from './useChat'
import type { ChatContact, ChatContactWithChat, ChatMessage, ChatOut } from '@/@fake-db/types'
import axios from '@axios'

interface State {
  chatsContacts: ChatContactWithChat[]
  activeChat: ActiveChat
}
const { id: userId } = JSON.parse(localStorage.getItem('userData') || '{}')
export const useChatStore = defineStore('chat', {
  // ℹ️ arrow function recommended for full type inference
  state: (): State => ({
    chatsContacts: [],
    activeChat: null,
  }),
  actions: {
    async fetchChatsAndContacts() {
      const { data } = await axios.get(`${process.env.API_URL}/order_messages`, {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      })
      console.log(data)

      // this.chatsContacts = chatsContacts
      // this.contacts = contacts
      // this.profileUser = profileUser
      this.chatsContacts = data.conversations.map((c: any) => { 
        return {
          id: c.id,
          fullName: c.code_id,
          code_id: c.code_id,
          chat: {
            id: c.id,
            messages: c.OrderMessages,
            unseenMsgs: 0,
            userId: userId,
            lastMessage: c.OrderMessages[c.OrderMessages.length - 1],
          },
          contact: {
            id: c.id,
            fullName: c.code_id,
            code_id: c.code_id,
            status: 'active',
            role: 'driver',
            originDestination: c.origin + ' - ' + c.destination,
            // avatar: c.user.avatar,
            // lastMessage: c.messages[c.messages.length - 1],
          },
        }
      })
      console.log(this.chatsContacts)
    },

    async getChat(chatId: string) {
      const { data } = await axios.get(`${process.env.API_URL}/order_messages/${chatId}`, {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      })
      console.log(data)
      const conversation = this.chatsContacts.find(c => c.code_id === chatId)
      this.activeChat = {
        contact: conversation,
        chat: {
          id: parseInt(chatId),
          messages: data.messages.map((m: any) => {
            return {
              text: m.text,
              created_at: m.created_at,
              sender_id: m.user.id,
            }
          }),
          unseenMsgs: 0,
          userId: userId,
        },
      }
      console.log('this.activeChat', this.activeChat)
    },

    async sendMsg(message: string, senderId: number, orderId: string) {
      const { data } = await axios.post(`${process.env.API_URL}/order_messages`, 
      { text: message, senderId, orderId },
      {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      }
      )
      console.log(data)
      const { order_message: msg }: { order_message: ChatMessage } = data

      this.activeChat?.chat?.messages.push(msg)

      // Set Last Message for active contact
      // const contact = this.chatsContacts.find(c => {
      //   if (this.activeChat)
      //     return c.id === this.activeChat.contact.id

      //   return false
      // }) as ChatContactWithChat

      // contact.chat.lastMessage = msg
    },

    
    async setNewActiveChat(contact: ChatContact, userId: number) {
      this.activeChat = {
        contact,
        chat: {
          id: 1,
          messages: [],
          unseenMsgs: 0,
          userId,
        },
      }
    }
  },
})
