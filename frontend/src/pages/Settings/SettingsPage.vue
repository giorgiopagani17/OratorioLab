<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <div class="text-h4 q-mb-lg text-bold text-secondary">Settings</div>

      <q-tabs
        v-model="activeTab"
        class="text-secondary"
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

      <q-separator class="q-my-md" />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <div class="text-h6 q-mb-md">{{ $t(`settings.tabs.${tab.name}`) }}</div>
          <p>{{ $t('settings.comingSoon') }}</p>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

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
  { name: 'activities', icon: 'directions_run' },
  { name: 'currency', icon: 'attach_money' },
  { name: 'users', icon: 'people' },
  { name: 'notifications', icon: 'notifications' }
]);
</script>

<style lang="scss" scoped>
.w-95 {
  width: 95%;
}

.w-100 {
  width: 100%;
}

:deep(.q-tabs__arrow) {
  color: var(--q-primary);
  background-color: white;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  margin: auto;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);

}
</style>
