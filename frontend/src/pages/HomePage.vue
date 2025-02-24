<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div style="width: 90%">
      <div class="container flex justify-center q-mb-lg" style="padding: 12px">
        <div class="flex items-center justify-center q-pr-sm border-right-grey-custom">
          <q-btn
            v-for="button in buttons"
            :key="button.title"
            color="primary"
            class="button"
            style="width: 160px;"
            @click="navigateTo(button.action)"
          >
            {{ $t(`buttons.${button.title}`) }}
          </q-btn>
        </div>
        <div class="flex items-center justify-center q-pl-sm">
          <div class="blue-container">
            {{ oratorio }}
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

const oratorio = 'ORATORIO S. MARIA';
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

const navigateTo = (url: string) => {
  router.push(`/${url}`);
};
</script>
