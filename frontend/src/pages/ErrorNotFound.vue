<template>
  <div class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div>
      <div class="text-primary" style="font-size: 30vh">
        404
      </div>

      <div class="text-h2 text-primary" style="opacity:.5">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="secondary"
        unelevated
        to="/home"
        label="Home"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ErrorNotFound'
});
</script>
