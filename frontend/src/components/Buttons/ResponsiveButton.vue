<template>
  <q-btn
    :color="props.color || (props.active ? 'secondary' : 'primary')"
    class="button full-width flex-center"
    @click="onClick"
  >
    <div class="hide-1274 flex-center">
      <q-icon class="gt-sm" :name="props.icon" />
    </div>
    <span class="show-1274">{{ props.text }}</span>
    <span class="lt-md gt-xs">{{ props.text }}</span>
    <q-icon class="lt-sm" :name="props.icon" />
  </q-btn>
</template>

<script setup lang="ts">
interface Props {
  text: string;
  icon: string;
  active?: boolean;
  translateKey?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  active: false,
  translateKey: '',
  color: ''
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const onClick = () => {
  emit('click');
};
</script>
