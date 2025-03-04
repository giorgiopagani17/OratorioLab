<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <div class="row container q-px-lg q-py-md">
        <div class="col-12 col-md-3 q-my-auto  lt-md">
          <div class="q-px-sm q-my-sm">
            <div class="blue-container text-center text-truncate">
              {{ oratorio }}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-9 border-right-grey-responsive">
          <div class="row justify-center">
            <div class="col-3 col-sm-6 col-md-3 q-px-sm" v-for="button in buttons" :key="button.title">
              <q-btn
                color="primary"
                class="button full-width flex-center"
                @click="navigateTo(button.action)"
              >
                <div class="hide-1274 flex-center">
                  <q-icon v-if="isIconVisible" class="gt-sm hide-icon" :name="button.icon" />
                  <span v-else class="gt-sm">{{ $t(`buttons.${button.title}`) }}</span>
                </div>
                <span class="show-1274">{{ $t(`buttons.${button.title}`) }}</span>
                <span class="lt-md gt-xs">{{ $t(`buttons.${button.title}`) }}</span>
                <q-icon class="lt-sm" :name="button.icon" />
              </q-btn>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-3 q-my-auto padding-left-responsive gt-sm">
          <div class="q-px-sm">
            <div class="blue-container text-center text-truncate">
              {{ oratorio }}
            </div>
          </div>
        </div>
      </div>

      <div class="q-mt-lg container-border">
        <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
          {{ $t('titles.latestEvents') }}
        </div>
        <div class="flex items-center justify-center q-pa-md container-body">
          <q-card v-for="card in cards" :key="card.title" class="card">
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
              <div class="absolute-bottom text-h6">
                {{ card.title }}
              </div>
            </q-img>

            <q-card-section>
              {{ card.caption }}
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {useDetailsStore} from '@/stores/details';
import {computed} from 'vue';

defineOptions({
  name: 'HomePage'
});

interface Card {
  title: string;
  caption: string;
  icon: string;
  link: string;
}

interface Button {
  title: string;
  action: string;
  icon: string;
}

const oratorio = 'ORATORIO';
const router = useRouter();
const detailsStore = useDetailsStore();
const isIconVisible = computed(() => {
  return detailsStore.leftDrawerOpen === 'true';
});

const cards: Card[] = [
  {
    title: 'Docs1',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Docs2',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Docs3',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  }
];

const buttons: Button[] = [
  {
    title: 'activities',
    action: 'activities',
    icon: 'local_activity'
  },
  {
    title: 'events',
    action: 'events',
    icon: 'event'
  },
  {
    title: 'cash',
    action: 'cash',
    icon: 'payments'
  },
  {
    title: 'people',
    action: 'users',
    icon: 'people'
  }
];

const navigateTo = (url: string) => {
  router.push(`/${url}`);
};
</script>
