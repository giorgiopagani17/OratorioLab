<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">

      <HeaderSection
        leftColXs="col-12"
        leftColMd="col-md-3"
        rightColXs="col-12"
        rightColMd="col-md-9">

        <template v-slot:left>
          <div class="blue-container margin-bottom-responsive text-center text-truncate show-gt-md">
            {{ oratorio }}
          </div>
        </template>

        <template v-slot:right>
          <div class="q-px-sm col-3" v-for="button in buttons" :key="button.title">
            <ResponsiveButton
              :text="$t(`buttons.${button.title}`)"
              :icon="button.icon"
              @click="navigateTo(button.action)"
            />
          </div>
        </template>
      </HeaderSection>

      <BodySection class="q-mt-lg">
        <template v-slot:leftHeader>
          {{ $t('titles.latestEvents')}}
        </template>

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
      </BodySection>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import ResponsiveButton from '@/components/Buttons/ResponsiveButton.vue';
import BodySection from '@/components/Sections/BodySection.vue';

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
    title: 'people',
    action: 'users',
    icon: 'people'
  },
  {
    title: 'events',
    action: 'events',
    icon: 'event'
  },
  {
    title: 'activities',
    action: 'activities',
    icon: 'local_activity'
  },
  {
    title: 'cash',
    action: 'cash',
    icon: 'payments'
  }
];

const navigateTo = (url: string) => {
  router.push(`/${url}`);
};
</script>
