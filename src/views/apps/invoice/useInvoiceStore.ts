import { defineStore } from 'pinia'
import type { InvoiceParams } from './types'
import axios from '@axios'

export const useInvoiceStore = defineStore('InvoiceStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchInvoices(params: InvoiceParams) {
      return axios.get('apps/invoices', { params })
    },

    // 👉 Fetch single invoice
    fetchInvoice(id: number) {
      return axios.get(`/apps/invoices/${id}`)
    },

    // 👉 Fetch Clients
    fetchClients() {
      return axios.get('/apps/invoice/clients')
    },

    // 👉 Delete Invoice
    deleteInvoice(id: number) {
      return axios.delete(`/apps/invoices/${id}`)
    },

    fetchServices() {
      return axios.get(process.env.API_URL+'/orders', {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      })
    },

    fetchQuotes() {
      return axios.get(process.env.API_URL+'/quotes', {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      })
    },

    fetchQuote(code_id: string) {
      return axios.get(process.env.API_URL+'/quotes/' + code_id, {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      })
    },

    confirmQuote(payload: {quote_id: string, accept: boolean, cancelReason: string}) {
      return axios.post(process.env.API_URL+'/confirm_quote/' + payload.quote_id , payload, {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      })
    },

    fetchService(code_id: string) {
      return axios.get(process.env.API_URL+'/orders/' + code_id, {
        headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
      })
    },


    fetchServiceActivity(service_id: number) {
      return axios.get(process.env.API_URL+'/order_updates/' + service_id , {
          headers:
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
        })
    },

    updateOrderStatus(orderPayload: {order_id: number, status_from: string, status_to: string, driver_id: number, is_ok: boolean, description: string, file_url: any}) {
      const {order_id, status_from, status_to, driver_id, is_ok, description, file_url} = orderPayload;
      return axios.post(process.env.API_URL+'/order_status', {
        order_id,
        status_from,
        status_to,
        driver_id,
        is_ok,
        description,
        file_url
      },{
          headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
        })
    },

    postOrderProblem(orderPayload: {order_id: number, status_from: string, status_to: string, driver_id: number, is_ok: boolean, file_url: any, problems: string, description: string}) {
      const {order_id, status_from, status_to, driver_id, is_ok, file_url, problems, description} = orderPayload;
      return axios.post(process.env.API_URL+'/order_error', {
        order_id,
        status_from,
        status_to,
        driver_id,
        is_ok,
        file_url,
        problems, 
        description
      },{
          headers: 
          { Authorization: 'Bearer '+localStorage.getItem('accessToken') }
        })
    },
  },
})
