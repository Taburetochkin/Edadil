export const useApiFetch = <T>(request: string, options = {}) => {
  const config = useRuntimeConfig();
  const tokenStore = useMyTokenStore()

  return useFetch<T>(request, {
    baseURL: config.public.apiUrl,
    headers: {
      Authorization: tokenStore.tokenData.token && tokenStore.tokenData.token !== '' ? `Bearer ${tokenStore.tokenData.token}` : '',
    },
    ...options
  })
}
