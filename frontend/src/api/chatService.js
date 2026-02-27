import { apiClient } from "./apiClient"

export const fetchMessages = (slug) =>
  apiClient(`/api/messages/${slug}/`)