<template>
  <UPopover :popper="{ placement: 'bottom-start' }" v-model:open="popoverIsOpen">
    <UButton color="white" label="Категории" trailing-icon="i-heroicons-chevron-down-20-solid" />

    <template #panel>
      <UCard
        :ui="{
          base: 'h-full overflow-y-auto dark:bg-gray-900',
          body: {
            base: 'min-w-[250px] max-w-[90vw] md:max-w-[400px] dark:bg-gray-900',
            padding: 'p-2 sm:p-2'
          },
          ring: 'ring-1 ring-gray-200 dark:ring-gray-800'
        }"
      >
        <div class="space-y-2 max-h-[400px] overflow-y-auto">
          <div v-if="dropdownCategories === null" class="flex w-full items-center justify-center">
            <h3 class="dark:text-gray-300">Здесь пока пусто.</h3>
          </div>
          <div 
            v-else-if="dropdownCategories !== null"
            v-for="category in dropdownCategories" 
            :key="category.id"
          >
            <!-- Мобильная версия -->
            <div v-if="isMobile" class="space-y-1">
              <UButton
                :padded="false"
                color="gray"
                variant="link"
                class="w-full justify-start font-medium dark:hover:bg-gray-800 dark:text-gray-200"
                @click.stop="handleCategoryClick(category)"
              >
                {{ category.name }}
              </UButton>
              
              <div v-if="category.children?.length" class="pl-4 space-y-1">
                <UButton
                  :ui="{
                    truncate: 'text-left break-all line-clamp-2',
                    block: 'w-full flex justify-start items-start',
                    inline: 'inline-flex items-start'
                  }"
                  v-for="child in category.children"
                  :key="child.id"
                  :padded="false"
                  color="gray"
                  variant="link"
                  class="w-full justify-start text-sm dark:hover:bg-gray-800 dark:text-gray-300"
                  @click.stop="handleCategoryClick(child)"
                >
                  {{ child.name }}
                </UButton>
              </div>
            </div>

            <template v-else>
              <UDropdown 
                v-if="category.children?.length"
                :items="[category.children.map(child => ({
                  label: child.name,
                  click: () => handleCategoryClick(child)
                }))]" 
                :popper="{ placement: 'right-start', offsetDistance: 35 }"
                :ui="{
                  width: 'w-fit',
                  height: 'max-h-[175px]',
                  item: {
                    base: 'whitespace-nowrap dark:hover:bg-gray-700',
                    active: 'dark:bg-gray-800',
                    inactive: 'dark:text-gray-300'
                  },
                  background: 'dark:bg-gray-800',
                  ring: 'ring-1 ring-gray-200 dark:ring-gray-700'
                }"
                @click.stop
              >
                <UButton
                  :padded="false"
                  color="gray"
                  variant="link"
                  class="w-full whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
                  trailing-icon="i-heroicons-chevron-right-20-solid"
                >
                  {{ category.name }}
                </UButton>
              </UDropdown>

              <UButton
                v-else
                :padded="false"
                color="gray"
                variant="link"
                class="w-full justify-start whitespace-nowrap hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200"
                @click.stop="handleCategoryClick(category)"
              >
                {{ category.name }}
              </UButton>
            </template>
          </div>
        </div>
      </UCard>
    </template>
  </UPopover>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isMobile = ref(false)

const popoverIsOpen = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface Categories {
  categories: Category[];
}

const dropdownCategories = ref<Category[] | null>(null);

const getCategories = async () => {
  try {
    const {data: getCategoriesData, error: getCategoriesError} = await useApiFetch<Categories>('/categories-tree', {
      method: 'GET',
    })
    if (getCategoriesError.value) {
      console.log(getCategoriesError.value);
    } else if(getCategoriesData.value) {
      dropdownCategories.value = getCategoriesData.value.categories;
    }
  } catch (e) {
    console.error(e);
  }
}

onMounted(async () => {
  await getCategories()
})

const emit = defineEmits(['category-selected'])

const handleCategoryClick = (category: Category) => {
  if (!category.children?.length) {
    emit('category-selected', category.id)
    popoverIsOpen.value = false
  }
}

</script>