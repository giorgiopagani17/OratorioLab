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

        <EventActivityListCard
          class="q-ma-sm"
          v-for="item in upcomingItems"
          :key="item.id"
          :eventActivity="{
          id: item.id,
          name: item.title,
          description: item.caption,
          image: item.img,
          price: item.price,
          startDate: item.startDate,
          endDate: item.endDate,
        }"
          :isDraft="false"
          @click="navigateToDetail(item)"
        />
      </BodySection>

    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import ResponsiveButton from '@/components/Buttons/ResponsiveButton.vue';
import BodySection from '@/components/Sections/BodySection.vue';
import EventActivityListCard from '@/components/Card/EventActivityListCard.vue';
import activities from '@/data/activities.json';
import events from '@/data/events.json';
import {computed} from 'vue';

defineOptions({
  name: 'HomePage'
});

interface Target {
  name: string,
  price: number,
  startYear: number,
  endYear: number
}

interface Card {
  title: string;
  caption: string;
  img: string;
  startDate: string;
  endDate: string;
  targets?: Target[];
  price? : number;
}

interface Button {
  title: string;
  action: string;
  icon: string;
}

interface Card {
  title: string;
  caption: string;
  img: string;
  id?: number;
  type?: 'event' | 'activity';
}

const oratorio = 'ORATORIO';
const router = useRouter();

const upcomingItems = computed<Card[]>(() => {
  const allActivities = activities.activities.map(item => ({
    id: item.id,
    title: item.name,
    caption: item.description,
    img: item.image || 'https://cdn.quasar.dev/img/paris.jpg',
    startDate: item.startDate,
    endDate: item.endDate,
    price: item.targets[0].price || 0,
    type: 'activity' as const
  }));

  const allEvents = events.events.map(item => ({
    id: item.id,
    title: item.name,
    caption: item.description,
    img: item.image || 'https://cdn.quasar.dev/img/paris.jpg',
    startDate: item.startDate,
    endDate: item.endDate,
    price: 0,
    type: 'event' as const
  }));

  const now = new Date().getTime();

  const combined = [...allActivities, ...allEvents]
    .filter(item => new Date(item.startDate).getTime() >= now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  return combined.slice(0, 3);
});

const navigateToDetail = (item: Card) => {
  if (item.id && item.type) {
    const routePrefix = item.type === 'activity' ? 'activities' : 'events';
    router.push(`/${routePrefix}/view/${item.id}`);
  }
};

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
