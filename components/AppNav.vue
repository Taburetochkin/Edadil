<template>
  <UHorizontalNavigation
    :links="links"
    :ui="{
      wrapper: 'md:top-0 sm:bottom-0 bg-white dark:bg-gray-900 overflow-hidden w-full sm:h-[50px] md:h-[100px] grid grid-cols-[17%,66%,17%] items-center border-gray-200 dark:border-gray-700',
      base: 'md:text-md lg:text-lg font-medium',
      label: 'sm:hidden md:block',
      container: 'gap-4 flex items-center sm:justify-center lg:justify-center',
      active: 'text-black dark:text-white after:bg-purple-500 dark:after:bg-purple-400 after:rounded-full',
      inactive: 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:transition-all',
      icon: {
        base: 'sm:w-6 sm:h-6 md:w-5 md:h-5',
        active: 'text-black dark:text-white',
        inactive: 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
      },
      disabled: 'cursor-not-allowed opacity-50'
    }"
    class="md:border-b-2 sm:border-t-2 sm:mt-[120px] md:mt-0 md:border-t-0 border-black dark:border-gray-700 fixed overflow-hidden"
    :class="{
      'hidden': useNav.visible
    }"
  />
  
  <UModal 
    v-model="isTelegramWidgetOpen"
    :ui="{
      width: 'w-full sm:max-w-lg sm:w-[90vw]'
    }"
  >
    <UCard 
      :ui="{ 
        base: 'overflow-hidden',
        rounded: 'rounded-xl',
        ring: 'ring-1 ring-gray-200 dark:ring-gray-700',
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        background: 'bg-white dark:bg-gray-900',
        header: {
          base: 'bg-white dark:bg-gray-900',
          padding: 'px-4 py-4 sm:px-6'
        },
        body: {
          base: 'bg-white dark:bg-gray-900',
          padding: 'px-4 py-4 sm:px-6'
        },
        footer: {
          base: 'bg-white dark:bg-gray-900',
          padding: 'px-4 py-4 sm:px-6'
        }
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Авторизация
          </h3>
          <UButton 
            color="gray" 
            variant="ghost" 
            icon="i-heroicons-x-mark-20-solid" 
            class="-my-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            :ui="{ rounded: 'rounded-full' }"
            @click="isTelegramWidgetOpen = false" 
          />
        </div>
      </template>
      
      <div class="flex w-full flex-col gap-4 items-center justify-center py-2">
        <TelegramLoginWidget 
          telegram-login="TESTMUPbot" 
          @callback="auth"
          radius="20"
        />
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center px-2">
          Войдите через Telegram для доступа ко всем функциям
        </p>
      </div>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
const isTelegramWidgetOpen = ref(false);
const isProfileDisabled = ref(false);
const userStore = useMyUserStore();
const tokenStore = useMyTokenStore();
const headerStore = useMyHeaderStore();
const useNav = useMyNavStore();

const toast = useToast();

const computedHeader = computed(() => headerStore.headerValue);
const computedIcon = computed(() => headerStore.headerIcon);
const computedAvatar = computed(() => headerStore.headerAvatar);

const auth = async (user: any) => {
  await userStore.getUserData(user);
  await tokenStore.sendAuthRequest();
  isTelegramWidgetOpen.value = false;
};

const router = useRouter();

const handleProfileClick = () => {
  if (headerStore.headerValue === 'Вход') {
    isTelegramWidgetOpen.value = true;
  } else {
    // Блокируем кнопку на 5 секунд
    isProfileDisabled.value = true;
    setTimeout(() => {
      isProfileDisabled.value = false;
    }, 5000);

    toast.add({
      title: 'Вы уверены, что хотите выйти?',
      timeout: 5000,
      actions: [
        {
          label: 'Выйти',
          click: () => {
            userStore.clearUserData();
            tokenStore.clearTokenData();
            headerStore.exit();
            toast.add({
              title: 'Вы вышли из аккаунта.',
            });
          },
          variant: 'solid',
          color: 'purple'
        }
      ]
    });
  }
};

const links = computed(() => [
  [
    {
      label: 'Технодил',
      icon: 'i-material-symbols-robot-outline',
      click: () => {
        router.push('/');
      }
    }
  ], 
  [
    {
      label: 'Главная',
      icon: 'i-material-symbols-home',
      to: '/'
    },
    {
      label: 'Сравнение',
      icon: 'i-material-symbols-compare-arrows-rounded',
      to: '/compare'
    },
    {
      label: 'Избранное',
      icon: 'i-material-symbols-light-favorite',
      to: '/favourites'
    },
  ],
  [
    {
      label: computedHeader.value,
      icon: computedIcon.value,
      avatar: computedAvatar.value,
      disabled: isProfileDisabled.value && headerStore.headerValue !== 'Вход',
      click: handleProfileClick
    }
  ]
]);
</script>
