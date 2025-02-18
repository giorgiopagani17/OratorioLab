<template>
  <div class="progress-container" style="padding: 1px">
    <div class="step-container">
      <div class="progress-overlay">
        <div
          class="progress-fill"
          :style="{ width: `${progressWidth}%` }"
        ></div>
      </div>

      <div
        v-for="(step, index) in steps"
        :key="step.title"
        class="step-wrapper"
      >
        <!-- Progress Line -->
        <div
          v-if="index < steps.length - 1"
          class="progress-line"
          :class="{ 'completed': currentStep > index }"
        ></div>

        <!-- Step Circle -->
        <div
          class="step-circle"
          :class="{
            'current': currentStep === index,
            'completed': currentStep > index
          }"
        >
          <q-icon
            v-if="currentStep > index"
            name="check"
            size="sm"
            color="white"
          />
          <span v-else>{{ index + 1 }}</span>
        </div>

        <!-- Step Title -->
        <div
          class="step-title"
          :class="{
            'current': currentStep === index,
            'completed': currentStep > index
          }"
        >
          {{ $t(`steps.${step.title}`) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'StepProgressBar',

  setup() {
    const currentStep = ref(0)
    const route = useRoute();
    const steps = ref([]);
    const { t } = useI18n();

    const activitySteps = [
      { title: 'activity', completed: false },
      { title: 'image', completed: false },
      { title: 'targetPrice', completed: false },
      { title: 'review', completed: false },
    ]

    const eventSteps = [
      { title: 'place', completed: false },
      { title: 'event', completed: false },
      { title: 'image', completed: false },
      { title: 'review', completed: false },
    ]

    if (route.path.includes('activities')) {
      steps.value = activitySteps;
    } else {
      steps.value = eventSteps;
    }

    const progressWidth = ref(0)

    const updateProgressWidth = () => {
      progressWidth.value = ((currentStep.value + 0.5) / 4) * 100
    }

    const nextStep = () => {
      if (steps.value && currentStep.value < steps.value.length - 1) {
        steps.value[currentStep.value].completed = true;
        currentStep.value++;
        updateProgressWidth();
      } else if (steps.value && !steps.value[steps.value.length - 1].completed) {
        steps.value[steps.value.length - 1].completed = true;
        currentStep.value++;
        middleStep();
      }
    };

    const prevStep = () => {
      if (currentStep.value > 0) {
        steps.value[currentStep.value - 1].completed = false
        currentStep.value--
        updateProgressWidth()
      }
    }

    const middleStep = () => {
      progressWidth.value += 12.5
    }

    onMounted(() => {
      middleStep()
    })

    return {
      currentStep,
      steps,
      progressWidth,
      nextStep,
      prevStep,
      t
    }
  }
})
</script>

<style lang="scss">
.progress-container {
  width: 90%;
  margin: 0 auto;
}

.step-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  margin: 2rem 0;
}

.progress-overlay {
  position: absolute;
  top: 15px;
  left: 0;
  width: 100%;
  height: 2px;
  background: #e0e0e0;
  z-index: 1;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: $primary;
  transition: width 0.3s ease-in-out;
}

.step-wrapper {
  flex: 1;
  text-align: center;
  position: relative;
}

.progress-line {
  position: absolute;
  top: 15px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: transparent;
  z-index: 1;
}

.step-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e0e0e0;
  color: $secondary;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
}

.step-circle.current {
  background: white;
  color: $primary;
  border-color: $primary;
  transform: scale(1.2);
  box-shadow: 0 0 0 4px rgba(255, 144, 77, 0.2);
}

.step-circle.completed {
  background: $primary;
  color: white;
  border-color: $primary;
}

.step-title {
  margin-top: 8px;
  font-size: 0.9rem;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  top: 0;
}

.step-title.current {
  color: $primary;
  font-weight: 600;
  top: -4px;
}

.step-title.completed {
  color: $primary;
}

/* Animazioni */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 144, 77, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 144, 77, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 144, 77, 0);
  }
}

.step-circle.current {
  animation: pulse 2s infinite;
}

/* Animazione per il cambio di step */
.step-circle {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-title {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effetto hover sui cerchi */
.step-circle:not(.completed):not(.current):hover {
  transform: scale(1.1);
  background: #f5f5f5;
}

/* Effetto hover sui bottoni */
.q-btn {
  transition: transform 0.2s ease;
}

.q-btn:not(:disabled):hover {
  transform: translateY(-2px);
}
</style>
