import { defineStore } from 'pinia'
import type { AuthResponse, TGAuth } from '~/types/auth'

export const useMyTokenStore = defineStore('tokenStore', () => {
  const toast = useToast();
  const userStore = useMyUserStore();
  const headerStore = useMyHeaderStore();
  const favouritesStore = useMyFavouritesStore()
  const tokenData = ref<AuthResponse>({
    message: '',
    token: ''
  });

  const sendAuthRequest = async () => {
    try {
      const { data: authData, error:authError } = await useApiFetch<AuthResponse>('/auth/telegram', {
        method: 'POST',
        body: JSON.stringify(userStore.userData)
      })
  
      if (authError.value) {
        console.log(authError.value);
        useStatusCodeCheck(authError.value.statusCode);
      } else if(authData.value) {
        tokenData.value = authData.value;
        headerStore.headerValue = userStore.userData.first_name;
        headerStore.headerIcon = null;
        headerStore.setAvatar(userStore.userData.photo_url);
        await favouritesStore.getFavouritesIds();
      }
    } catch (e) {
      console.error(e)
    } finally {
      toast.add({
        title: 'Вы вошли в аккаунт!'
      })
    }
  }

  const clearTokenData = () => {
    tokenData.value.message = '';
    tokenData.value.token = '';
    favouritesStore.favouritesList = [];
  }

  return { tokenData, sendAuthRequest, clearTokenData }
}, {
    persist: piniaPluginPersistedstate.cookies({
      secure: true
    }),
  },
)

