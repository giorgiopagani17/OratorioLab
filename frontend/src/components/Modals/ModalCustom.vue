<template>
  <q-dialog
    v-model="localModelValue"
    :persistent="persistent"
    :maximized="maximized"
    :full-height="fullHeight"
    :full-width="fullWidth"
    :seamless="seamless"
    @hide="onHide"
    :position="position"
  >
    <q-card
      class="modal-custom q-pa-md"
      :style="{ width: width, maxWidth: maxWidth, minWidth: minWidth }"
    >
      <div class="modal-header q-px-sm" v-if="showHeader">
        <div class="row items-center justify-between q-pb-sm no-wrap">
          <div class="text-bold ellipsis" :class="`text-${titleColor}`" style="font-size: 25px">{{ title }}</div>
          <q-btn
            v-if="showCloseButton"
            flat
            round
            dense
            icon="close"
            color="grey-7"
            @click="closeModal"
            class="q-ml-sm"
          />
        </div>
        <q-separator v-if="showHeaderSeparator" />
      </div>

      <q-card-section class="q-py-none q-mt-sm flex-grow" :class="{ 'q-pt-md': !showHeader || !showHeaderSeparator }">
        <slot></slot>
      </q-card-section>

      <q-card-actions v-if="$slots.actions" class="modal-actions" align="right">
        <slot name="actions"></slot>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  titleColor: {
    type: String,
    default: 'primary'
  },
  persistent: {
    type: Boolean,
    default: false
  },
  maximized: {
    type: Boolean,
    default: false
  },
  fullHeight: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  seamless: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: 'auto'
  },
  maxWidth: {
    type: String,
    default: '80vw'
  },
  minWidth: {
    type: String,
    default: '300px'
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  showHeaderSeparator: {
    type: Boolean,
    default: true
  },
  position: {
    type: String as () => 'standard' | 'top' | 'bottom' | 'left' | 'right',
    default: 'standard',
    validator: (val: string) => ['standard', 'top', 'bottom', 'left', 'right'].includes(val)
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const localModelValue = ref(props.modelValue);

watch(() => props.modelValue, (newVal) => {
  localModelValue.value = newVal;
});

watch(() => localModelValue.value, (newVal) => {
  emit('update:modelValue', newVal);
});

const closeModal = () => {
  localModelValue.value = false;
  emit('close');
};

const onHide = () => {
  emit('close');
};

</script>

<style lang="scss" scoped>
.modal-custom {
  border-radius: 12px;
  display: flex;
  flex-direction: column;

  .modal-header {
    padding-bottom: 8px;
  }

  .flex-grow {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
}
</style>
