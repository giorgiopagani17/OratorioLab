<template>
  <div class="q-mt-lg container-border">
    <div class="bg-secondary text-bold text-white q-py-sm q-px-md container-header">
      <div class="row full-width justify-between items-center">
        <div>
          <slot name="leftHeader"/>
        </div>
        <div>
          <slot name="rightHeader"/>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center q-pa-md container-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
