<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div style="width: 90%">
      <div class="container flex justify-center q-mb-lg" style="padding: 12px">
        <div class="flex items-center justify-center q-pr-sm border-right-grey-custom">
          <q-btn v-for="button in buttons" :key="button.title" color="primary" class="button" style="width: 160px;">
            {{ button.title }}
          </q-btn>
        </div>
        <div class="flex items-center justify-center q-pl-sm">
          <div class="blue-container">
            ORATORIO S. MARIA
          </div>
        </div>
      </div>

      <div class="q-mt-lg container-border">
        <div class="bg-secondary text-bold text-white q-py-sm q-pl-md container-header">
          Ultimi Eventi
        </div>
        <div class="flex items-center justify-center q-pa-md container-body">
          <q-card v-for="card in cards" :key="card.title" class="card">
            <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
              <div class="absolute-bottom text-h6">
                {{ card.title }}
              </div>
            </q-img>

            <q-card-section>
              {{ card.caption }}
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">

defineOptions({
  name: 'HomePage'
});

interface Card {
  title: string;
  caption: string;
  icon: string;
  link: string;
}

interface Button {
  title: string;
  action: string;
}

const cards: Card[] = [
  {
    title: 'Docs1',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Docs2',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Docs3',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  }
];


const buttons: Button[] = [
  {
    title: 'Attività',
    action: 'https://quasar.dev'
  },
  {
    title: 'Eventi',
    action: 'https://quasar.dev'
  },
  {
    title: 'Cassa',
    action: 'https://quasar.dev'
  },
  {
    title: 'Persone',
    action: 'https://quasar.dev'
  }
];
</script>
