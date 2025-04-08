<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'q-py-sm w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <BodySection>
        <template v-slot:leftHeader>
          <q-tabs
            v-model="activeTab"
            class="text-white tabs-fixed-width"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
            scrollable
          >
            <q-tab
              v-for="tab in tabs"
              :key="tab.name"
              :name="tab.name"
              :label="$t(`settings.tabs.${tab.name}`)"
              :icon="tab.icon"
            />
          </q-tabs>
        </template>

        <q-tab-panels v-model="activeTab" animated style="width: 100%;">
          <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
            <OratorioSettingTab v-if="tab.name === 'general'" />
            <UserSettingTab v-if="tab.name === 'users'" />
          </q-tab-panel>
        </q-tab-panels>
      </BodySection>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BodySection from '@/components/Sections/BodySection.vue';
import OratorioSettingTab from '@/pages/Settings/Tabs/OratorioSettingTab.vue';
import UserSettingTab from '@/pages/Settings/Tabs/UsersSettingTab.vue';

defineOptions({
  name: 'SettingsPage'
});

interface Tab {
  name: string;
  icon?: string;
}

const activeTab = ref('general');

const tabs = ref<Tab[]>([
  { name: 'general', icon: 'settings' },
  { name: 'events', icon: 'event' },
  { name: 'activities', icon: 'local_activity' },
  { name: 'currency', icon: 'attach_money' },
  { name: 'targets', icon: 'ads_click' },
  { name: 'users', icon: 'people' },
  { name: 'notifications', icon: 'notifications' }
]);
</script>

<style lang="scss" scoped>
:deep(.q-tabs__arrow) {
  color: var(--q-primary);
  background-color: white;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

:deep(.q-tabs) {
  min-width: 100%;

}

:deep(.tabs-fixed-width) {
  width: auto;
}

:deep(.q-tab) {
  min-width: auto;
}

:deep(.q-tab-panel) {
  height: 550px;
  padding: 4px 16px 4px 16px !important;
}
</style>
