import { defineStore } from 'pinia'
import type { SearchCard } from '~/types/products';
import type { Favourites } from '~/types/favourites';

export const useMyFavouritesStore = defineStore('favouritesStore', () => {
  const favouritesList = ref<string[]>([]);

  const appendFavourites = (id: string) => {
    favouritesList.value.push(id);
  }

  const deleteFavourites = (id: string) => {
    favouritesList.value = favouritesList.value.filter(deleteId => deleteId !== id);
  }

  const getFavouritesIds = async () => {
    const {data: favouritesData, error: favouritesError} = await useApiFetch<Favourites>('/favourites/list', {
      method: 'GET',
    })

    if (favouritesError.value) {
      console.log(favouritesError.value)
    } else if (favouritesData.value) {
      favouritesData.value.favourites.forEach(card => {
        appendFavourites(card.id);
      });
      console.log(favouritesData.value);
    }
  }

  return { favouritesList, appendFavourites, deleteFavourites, getFavouritesIds }
}, {
    persist: piniaPluginPersistedstate.cookies({
      secure: true
    }),
  },
)
