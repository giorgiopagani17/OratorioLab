<template>
  <div class="containers q-my-auto">
    <div class="containers-wrapper">
      <!-- Upload container -->
      <div class="fixed-square-container">
        <q-uploader
          ref="uploader"
          accept="image/*"
          :multiple="false"
          label="Trascina l'immagine qui o clicca per caricare"
          @added="onFileAdded"
          @removed="onFileRemoved"
          class="square-uploader"
          thumbnail-fit="cover"
        >
          <template v-slot:header="scope">
            <div class="q-uploader__header">
              <div class="q-uploader__header-content flex flex-center no-wrap q-px-sm">
                <div class="q-uploader__title">{{ $t('buttons.dragAndDrop') }}</div>

                <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                  <q-uploader-add-trigger />
                  <q-tooltip>Pick Files</q-tooltip>
                </q-btn>
              </div>
            </div>
          </template>
        </q-uploader>
      </div>

      <!-- Cropper/preview container -->
      <div v-if="selectedImage" class="fixed-square-container">
        <div class="cropper-wrapper">
          <Cropper
            class="cropper"
            :src="selectedImage"
            :stencil-props="{
              aspectRatio: 1,
              movable: true,
              resizable: true,
              scalable: true,
              backgroundColor: '#0000ff' // Blue background color
            }"
            :default-size="defaultSize"
            @change="onChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, watch, onMounted, onUnmounted} from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { useEventsActivitiesStore } from '@/stores/eventsActivities';

const selectedImage = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
const cropperRef = ref();
const imageSize = ref({ width: 0, height: 0 });
const store = useEventsActivitiesStore();
const uploader = ref();

const validateInputs = () => {
  const hasErrors = !selectedImage.value;

  window.dispatchEvent(new CustomEvent('inputErrors', {
    detail: { hasErrors }
  }));
};

watch([selectedImage], () => {
  validateInputs();
});

const defaultSize = computed(() => ({
  width: imageSize.value.width,
  height: imageSize.value.height
}));


const onFileAdded = (files: readonly File[]) => {
  if (files.length > 0) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        // Create an image element to get the natural dimensions
        const img = new Image();
        img.onload = () => {
          imageSize.value = {
            width: img.naturalWidth,
            height: img.naturalHeight
          };
        };
        img.src = e.target.result as string;
        selectedImage.value = e.target.result as string;
        croppedImage.value = null;
      }
    };
    reader.readAsDataURL(files[0]);
  }
};

const onFileRemoved = () => {
  resetImage();
};

const onChange = ({ canvas }: { canvas: HTMLCanvasElement }) => {
  cropperRef.value = canvas;
  cropImage();
};

const cropImage = () => {
  if (cropperRef.value) {
    croppedImage.value = cropperRef.value.toDataURL();
  }
};

const resetImage = () => {
  selectedImage.value = null;
  croppedImage.value = null;
  imageSize.value = { width: 0, height: 0 };
};

const saveToLocalStorage = () => {
  if (croppedImage.value) {
    const currentIndex = parseInt(store.eventsActivitiesIndex);
    store.addImage(currentIndex, croppedImage.value);
  }
};

onMounted(async () => {
  window.addEventListener('saveAttributesStep', saveToLocalStorage);
  validateInputs();

  const currentIndex = parseInt(store.eventsActivitiesIndex);
  if (store.eventsActivities[currentIndex]?.image) {
    selectedImage.value = store.eventsActivities[currentIndex].image;
    croppedImage.value = store.eventsActivities[currentIndex].image;

    const response = await fetch(store.eventsActivities[currentIndex].image);
    const blob = await response.blob();
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });

    uploader.value.addFiles([file]);
  }
});

onUnmounted(() => {
  window.removeEventListener('saveAttributesStep', saveToLocalStorage);
});
</script>

<style lang="scss" scoped>
.containers {
  width: 100%;
}

.containers-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7.5%;
  padding: 1rem 1rem 1rem 1rem;
  justify-content: center;
  min-height: 440px;
}

.fixed-square-container {
  width: 400px;
  height: 320px;
  position: relative;
}

.square-uploader {
  width: 400px !important;
  height: 320px !important;
}

.cropper-wrapper {
  width: 400px;
  height: 320px;
  border-radius: 8px;
  overflow: hidden;
}

.cropper {
  height: 320px;
  width: 400px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
  border-radius: 12px;
}

:deep(.q-uploader) {
  height: 100%;
}

:deep(.q-uploader__input) {
  height: 100%;
}

:deep(.q-uploader__list) {
  height: 100%;
}

:deep(.vue-advanced-cropper) {
  border-radius: 12px;
}

:deep(.vue-advanced-cropper__image) {
  border-radius: 12px;
}

@media (max-width: 1270px) {
  .containers-wrapper {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .fixed-square-container {
    width: 100%;
    aspect-ratio: 1;
    max-width: 400px;
    margin: 0 auto;
  }

  .square-uploader {
    width: 100% !important;
    height: 100% !important;
  }

  .cropper-wrapper {
    width: 100%;
    height: 100%;
  }

  .cropper {
    width: 100%;
    height: 100%;
  }
}
</style>
