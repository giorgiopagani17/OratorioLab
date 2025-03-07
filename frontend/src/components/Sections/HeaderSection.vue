<template>
  <div class="row container items-center justify-between q-px-lg q-py-lg">
    <div :class="leftClass" class="border-right-grey-responsive">
      <div class="row justify-center no-wrap w-100">
        <slot name="left"/>
      </div>
    </div>
    <div :class="rightClass" class="padding-left-responsive">
      <div class="row justify-center no-wrap w-100">
        <slot name="right"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';

interface Props {
  leftColXs?: string;
  leftColSm?: string;
  leftColMd?: string;
  leftColLg?: string;
  rightColXs?: string;
  rightColSm?: string;
  rightColMd?: string;
  rightColLg?: string;
}

const props = withDefaults(defineProps<Props>(), {
  leftColXs: 'col-12',
  leftColSm: 'col-3',
  leftColMd: 'col-3',
  leftColLg: 'col-3',
  rightColXs: 'col-12',
  rightColSm: 'col-9',
  rightColMd: 'col-9',
  rightColLg: 'col-9',
  items: () => []
});

const leftClass = computed(() => {
  return [props.leftColXs, props.leftColSm, props.leftColMd, props.leftColLg, 'q-px-sm'];
});

const rightClass = computed(() => {
  return [props.rightColXs, props.rightColSm, props.rightColMd, props.rightColLg, 'row', 'no-wrap'];
});
</script>
