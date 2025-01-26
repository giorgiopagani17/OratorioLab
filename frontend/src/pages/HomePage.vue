<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div>
      <div class="flex items-center justify-center q-pb-lg button-container">
        <q-btn v-for="button in buttons" :key="button.title" class="button bg-white">
          {{ button.title }}
        </q-btn>
      </div>
      <div class="flex items-center justify-center q-mt-lg">
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
</script>004AAD

<style lang="scss">
  .card {
    width: 300px;
    height: 350px;
    margin: 15px;
  }

  .button {
    margin: 15px;
    width: 240px;
    height: 125px;
    font-size: 22.5px;
    font-weight: bold;
    color: $primary;

    &:hover {
      transform: scale(1.1) !important;
    }
  }

  .button-container {
    border-bottom: solid 2px $secondary;
  }
</style>
