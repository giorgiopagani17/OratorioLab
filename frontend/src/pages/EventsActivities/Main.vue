<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-pt-sm w-100': $q.screen.lt.md}">
      <div class="container flex justify-center q-mb-lg" style="padding: 12px">
        <div class="flex items-center justify-center q-pr-sm border-right-grey-custom">
          <q-btn color="secondary" class="button" @click="navigateTo('/create')">
            {{ $t(`buttons.${props.type}Create`) }}
          </q-btn>
        </div>
        <div class="flex items-center justify-center q-pl-sm">
          <q-btn v-for="button in buttons" :key="button.title" @click="navigateTo(button.action)" color="primary" class="button">
            {{ $t(`buttons.${button.title}`) }}
          </q-btn>
        </div>
      </div>

      <Calendar :type="props.type"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar/Calendar.vue';
import { useRouter } from 'vue-router';
import { defineProps, computed } from 'vue';

defineOptions({
  name: 'UserPage'
});

interface Button {
  title: string;
  action: string;
}

const props = defineProps<{ type: string }>();
const router = useRouter();

const buttons: Button[] = [
  {
    title: computed(() => props.type === 'events' ? 'eventsView' : 'activitiesView').value,
    action: '/view'
  },
  {
    title: computed(() => props.type === 'events' ? 'spaceCreate' : 'groupsCreate').value,
    action: computed(() => props.type === 'events' ? '/space' : '/groups').value,
  },
  {
    title: 'financialBalance',
    action: '/balance'
  }
];

const navigateTo = (url: string) => {
  if(props.type){
    router.push(`/${props.type}${url}`);
  }
};
</script>

<style lang="scss">
.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
