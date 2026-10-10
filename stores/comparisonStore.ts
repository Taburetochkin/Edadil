import { defineStore } from 'pinia'

export const useMyComparisonStore = defineStore('comparisonStore', () => {
  const comparisonList = ref<string[]>([]);

  const appendComparison = (id: string) => {
    comparisonList.value.push(id);
  }

  const deleteComparison = (id: string) => {
    comparisonList.value = comparisonList.value.filter(deleteId => deleteId !== id);
  }

  return { comparisonList, appendComparison, deleteComparison }
}, {
    persist: piniaPluginPersistedstate.cookies({
      maxAge: 3 * 24 * 60 * 60,
      secure: true
    }),
  },
)
