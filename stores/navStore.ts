import { defineStore } from 'pinia'

export const useMyNavStore = defineStore('navStore', () => {
  const visible = ref(false);

  const hideNav = () => {
    visible.value = true;
  }

  const showNav = () => {
    visible.value = false;
  }

  const toggleNav = () => {
    visible.value = !visible.value;
  }

  return { visible, hideNav, showNav, toggleNav }
})