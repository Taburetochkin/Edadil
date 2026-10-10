<template>
  <div 
    class="flex flex-col gap-[2%] 
    items-center h-full py-[2%] md:pt-[120px] overflow-y-auto"
  >
    <div class="grid sm:grid-cols-1 sm:grid-rows-2 md:grid-rows-1 sm:gap-2 md:gap-0 md:grid-cols-3 items-center w-full">
      <CategoryDropdown
        @category-selected="getProductByCategory"
        class="pl-[5%]" 
      />
      <div class="flex items-center justify-center gap-[2%] sm:px-[5%] lg:px-0">
        <UInput
          v-model="searchValue"
          name="searchValue"
          placeholder="Поиск"
          icon="i-material-symbols-search-rounded"
          autocomplete="off"
          @keydown.enter="sendLLMRequest"

          :ui="{
            color: {
              white: {
                outline: 'focus:ring-purple-500 dark:focus:ring-purple-400'
              },
              gray: {
                outline: 'focus:ring-purple-500 dark:focus:ring-purple-400'
              }
            },
            icon: {
              trailing: {
                pointer: ''
              }
            },
            wrapper: 'w-full min-w-72'
          }"
        >
          <template #trailing>
            <UButton
              v-show="searchValue !== ''"
              color="gray"
              variant="link"
              icon="i-heroicons-x-mark-20-solid"
              :padded="false"
              @click="searchValue = ''"
            />
          </template>
        </UInput>
      </div>
    </div>
    <div 
      class="text-center text-lg w-[90%]"
      v-if="llmMessage !== null"
    >
      <h2>{{ llmMessage }}</h2>
    </div>
    <div
      v-if="!isLoading && cardsList === null && cardsListByCategory === null"
      class="flex items-center justify-center 
      w-full h-full"
    >
      <h2 class="text-2xl font-bold text-center">Сделайте запрос на получение товаров или воспользуйтесь каталогом!</h2>
    </div>
    <div
      v-if="!isLoading && cardsList !== null"
      class="grid lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-y-10 w-full justify-items-center items-center justify-evenly content-evenly"
    >
      <div 
        class="flex flex-col items-center w-full"
        v-for="card in cardsList"
      >
        <SearchCard
          :photo_url="card.photo_url"
          :id="card.id"
          :min_price="card.min_price"
          :name="card.name"
        />
      </div>
    </div>
    <div
      v-if="!isLoading && cardsListByCategory !== null"
      class="grid lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-y-10 w-full justify-items-center items-center justify-evenly content-evenly"
    >
      <div 
        class="flex flex-col items-center w-full"
        v-for="card in cardsListByCategory"
      >
        <SearchCard
          :photo_url="card.photo_url"
          :id="card.id"
          :min_price="card.min_price"
          :name="card.name"
        />
      </div>
    </div>
    <div 
      class="flex items-center justify-center 
      w-full h-full"
      v-else-if="isLoading"
    >
      <Preloader />
    </div>
    <div v-if="cardsListByCategory !== null && totalItems > 18" class="self-end pr-[5%] h-full flex flex-col-reverse">
      <UPagination
        v-model="currentPage"
        :total="totalItems"
        :page-count="18"
        show-first
        show-last
        @update:model-value="(page) => getProductByCategory(lastCategoryId, page)"
        class="justify-self-end"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { LLMResponse } from '~/types/llm';
import { type SearchCard } from '~/types/products';
import type { SearchByCategory } from '~/types/searchByCategory';

const searchValue = ref('');
const isLoading = ref(false);
const toast = useToast();
const cardsList = ref<SearchCard[] | null>(null);
const cardsListByCategory = ref<SearchCard[] | null>(null);
const llmMessage = ref<string | null>(null);
const currentPage = ref(1);
const totalItems = ref(0);
const lastCategoryId = ref('');

const sendLLMRequest = async() => {
  try {
    isLoading.value = true;
    llmMessage.value = null;
    cardsList.value = null;
    cardsListByCategory.value = null;
    const {data: llmData, error: llmError} = await useApiFetch<LLMResponse>('/llm-request', {
      method: 'POST',
      body: JSON.stringify({
        query: searchValue.value
      })
    })
    if (llmError.value) {
      useStatusCodeCheck(llmError.value.statusCode)
    } else if (llmData.value) {
      cardsList.value = llmData.value.products;
      llmMessage.value = llmData.value.comment;
    }
  } catch (error) {
    toast.add({
      title: 'Произошла ошибка',
    })
  } finally {
    isLoading.value = false;
    searchValue.value = '';
  }
}

const getProductByCategory = async (category_id: string, page = 1) => {
  lastCategoryId.value = category_id;
  try {
    isLoading.value = true;
    llmMessage.value = null;
    cardsList.value = null;
    cardsListByCategory.value = null;
    currentPage.value = page;

    const { data: getProductData, error: getProductError } = await useApiFetch<SearchByCategory>('/abstract-products-by-category', {
      method: 'GET',
      query: {
        category_id,
        pageSize: 18,
        page
      }
    });

    if (getProductError.value) {
      useStatusCodeCheck(getProductError.value.statusCode);
    } else if (getProductData.value) {
      if (!getProductData.value.products?.length) {
        toast.add({
          title: 'Товары отсутствуют!',
          description: 'Попробуйте в другой раз.'
        });
      } else {
        cardsListByCategory.value = getProductData.value.products;
        totalItems.value = getProductData.value.total;
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

useHead({
  meta: [
    {
      name: 'description',
      content: 'Найдите нужные вам товары электроники, используя нашего виртуального помощника.'
    },
    {
      name: 'keywords',
      content: 'Технодил, технодил, Technodil, technodil'
    }
  ]
})
</script>