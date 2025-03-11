<template>
  <q-page class="row items-center justify-evenly q-pa-md">
    <div :class="{'w-95': $q.screen.gt.sm, 'q-py-sm w-100': $q.screen.lt.md}">
      <BodySection>
        <template v-slot:leftHeader>
          <div class="flex items-center">
            <q-btn
              flat
              round
              color="white"
              icon="arrow_back"
              size="sm"
              @click="router.push(`/${isEvent ? 'events' : 'activities'}/view`)"
            />
            <span class="q-ml-xs">
              {{ $t(`menu.${props.section}`) }}
            </span>
          </div>
        </template>


        <div class="q-pa-sm full-width">
          <div v-if="eventActivity">
            <div class="row q-col-gutter-lg">
              <div class="col-12 col-lg-8">
                <div class="row q-col-gutter-lg">
                  <div class="col-12 col-sm-5">
                    <q-card class="no-shadow" style="border-radius: 12px">
                      <q-img
                        :src="eventActivity.image"
                        class="rounded-borders full-width"
                        style="max-height: 350px; object-fit: cover"
                      >
                        <div class="absolute-bottom text-subtitle2 bg-secondary-7 text-white q-pa-xs">
                          <div class="row items-center">
                            <q-icon name="event" size="xs" class="q-mr-xs" />
                            {{ formatDates(eventActivity.startDate, eventActivity.endDate) }}
                          </div>
                        </div>
                      </q-img>
                    </q-card>
                  </div>

                  <div class="col-12 col-sm-7">
                    <q-card flat bordered class="full-height" style="border-radius: 12px">
                      <q-card-section>
                        <div class="row items-center q-mb-md">
                          <q-icon name="badge" color="secondary" size="sm" class="q-mr-sm" />
                          <div class="text-h6 text-secondary text-bold">{{ eventActivity.name }}</div>
                        </div>

                        <q-separator class="q-my-sm" />

                        <div class="row q-mb-sm">
                          <div class="col-4 text-weight-bold text-secondary">Data:</div>
                          <div class="col-8">{{ formatDates(eventActivity.startDate, eventActivity.endDate) }}</div>
                        </div>

                        <div class="row q-mb-sm">
                          <div class="col-4 text-weight-bold text-secondary">Ora:</div>
                          <div class="col-8">{{ formatHours(eventActivity.startDate) }}</div>
                        </div>

                        <div class="row q-mb-sm">
                          <div class="col-4 text-weight-bold text-secondary">Luogo:</div>
                          <div class="col-8">Oratorio S. Maria</div>
                        </div>

                        <div class="row q-mb-sm">
                          <div class="col-4 text-weight-bold text-secondary">Note:</div>
                          <div class="col-8">{{ eventActivity.note || 'Nessuna nota' }}</div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>
              </div>

              <div class="col-xs-12 col-sm-6 col-lg-4">
                <q-card flat bordered class="full-height" style="border-radius: 12px">
                  <q-card-section class="bg-tertiary full-height column">
                    <div class="col">
                      <div class="text-h6 text-weight-bold text-secondary q-mb-md">
                        Informazioni
                      </div>

                      <div class="row q-mb-md items-center">
                        <div class="col-auto">
                          <q-icon name="group" color="secondary" size="sm" />
                        </div>
                        <div class="col q-ml-md flex items-center">
                          <div class="text-weight-bold text-secondary">Organizzatore:</div>
                          <div class="q-ml-md">Chiesa di Bergamo</div>
                        </div>
                      </div>

                      <div class="row q-mb-md items-center">
                        <div class="col-auto">
                          <q-icon name="phone" color="secondary" size="sm" />
                        </div>
                        <div class="col q-ml-md flex items-center">
                          <div class="text-weight-bold text-secondary">Telefono:</div>
                          <div class="q-ml-md">3924444141</div>
                        </div>
                      </div>

                      <div class="row q-mb-md items-center">
                        <div class="col-auto">
                          <q-icon name="euro" color="primary" size="sm" />
                        </div>
                        <div class="col q-ml-md flex items-center">
                          <div class="text-weight-bold text-primary">Prezzo {{ isEvent ? 'Evento' : 'Attività' }}:</div>
                          <div class="q-ml-md" style="font-size: 16px">{{ eventActivity.price }}€</div>
                        </div>
                      </div>
                    </div>

                    <div class="col-auto q-mt-auto">
                      <q-btn
                        color="primary"
                        class="full-width"
                        @click="navigateTo('/subscriptions')"
                        icon="how_to_reg"
                      >
                        Vedi Iscrizioni
                      </q-btn>
                    </div>
                  </q-card-section>
                </q-card>
              </div>

              <div class="col-xs-12 col-sm-6 col-lg-12">
                <q-card flat bordered class="full-height" style="border-radius: 12px">
                  <q-card-section class="full-height">
                    <div class="text-h6 text-weight-bold text-secondary q-mb-md flex items-center">
                      <q-icon name="description" color="secondary" size="sm" class="q-mr-sm" />
                      Descrizione
                    </div>
                    <p class="text-body1 q-ma-none">{{ eventActivity.description }}</p>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <div v-else class="text-center q-pa-xl">
            <q-icon name="error_outline" size="4rem" color="grey-7" />
            <div class="text-h6 text-grey-7 q-mt-md">Nessun Evento Trovato</div>
            <q-btn
              color="primary"
              class="q-mt-lg"
              @click="router.push(`/${isEvent ? 'events' : 'activities'}/view`)"
              icon="arrow_back"
              label="Torna alla lista"
            />
          </div>
        </div>
      </BodySection>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import activities from '@/data/activities.json';
import events from '@/data/events.json';
import BodySection from '@/components/Sections/BodySection.vue';

const props = defineProps<{
  id: number;
  section: string;
}>();

const route = useRoute();
const router = useRouter();
const isEvent = computed(() => route.path.includes('events'));
const eventActivity = computed(() => {
  const data = isEvent.value ? events.events : activities.activities;
  const item = data.find(item => item.id === props.id);

  if (!item) return null;

  return {
    id: item.id,
    name: item.name,
    description: item.description,
    note: item.notes,
    startDate: item.startDate,
    endDate: item.endDate,
    image: item.image || 'https://cdn.quasar.dev/img/paris.jpg',
    price: 'targets' in item ? item.targets[0].price : item.price
  };
});

const formatDates = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const formattedStart = start.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  if (!endDate || startDate >= endDate) {
    return formattedStart;
  }

  const end = new Date(endDate);
  const formattedEnd = end.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  });

  return `${formattedStart} - ${formattedEnd}`;
};

const formatHours = (dateString: string): string => {
  return dateString.split('T')[1].substring(0, 5);
};

const navigateTo = (path: string) => {
  router.push('/' + props.section + '/view/' + props.id + path);
};
</script>
