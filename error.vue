<template>
	<div 
		class="h-screen w-screen flex 
		items-center justify-center 
		flex-col gap-3"
	>
		<h2 class="text-3xl">Произошла ошибка {{ error?.statusCode }}</h2>
		<p class="text-xl">{{ error?.message }}</p>
		<button 
			class="px-4 py-2 bg-purple-500
			dark:bg-purple-400 text-white dark:text-black
			hover:dark:bg-purple-500 hover:bg-purple-400 hover:text-black
			dark:hover:text-white rounded text-lg
			hover:transition-all
			active:scale-95 active:opacity-80"
			@click="toMainPage"
		>
			Вернуться на главную страницу
		</button>
	</div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

const router = useRouter();

const props = defineProps({
	error: Object as () => NuxtError
})

const toMainPage = () => {
	router.push('/');
}
</script>