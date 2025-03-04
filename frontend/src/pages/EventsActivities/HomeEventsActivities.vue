<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <div class="row container q-px-lg q-py-md">
        <div class="col-3 col-sm-3 col-md-3 q-px-sm q-my-auto border-right-grey-responsive">
          <q-btn color="secondary" class="button full-width" @click="navigateTo('/create')" >
            <span class="hide-650">{{ $t(`buttons.create`) }}</span>
            <q-icon class="show-650" name="add" />
          </q-btn>
        </div>
        <div class="col-3 col-sm-3 col-md-3 q-px-sm padding-left-responsive" v-for="button in buttons" :key="button.title">
          <q-btn @click="navigateTo(button.action)" color="primary" class="button full-width">
            <span class="hide-650">{{ $t(`buttons.${button.title}`) }}</span>
            <q-icon class="show-650" :name="button.icon" />
          </q-btn>
        </div>
      </div>

      <Calendar :type="type" class="q-mt-lg"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar/Calendar.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

defineOptions({
  name: 'UserPage'
});


interface Button {
  title: string;
  action: string;
  icon: string;
}

const props = defineProps<{ type: string }>();
const type = computed(() => props.type);
const router = useRouter();

const buttons = computed<Button[]>(() => [
  {
    title: type.value,
    action: '/view',
    icon: 'visibility'
  },
  {
    title: type.value === 'events' ? 'spaceCreate' : 'groupsCreate',
    action: type.value === 'events' ? '/space' : '/groups',
    icon: type.value === 'events' ? 'room' : 'group'
  },
  {
    title: 'financialBalance',
    action: '/balance',
    icon: 'account_balance'
  }
]);

const navigateTo = (url: string) => {
  if(type.value){
    router.push(`/${type.value}${url}`);
  }
};
</script>

<style lang="scss" scoped>
.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
