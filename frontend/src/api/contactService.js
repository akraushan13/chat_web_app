import { apiClient } from "./apiClient"

export const fetchContacts = () => apiClient("/api/contacts/")

export const fetchContactDetail = (id) =>
  apiClient(`/api/contacts/${id}/`)

export const searchContacts = (q) =>
  apiClient(`/api/contacts/?q=${q}`)

export const addContact = (payload) =>
  apiClient("/api/contacts/", {
    method: "POST",
    body: JSON.stringify(payload),
  })

export const checkUser = (q) =>
  apiClient(`/api/check-user/?q=${q}`)