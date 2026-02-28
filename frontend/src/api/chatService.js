import { apiClient } from "./apiClient"

export const fetchMessages = async (slug, page = 1) => {
  return await apiClient(
    `/api/messages/${slug}/?page=${page}`
  )
}