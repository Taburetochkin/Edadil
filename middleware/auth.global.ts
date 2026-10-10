export default defineNuxtRouteMiddleware((to, from) => {
  const tokenStore = useMyTokenStore();
  const toast = useToast();
  if (!tokenStore.tokenData.token && to.path === '/favourites') {
    toast.add({
      title: 'Вы не авторизованы.'
    })
    return abortNavigation();
  }
})
