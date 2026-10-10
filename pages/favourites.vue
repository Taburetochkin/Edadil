<template>
  <div class="flex flex-col gap-[2%] 
    items-center h-full py-[2%] md:pt-[120px] overflow-y-auto">
    <div 
      class="grid xl:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-y-10 w-full justify-items-center justify-evenly content-evenly pt-[2%]"
      v-if="!isLoading && favouriteCards !== null && favouriteCards.length > 0"
    >
      <div
        class="flex flex-col items-center gap-5 w-full"
        v-for="card in favouriteCards"
      >
        <SearchCard
          :photo_url="card.photo_url"
          :id="card.id"
          :min_price="card.min_price"
          :name="card.name"
          :show-compare-button="false"
          context="favourites"
        />
      </div>
    </div>
    <div
      v-if="!isLoading && (favouriteCards === null || favouriteCards.length === 0)"
      class="flex flex-col items-center justify-center 
      w-full h-full"
    >
      <h2 class="text-2xl font-bold text-center">Здесь будут находиться ваши избранные товары!</h2>
      <h3 class="text-xl text-center">P.S. Не забудьте начать диалог с ботом.</h3>
    </div>
    
    <div 
      class="flex items-center justify-center 
      w-full h-full"
      v-else-if="isLoading"
    >
      <Preloader />
    </div>
    
    <div v-if="favouriteCards !== null && favouriteCards.length > 0 && totalItems > 18" class="self-end pr-[5%] h-full flex flex-col-reverse">
      <UPagination
        v-model="currentPage"
        :total="totalItems"
        :page-count="18"
        show-first
        show-last
        @update:model-value="(page) => getFavourite(page)"
        class="justify-self-end"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Favourites } from '~/types/favourites';
import type { SearchCard } from '~/types/products';

const favouriteCards = ref<SearchCard[] | null>(null);
const totalItems = ref(0);
const currentPage = ref(1);
const isLoading = ref(false);
const favouritesStore = useMyFavouritesStore();
const tokenStore = useMyTokenStore();
const router = useRouter()

const getFavourite = async(page = 1) => {
  try {
    isLoading.value = true;
    currentPage.value = page;
    
    const {data: favouritesData, error: favouritesError} = await useApiFetch<Favourites>('/favourites/list', {
      method: 'GET',
      query: {
        pageSize: 18,
        page
      }
    })

    if (favouritesError.value) {
      useStatusCodeCheck(favouritesError.value.statusCode)
    } else if (favouritesData.value) {
      favouriteCards.value = favouritesData.value.favourites;
      totalItems.value = favouritesData.value.total;
    }
  } catch (error) {
    console.error('Error fetching favourites:', error);
  } finally {
    isLoading.value = false;
    navStore.showNav();
  }
}

const navStore = useMyNavStore();

onMounted(async () => {
  await getFavourite();
  const navStore = useMyNavStore();
  navStore.showNav();
});

watch(() => favouritesStore.favouritesList, async (newList) => {
  if (tokenStore.tokenData.token) {
    setTimeout(async () => {
      await getFavourite();
    }, 500)
  } else if (!tokenStore.tokenData.token) {
    setTimeout(() => {
      router.push('/');
    }, 100)
  }
}, { deep: true });
</script>