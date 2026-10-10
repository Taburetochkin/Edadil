<template>
  <div
    class="flex flex-col gap-[2%] items-center h-full py-[2%] md:pt-[120px] overflow-y-auto"
  >
    <div v-if="!isLoading && categories.length === 0" class="flex items-center justify-center w-full h-full">
      <h2 class="text-2xl font-bold text-center">
        Здесь будут отображаться товары, добавленные для сравнения!
      </h2>
    </div>
    <div 
      class="flex items-center justify-center 
      w-full h-full"
      v-else-if="isLoading"
    >
      <Preloader />
    </div>
    <div 
      class="w-full relative flex items-center justify-center z-0"
      v-if="!isLoading && categories.length > 0"
    >
      <button
        v-if="showLeftButton"
        class="absolute left-[calc(5%/3)] top-0 z-20 rounded-full w-10 h-10 bg-white dark:bg-gray-800 shadow-md dark:shadow-black hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden md:flex items-center justify-center"
        @click="scrollLeft"
      >
        <Icon name="i-heroicons-chevron-left" class="w-6 h-6 text-purple-500 dark:text-purple-400" />
      </button>

      <div
        ref="tabsContainer"
        class="overflow-x-auto no-scrollbar w-[calc(100%-10%/3-40px)] -z-10"
        :class="{
          'w-[calc(100%-10%/3-40px)]' : tabsContainer,
          'w-[calc(100%-10%/3)]' : !tabsContainer
        }"
        @scroll="checkScrollButtons"
      >
        <div class="w-max">
          <UTabs
            :items="tabs"
            @change="changeCategory"
            :ui="{
              list: { base: 'flex gap-2' },
              tab: {
                base: 'whitespace-nowrap min-w-[120px] px-4 py-2 text-sm rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition'
              }
            }"
          />
        </div>
      </div>

      <button
        v-if="showRightButton"
        class="absolute right-[calc(5%/3)] top-0 z-20 rounded-full w-10 h-10 bg-white dark:bg-gray-800 shadow-md dark:shadow-black hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden xl:flex items-center justify-center"
        @click="scrollRight"
      >
        <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-purple-500 dark:text-purple-400" />
      </button>
    </div>

    <div
      v-if="!isLoading && categories.length > 0"
      class="grid lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-y-10 w-full justify-items-center items-center justify-evenly content-evenly"
    >
      <div
        class="flex flex-col items-center w-full"
        v-for="card in currentProducts"
        :key="card.id"
      >
        <SearchCard
          :photo_url="card.photo_url"
          :id="card.id"
          :min_price="card.min_price"
          :name="card.name"
          :show-like-button="false"
          context="compare"
        />
        <div class="mt-2 w-full max-w-[90%]">
          <ContentDisplay :content="getNormalizedContent(card)" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;  
  scrollbar-width: none;  
}
</style>

<script setup lang="ts">
import type { ComparisonCategories, ComparisonCard } from '~/types/compare';
import type { SearchCard } from '~/types/products';

const comparisonStore = useMyComparisonStore();

const categories = ref<ComparisonCard[]>([]);
const currentCategoryIndex = ref(0);
const currentProducts = ref<SearchCard[]>([]);
const isLoading = ref(false);

const tabsContainer = ref<HTMLElement | null>(null);

const showLeftButton = ref(false);
const showRightButton = ref(false);

const checkScrollButtons = () => {
  const container = tabsContainer.value;
  if (!container) return;

  showLeftButton.value = container.scrollLeft > 0;
  showRightButton.value =
    container.scrollLeft + container.clientWidth < container.scrollWidth;
};

const scrollLeft = () => {
  tabsContainer.value?.scrollBy({ left: -320, behavior: 'smooth' });
};

const scrollRight = () => {
  tabsContainer.value?.scrollBy({ left: 320, behavior: 'smooth' });
};

onMounted(() => {
  nextTick(() => checkScrollButtons());
  window.addEventListener('resize', checkScrollButtons);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScrollButtons);
});

const tabs = computed(() => {
  return categories.value.map(category => ({ label: category.name }));
});

const changeCategory = (index: number) => {
  currentCategoryIndex.value = index;
  currentProducts.value = categories.value[index]?.products || [];
};

const getNormalizedContent = (card: SearchCard) => {
  const category = categories.value[currentCategoryIndex.value];
  if (!category) return {};

  const normalizedContent: Record<string, Record<string, string>> = {};

  normalizedContent['Основные характеристики'] = {};

  category.specs.forEach(spec => {
    normalizedContent['Основные характеристики'][spec.name] = spec.values[card.id] || '...';
  });

  return normalizedContent;
}

const getComparison = async () => {
  try {
    isLoading.value = true;
    categories.value = [];
    currentProducts.value = [];
    if (currentCategoryIndex.value !== 0) {
      currentCategoryIndex.value -= 1;
    }

    const { data: comparisonData, error: comparisonError } = await useApiFetch<ComparisonCategories>(
      '/compare',
      {
        method: 'POST',
        body: JSON.stringify({
          product_ids: comparisonStore.comparisonList,
        }),
      }
    );

    if (comparisonError.value) {
    } else if (comparisonData.value) {
      categories.value = comparisonData.value.categories;
      if (categories.value.length > 0) {
        currentProducts.value = categories.value[currentCategoryIndex.value]?.products || [];
      } else {
        currentProducts.value = [];
        currentCategoryIndex.value = 0;
      }
    }
  } finally {
    isLoading.value = false;
    navStore.showNav();
  }
};

const navStore = useMyNavStore();


onMounted(async () => {
  await getComparison();
  const navStore = useMyNavStore();
  navStore.showNav();
});

watch(() => comparisonStore.comparisonList, async () => {
  await getComparison();
}, { deep: true });

</script>
