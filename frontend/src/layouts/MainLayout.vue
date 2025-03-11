<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-secondary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title header class="text-bold text-white" style="font-size: 1.7em">
          Oratori<span class="text-primary">360</span>
        </q-toolbar-title>

        <q-input
          v-model="search"
          dense
          input-style="color: white;"
          :placeholder="$t('placeholders.search')"
          color="white"
          class="custom-input gt-xs"
        >
          <template v-slot:prepend>
            <q-icon name="search" color="white"/>
          </template>
        </q-input>

        <LanguageSwitcher />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      elevated
      class="custom-shadow"
      :width="250"
    >
      <div class="drawer-container">
        <q-scroll-area class="col drawer-scroll">
          <q-list class="q-mt-sm">
            <EssentialLink
              v-for="link in linksList1"
              :key="link.title"
              v-bind="link"
              style="border-radius: 24px"
              :class="{ 'text-primary text-bold': isActiveLink(link.link), 'text-secondary': !isActiveLink(link.link) }"
            />
          </q-list>

          <hr style="border: none; height: 2px; background-color: #004AAD;" />

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

        <div class="drawer-footer">
          <q-btn
            color="primary"
            :label="$t('buttons.logout')"
            class="q-my-md logout-btn"
            style="width: 200px;"
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
import EssentialLink from 'components/EssentialLink.vue';
import LanguageSwitcher from 'components/LanguageSwitcher.vue';
import { EssentialLinkProps } from '@/components/EssentialLink.vue';
import { useRouter, useRoute } from 'vue-router';
import { useDetailsStore } from '@/stores/details';

const { t } = useI18n();
const leftDrawerOpen = ref(false);

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
    title: t('menu.finance'),
    icon: 'attach_money',
    link: '/finance'
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
  leftDrawerOpen.value = !leftDrawerOpen.value;
  detailsStore.setLeftDrawerOpen(leftDrawerOpen.value.toString());
};


const isActiveLink = (link?: string) => {
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

.logout-btn {
  margin: 0 auto;
}

.border-top-primary {
  border-top: 2px solid $primary;
}
</style>
