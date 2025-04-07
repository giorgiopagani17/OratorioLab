<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title header class="text-bold text-white cursor-pointer" style="font-size: 1.7em" @click="router.push('/home')">
          Oratorio<span class="text-primary">Lab</span>
        </q-toolbar-title>

        <InputSearchCustom
          input-style="color: white;"
          class="custom-input gt-xs"
          v-model="search"
          :isBluContainer="false"
          style="width: 200px"
        />

        <LanguageSwitcher />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState && $q.screen.gt.xs"
      @mouseover="miniState && $q.screen.gt.xs ? miniState = false : null"
      @mouseout="isMiniState && $q.screen.gt.xs ? miniState = true : null"
      :mini-to-overlay="false"
      elevated
      class="custom-shadow"
      :width="250"
      :mini-width="60"
    >
      <div class="drawer-container">
        <q-scroll-area class="col drawer-scroll">
          <q-toolbar-title header class="text-bold text-secondary text-center q-mt-md q-pt-xs lt-md" style="font-size: 1.8em">
            <img src="../assets/logos/PNG/OratorioLAB_Logo-01.png" alt="Logo" style="width: 100%; height: 60px; object-fit: cover;" class="cursor-pointer" @click="router.push('/home')"/>
          </q-toolbar-title>

          <q-list class="q-mt-sm">
            <EssentialLink
              v-for="link in linksList1"
              :key="link.title"
              v-bind="link"
              style="border-radius: 24px"
              :class="{ 'text-primary text-bold': isActiveLink(link.link), 'text-secondary': !isActiveLink(link.link) }"
            />
          </q-list>

          <hr style="border: none; height: 2px; background-color: #E0E0E0;" />

          <q-list class="q-mt-sm">
            <EssentialLink
              v-for="link in linksList2"
              :key="link.title"
              v-bind="link"
              style="border-radius: 24px"
              :class="{ 'text-primary text-bold': isActiveLink(link.link), 'text-secondary': !isActiveLink(link.link) }"
            />
          </q-list>

          <hr style="border: none; height: 2px; background-color: #E0E0E0;" />

          <q-list>
            <EssentialLink
              v-for="link in settingsList"
              :key="link.title"
              v-bind="link"
              style="border-radius: 24px"
              :class="{ 'text-primary text-bold': isActiveLink(link.link), 'text-grey-7': !isActiveLink(link.link) }"
            />
          </q-list>
        </q-scroll-area>

        <div class="drawer-footer" :class="{ 'mini-footer': miniState && $q.screen.gt.xs }">
          <q-btn
            color="primary"
            :label="miniState && $q.screen.gt.xs ? '' : $t('buttons.logout')"
            icon="logout"
            class="q-my-md logout-btn"
            :style="miniState && $q.screen.gt.xs ? 'width: 40px' : 'width: 200px'"
            @click="logout"
          />
        </div>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import EssentialLink from 'components/EssentialLink.vue';
import LanguageSwitcher from 'components/LanguageSwitcher.vue';
import { EssentialLinkProps } from '@/components/EssentialLink.vue';
import { useRouter, useRoute } from 'vue-router';
import { useDetailsStore } from '@/stores/details';
import InputSearchCustom from '@/components/Inputs/InputSearch.vue';

const { t } = useI18n();
const $q = useQuasar();
const leftDrawerOpen = ref(true);
const miniState = ref(false);
const isMiniState = ref(false);

defineOptions({
  name: 'MainLayout'
});

const search = ref<string>('');
const router = useRouter();
const route = useRoute();
const detailsStore = useDetailsStore();

const logout = () => {
  localStorage.clear();
  router.push('/');
};

const linksList1 = computed((): EssentialLinkProps[] => [
  {
    title: t('menu.home'),
    icon: 'home',
    link: '/home'
  },
  {
    title: t('menu.registry'),
    icon: 'people',
    link: '/users'
  },
  {
    title: t('menu.events'),
    icon: 'event',
    link: '/events'
  },
  {
    title: t('menu.activities'),
    icon: 'local_activity',
    link: '/activities'
  }
]);

const linksList2 = computed((): EssentialLinkProps[] => [
  {
    title: t('menu.balance'),
    icon: 'payments',
    link: '/balance'
  },
]);

const settingsList = computed((): EssentialLinkProps[] => [
  {
    title: t('menu.setting'),
    icon: 'settings',
    link: '/settings'
  },
  {
    title: t('menu.pricing'),
    icon: 'payments',
    link: '/pricing'
  },
  {
    title: t('menu.privacyPolicy'),
    icon: 'privacy_tip',
    link: '/privacypolicy'
  },
]);

const toggleLeftDrawer = () => {
  if ($q.screen.gt.xs) {
    miniState.value = !miniState.value;
    isMiniState.value = !isMiniState.value;
    leftDrawerOpen.value = true;
  } else {
    leftDrawerOpen.value = !leftDrawerOpen.value;
  }
  detailsStore.setLeftDrawerOpen(leftDrawerOpen.value.toString());
};

const isActiveLink = (link?: string) => {
  if (link === '/balance') {
    return (route.path === '/balance') ||
      (route.path.startsWith('/balance/') &&
        !route.path.includes('/activities') &&
        !route.path.includes('/events'));
  }

  return link ? route.path.includes(link) : false;
};
</script>

<style lang="scss" scoped>
.q-layout {
  position: fixed;
  width: 100%;
  height: 100vh;
}

.q-page-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}

.drawer-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer-scroll {
  height: calc(100% - 70px);
}

.drawer-footer {
  border-top: 2px solid $primary;
  padding: 1rem;
  text-align: center;
  background: white;
}

.mini-footer {
  display: flex;
  justify-content: center;
  padding: 0.5rem;
}

.logout-btn {
  margin: 0 auto;
}

.border-top-primary {
  border-top: 2px solid $primary;
}
</style>
