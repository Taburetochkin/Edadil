import { defineStore } from 'pinia'
import type { TGAuth } from '~/types/auth'

export const useMyUserStore = defineStore('userStore', () => {
  const userData = ref<TGAuth>({
    auth_date: 0,
    first_name: '',
    hash: '',
    id: 0,
    last_name: '',
    photo_url: '',
    username: '',
  });

  const getUserData = async (user: any) => {
    userData.value = user;
    console.log(userData.value)
  };

  const clearUserData = () => {
    userData.value.auth_date = 0;
    userData.value.first_name = '';
    userData.value.hash = '';
    userData.value.id = 0;
    userData.value.last_name = '';
    userData.value.photo_url = '';
    userData.value.username = '';
  }

  return { userData, getUserData, clearUserData }
})
