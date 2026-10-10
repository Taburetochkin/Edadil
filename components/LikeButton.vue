<template>
  <button
    @click="toggleFavourites(cardId)"
    class="
      p-2 rounded-full transition-all duration-300 
      focus:outline-none flex items-center justify-center
      active:scale-95 
    "
    :class="{
      'text-gray-400 xl:hover:text-red-500': !modelValue,  
      'text-red-500': modelValue,
    }"
    aria-label="Лайк"
  >
    <UIcon 
      name="i-material-symbols-light-favorite" 
      class="w-6 h-6 transition-transform"
      :class="{
        'xl:hover:scale-110': !modelValue,  
        'scale-125': modelValue,
        'animate-ping': isAnimating,
      }"
    />
  </button>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  cardId: {
    type: String,
    default: '000'
  }
})

const emit = defineEmits(['update:modelValue'])

const isAnimating = ref(false)

const favouritesStore = useMyFavouritesStore();

const toggleLike = () => {
  const newValue = !props.modelValue
  emit('update:modelValue', newValue)
  
  if (newValue) {
    isAnimating.value = true
    setTimeout(() => {
      isAnimating.value = false
    }, 400)
  }
}

const toggleFavourites = async (id: string) => {
  if (!props.modelValue) {
    const {data: addToFavouritesData, error: addToFavouritesError} = await useApiFetch('/favourites', {
      method: 'POST',
      body: JSON.stringify({
        product_id: id
      })
    });
    if (addToFavouritesError.value) {
      useStatusCodeCheck(addToFavouritesError.value?.statusCode);
    }
    else if (addToFavouritesData.value) {
      toggleLike();
      favouritesStore.appendFavourites(id);
    }
  } else if(props.modelValue) {
    const {data: deleteFromFavouritesData, error: deleteFromFavouritesError} = await useApiFetch('/favourites', {
      method: 'DELETE',
      query: {
        product_id: id
      }
    });
    if (deleteFromFavouritesError.value) {
      useStatusCodeCheck(deleteFromFavouritesError.value?.statusCode);
    }
    else if (deleteFromFavouritesData.value) {
      toggleLike();
      favouritesStore.deleteFavourites(id);
    }
  }
}
</script>