<template>
  <div class="fullscreen bg-secondary text-center q-pa-md flex flex-center">
    <div class="error-container">
      <div class="text-h1 text-primary error-number">
        404
      </div>

      <div class="text-h4 text-white text-bold q-mt-xl q-mb-md">
        {{ $t('errors.pageNotFound') }}
      </div>

      <div class="text-subtitle1 text-grey-5 q-mb-xl">
        {{ $t('errors.pageNotFoundDescription') }}
      </div>

      <div class="q-mt-lg buttons-container">
        <q-btn
          unelevated
          color="primary"
          :label="$t('buttons.backToHome')"
          to="/home"
          icon="home"
          size="md"
          :class="{ 'full-width': $q.screen.lt.sm }"
        />
        <q-btn
          outline
          color="primary"
          :label="$t('buttons.reportProblem')"
          icon="error_outline"
          size="md"
          :class="{
            'full-width': $q.screen.lt.sm,
            'q-mt-md': $q.screen.lt.sm,
            'q-ml-md': !$q.screen.lt.sm
          }"
          @click="reportProblem"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

defineOptions({
  name: 'ErrorNotFound'
});

const $q = useQuasar();
const { t } = useI18n();

const reportProblem = () => {
  $q.notify({
    color: 'info',
    message: t('notifications.problemReported'),
    icon: 'info'
  });
};
</script>

<style lang="scss" scoped>
.error-container {
  max-width: 550px;
}

.error-number {
  font-size: 10rem;
  font-weight: 700;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1);
  animation: pulse 2s infinite alternate;
}

.error-image {
  max-width: 300px;
  height: auto;
}

@keyframes pulse {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@media (max-width: 599px) {
  .error-number {
    font-size: 6rem;
  }

  .error-image {
    max-width: 200px;
  }
}

.buttons-container {
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media (max-width: 599px) {
    flex-direction: column;
    width: 100%;
  }

  .q-btn {
    min-width: 250px;
  }
}
</style>
