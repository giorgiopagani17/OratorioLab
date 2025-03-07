<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">

      <HeaderSection
        leftColXs="col-3"
        rightColXs="col-9"
      >

        <template v-slot:left>
          <ResponsiveButton
            :text="$t('buttons.create')"
            icon="add"
            color="secondary"
            @click="navigateTo('/create')"
          />
        </template>

        <template v-slot:right>
          <div class="q-px-sm col-4" v-for="button in buttons" :key="button.title">
            <ResponsiveButton
              :text="$t(`buttons.${button.title}`)"
              :icon="button.icon"
              @click="navigateTo(button.action)"
            />
          </div>
        </template>
      </HeaderSection>

      <Calendar :type="type" class="q-mt-lg"/>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import Calendar from '@/components/Calendar/Calendar.vue';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import HeaderSection from '@/components/Sections/HeaderSection.vue';
import ResponsiveButton from '@/components/Buttons/ResponsiveButton.vue';

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
