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
            <div class="col-3 col-sm-6 col-md-3 q-px-sm " v-for="button in buttons" :key="button.title">
              <q-btn
                color="primary"
                class="button full-width "
                @click="navigateTo(button.action)"
              >
                <span class="gt-xs text-truncate">{{ $t(`buttons.${button.title}`) }}</span>
                <q-icon class="lt-sm" size="30px" :name="getIcon(button.action)" />
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
}

const oratorio = 'ORATORIO';
const router = useRouter();

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
    action: 'activities'
  },
  {
    title: 'events',
    action: 'events'
  },
  {
    title: 'cash',
    action: 'cash'
  },
  {
    title: 'people',
    action: 'users'
  }
];

const getIcon = (action: string): string => {
  const icons: Record<string, string> = {
    activities: 'local_activity',
    events: 'event',
    cash: 'payments',
    users: 'people'
  };
  return icons[action] || 'help';
};

const navigateTo = (url: string) => {
  router.push(`/${url}`);
};
</script>
