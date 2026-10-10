<template>
  <UCard
    :ui="{
      base: 'h-90 sm:w-[310px] md:w-[360px]',
      header: {
        padding: 'py-2',
        base: 'h-20 flex items-center justify-center' 
      },
      footer: {
        padding: 'py-2',
        base: 'h-20 flex items-center justify-center'
      }
    }"
  >
    <template #header>
      <h2 
        class="text-lg text-center font-bold 
        hover:text-gray-500 dark:text-white dark:hover:text-gray-400 
        hover:transition-all hover:duration-300
        line-clamp-2 overflow-hidden text-ellipsis break-words px-2 cursor-pointer"
        :title="name"
        @click="getProduct(id)"
      >
        {{ capitalize(name) }}
      </h2>
    </template>
    <div class="flex h-full items-center justify-center gap-3">
      <img 
        v-if="photo_url !== ''"
        :src="photo_url" 
        :alt="name"
        class="object-contain rounded
              h-32 w-48 
              sm:h-36 sm:w-52
              md:h-40 md:w-60
              lg:h-44 lg:w-64
              xl:h-48 xl:w-72
              2xl:h-52 2xl:w-80
              3xl:h-60 3xl:w-[360px]"
      />
      <div
        class="flex items-center justify-center rounded
              h-32 w-48 
              sm:h-36 sm:w-52
              md:h-40 md:w-60
              lg:h-44 lg:w-64
              xl:h-48 xl:w-72
              2xl:h-52 2xl:w-80
              3xl:h-60 3xl:w-[360px]"
        v-else-if="photo_url === ''"
      >
        <p class="text-xl">Фото отсутствует</p>
    </div>
    </div>
    <template #footer>
      <div class="flex w-full h-full items-center justify-around gap-2">
        <p class="text-[19px]">
          от {{ min_price.toLocaleString('ru-RU') }} ₽
        </p>
        <div class="flex items-center justify-center gap-2">
          <button 
            v-if="showCompareButton"
            class="
              px-2 py-0.5 rounded text-md 
              text-white bg-purple-500 
              hover:bg-purple-400
              active:bg-purple-600
              dark:text-gray-800
              dark:bg-purple-400
              dark:hover:bg-purple-500
              dark:active:bg-purple-600
              transition-all duration-300
            "
            @click="toggleComparison"
          >
            {{ isInComparison ? 'Убрать' : 'Сравнить' }}
          </button>
          <LikeButton 
            v-if="showLikeButton"
            v-model="isLiked"
            :card-id="id"
          />
        </div>
      </div>
    </template>
  </UCard>
  <UModal 
    v-model="isModalOpen" 
    fullscreen
    :ui="{
      base: 'z-50'
    }"
  >
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-400 dark:divide-gray-800',
        body: {
          base: 'grow overflow-hidden',
          padding: 'px-4 py-5 sm:p-4',
        },
        header: {
          padding: 'p-2 sm:p-4'
        },
        footer: {
          padding: 'p-2 sm:p-4'
        }
      }"
    >
      <template #header>
        <div class="flex items-center justify-center relative">
          <h3 class="text-lg sm:text-xl font-semibold leading-6 text-gray-900 dark:text-white text-center px-8">
            {{ capitalize(abstractData?.name || name) }}
          </h3>
          <UButton 
            color="gray" 
            variant="ghost" 
            icon="i-heroicons-x-mark-20-solid" 
            class="absolute right-0" 
            :padded="false"
            @click="closeModal" 
          />
        </div>
      </template>

      <div class="h-full "> 
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-h-0 h-full"> 
          <div v-if="parsedProducts?.parsedProducts[0]?.photo_urls?.length" class="w-full h-full flex items-center justify-center">
            <UCarousel
              :items="parsedProducts.parsedProducts[0].photo_urls"
              :ui="{
                item: 'flex items-center justify-center snap-center basis-full',
                container: 'rounded-lg overflow-hidden',
                indicators: {
                  wrapper: 'relative bottom-0 mt-2 sm:mt-4 flex-wrap justify-start gap-1 max-w-full'
                }
              }"
              indicators
              class="w-full max-w-[1920px] mx-auto h-full flex flex-col items-center justify-start"
            >
              <template #default="{ item }">
                <div class="flex items-center justify-center w-full h-full p-1">
                  <img 
                    :src="item" 
                    class="object-contain w-full h-auto sm:max-h-[30vh] md:max-h-[45vh] xl:max-h-[60vh] min-h-[200px]"
                    draggable="false"
                    loading="lazy"
                    alt="Изображение товара"
                  >
                </div>
              </template>
              <template #indicator="{ onClick, page, active }">
                <UButton 
                  :label="String(page)" 
                  :variant="active ? 'solid' : 'outline'" 
                  size="2xs" 
                  class="rounded-full min-w-6 max-w-6 h-6 justify-center truncate" 
                  @click="onClick(page)"
                  :title="`Фото ${page}`"
                />
              </template>
            </UCarousel>
          </div>

          <div v-else class="flex items-center justify-center text-xl font-medium">
            <p>Фото отсутствуют</p>
          </div>
          <div class="flex flex-col gap-2 sm:gap-3 w-full h-full min-h-0">
            <div
              class="w-full max-w-full flex flex-wrap justify-start gap-2 sm:gap-3 mt-2"
            >
              <UChip 
                size="xs" 
                position="top-right" 
                inset 
                :ui="{ 
                  base: 'mx-0 sm:-mx-3 rounded-none ring-0', 
                  background: '' 
                }"
                v-for="product in parsedProducts?.parsedProducts"
              >
                <UButton 
                  size="sm"
                  @click="useOpenLink(product.product_url)"
                  class="transition-all duration-300 text-xs sm:text-sm"
                >
                  {{ product.price.toLocaleString('ru-RU') }} ₽
                </UButton>
                <template #content>
                  <UAvatar
                    :src="useMarketLogo(product.market)"
                    :alt="product.market"
                    size="xs"
                    :ui="{ rounded: 'rounded-full' }"
                    class="shadow-md"
                  />
                </template>
              </UChip>
            </div>
            <div class="flex flex-col gap-1 sm:gap-2 overflow-y-auto h-full pr-2">
              <div
                v-for="(value, key) in abstractData?.content"
                :key="key"
                class="text-[13px] sm:text-[15px] leading-snug w-full"
              >
                <div class="flex flex-col w-full">
                  <div
                    class="text-gray-600 dark:text-gray-400 whitespace-nowrap max-w-full truncate"
                  >
                    {{ key }}
                  </div>
                  <div
                    class="flex items-center w-full min-w-0 text-gray-900 dark:text-white break-words"
                  >
                    <span class="flex-grow border-b border-dotted border-gray-300 dark:border-gray-600"></span>
                    <span class="text-left">{{ value || '—' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-center sm:justify-end">
          <div class="flex items-center justify-center gap-2">
            <button 
              v-if="showCompareButton"
              class="
                px-2 py-0.5 rounded text-md 
                text-white bg-purple-500 
                hover:bg-purple-400
                active:bg-purple-600
                dark:text-gray-800
                dark:bg-purple-400
                dark:hover:bg-purple-500
                dark:active:bg-purple-600
                transition-all duration-300
              "
              @click="toggleComparison"
            >
              {{ isInComparison ? 'Убрать' : 'Сравнить' }}
            </button>
            <LikeButton 
              v-if="showLikeButton"
              v-model="isLiked"
              :card-id="id"
              size="sm md:md"
            />
          </div>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import type { SearchCard, ParsedProduct, ParsedProducts, AbstractProduct, AbstractProductContent } from '~/types/products';
import { useMyFavouritesStore } from '~/stores/favouritesStore';
import { useMyComparisonStore } from '~/stores/comparisonStore';
import { useMyNavStore } from '~/stores/navStore';
import { capitalize } from 'vue';

const navStore = useMyNavStore();

const isModalOpen = ref(false);
const parsedProducts = ref<ParsedProducts | null>(null);
const abstractData = ref<AbstractProductContent | null>(null);

interface Props extends SearchCard {
  showLikeButton?: boolean;
  showCompareButton?: boolean;
  context?: 'favourites' | 'search' | 'compare';
}

const props = withDefaults(defineProps<Props>(), {
  showLikeButton: true,
  showCompareButton: true,
  context: 'search'
});

const favouritesStore = useMyFavouritesStore();
const isLiked = ref(favouritesStore.favouritesList.includes(props.id));

watch(() => props.id, (newId) => {
  isLiked.value = favouritesStore.favouritesList.includes(newId);
});

watch(() => favouritesStore.favouritesList, (newList) => {
  isLiked.value = newList.includes(props.id);
}, { deep: true });

const comparisonStore = useMyComparisonStore();
const isInComparison = ref(comparisonStore.comparisonList.includes(props.id));

const toggleComparison = () => {
  if (isInComparison.value) {
    comparisonStore.deleteComparison(props.id);
  } else {
    comparisonStore.appendComparison(props.id);
  }
  isInComparison.value = !isInComparison.value;
};

watch(() => comparisonStore.comparisonList, (newList) => {
  isInComparison.value = newList.includes(props.id);
}, { deep: true });

const getProduct = async (id: string) => {
  try{
    await getAbstractProduct(id);
    await getParsedProducts(id);
  } catch (e) {
    console.error(e);
  } finally {
    navStore.hideNav();
  }
}

const getParsedProducts = async (id: string) => {
  const { data:productData, error:productError } = await useApiFetch<ParsedProducts>('/parsed-products', {
    method: 'GET',
    query: {
      abstractId: id
    }
  });
  if (productError.value) {
    useStatusCodeCheck(productError.value.statusCode);
  } else if (productData.value) {
    parsedProducts.value = productData.value;
    isModalOpen.value = true;
  }
}

const getAbstractProduct = async (id: string) => {
  const { data:abstractProductData, error:abstractProductError } = await useApiFetch<AbstractProduct>('/abstract-product', {
    method: 'GET',
    query: {
      product_id: id
    }
  });
  if (abstractProductError.value) {
    useStatusCodeCheck(abstractProductError.value.statusCode);
  } else if (abstractProductData.value) {
    abstractData.value = abstractProductData.value.product;
  }
}

const closeModal = () => {
  isModalOpen.value = false;
  parsedProducts.value = null;
  navStore.showNav();
}

watch(isLiked, (newVal) => {
  if (!newVal && (props.context === 'favourites' || props.context === 'compare')) {
    setTimeout(() => {
      closeModal();
    }, 500)
  }
});
</script>