import { defineStore } from 'pinia'

export const useMyHeaderStore = defineStore('headerStore', () => {

  interface Avatar {
    src: string
  }
  const headerValue = ref('Вход');
  const headerIcon = ref<string | null>('i-material-symbols-door-front-outline-rounded');
  const headerAvatar = ref<null | Avatar>(null);


  const exit = () => {
    headerValue.value = 'Вход';
    headerIcon.value = 'i-material-symbols-door-front-outline-rounded';
    headerAvatar.value = null;
  }

  const setAvatar = (src: string) => {
    if (headerAvatar.value) {
      headerAvatar.value.src = src;
    } else {
      headerAvatar.value = { src };
    }
  }

  return { headerValue, headerIcon, headerAvatar, exit, setAvatar }
}, {
    persist: piniaPluginPersistedstate.cookies({
      secure: true
    }),
  },
)