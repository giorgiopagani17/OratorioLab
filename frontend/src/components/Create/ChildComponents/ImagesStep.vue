<template>
  <div class="containers">
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

        <div v-if="croppedImage" class="preview-container">
          <h6 class="q-ma-none">Anteprima immagine ritagliata</h6>
          <q-img
            :src="croppedImage"
            spinner-color="primary"
            style="width: 300px; height: 300px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

const selectedImage = ref<string | null>(null);
const croppedImage = ref<string | null>(null);
const cropperRef = ref();
const imageSize = ref({ width: 0, height: 0 });

// Compute default size based on image dimensions
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
</script>

<style lang="scss">
.containers {
  width: 100%;
  min-height: 400px;
}

.containers-wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 7.5%;
  padding: 1rem;
  justify-content: center;
  min-height: 400px;
}

.fixed-square-container {
  width: 400px;
  height: 320px;
  position: relative;
}

/* Style for the q-uploader to make it square */
.square-uploader {
  width: 400px !important;
  height: 320px !important;
}

/* Style for the cropper container */
.cropper-wrapper {
  width: 400px;
  height: 320px;
  border-radius: 8px;
  overflow: hidden; /* This ensures the rounded corners are visible */
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

/* Make sure the q-uploader internal layout fills the square */
:deep(.q-uploader) {
  height: 100%;
}

:deep(.q-uploader__input) {
  height: 100%;
}

:deep(.q-uploader__list) {
  height: 100%;
}

/* Add rounded corners to the cropper image */
:deep(.vue-advanced-cropper) {
  border-radius: 12px;
}

:deep(.vue-advanced-cropper__image) {
  border-radius: 12px;
}

/* Mobile responsiveness */
@media (max-width: 1270px) {
  .containers-wrapper {
    flex-direction: column;
    gap: 1rem;
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
