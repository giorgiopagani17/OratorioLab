<template>
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
                  <div class="col-4 text-weight-bold text-secondary">{{ $t('labels.date') }}:</div>
                  <div class="col-8">{{ formatDates(eventActivity.startDate, eventActivity.endDate) }}</div>
                </div>

                <div class="row q-mb-sm">
                  <div class="col-4 text-weight-bold text-secondary">{{ $t('labels.time') }}:</div>
                  <div class="col-8">{{ formatHours(eventActivity.startDate) }}</div>
                </div>

                <div class="row q-mb-sm">
                  <div class="col-4 text-weight-bold text-secondary">{{ $t('labels.place') }}:</div>
                  <div class="col-8">Oratorio S. Maria</div>
                </div>

                <div class="row q-mb-sm">
                  <div class="col-4 text-weight-bold text-secondary">{{ $t('labels.notes') }}:</div>
                  <div class="col-8">{{ eventActivity.notes || 'Nessuna nota' }}</div>
                </div>

                <div v-if="eventActivity.isReview" class="row q-mb-sm">
                  <div class="col-4 text-weight-bold text-secondary">{{ $t('labels.review') }}:</div>
                  <div class="col-8 overflow-auto" style="max-height: 63px;">
                    <ul class="q-pa-none q-ma-none" style="list-style-type: disc; padding-left: 1.5rem;">
                      <li v-for="(activityReview, index) in eventActivity.activitiesReview" :key="index" class="q-mb-xs text-primary">
                        <span class="text-black">{{ activityReview.name }}</span>
                      </li>
                    </ul>
                  </div>
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
                {{ $t('titles.info') }}
              </div>

              <div class="row q-mb-md items-center">
                <div class="col-auto">
                  <q-icon name="group" color="secondary" size="sm" />
                </div>
                <div class="col q-ml-md flex items-center">
                  <div class="text-weight-bold text-secondary q-mr-md">{{ $t('labels.organizer') }}:</div>
                  <div>Chiesa di Bergamo</div>
                </div>
              </div>

              <div class="row q-mb-md items-center">
                <div class="col-auto">
                  <q-icon name="phone" color="secondary" size="sm" />
                </div>
                <div class="col q-ml-md flex items-center">
                  <div class="text-weight-bold text-secondary">{{ $t('labels.telephone') }}:</div>
                  <div class="q-ml-md">3924444141</div>
                </div>
              </div>

              <div class="row q-mb-md items-center">
                <div class="col-auto">
                  <q-icon name="euro" color="primary" size="sm" />
                </div>
                <div class="col q-ml-md flex items-center">
                  <div class="text-weight-bold text-primary">{{ $t(`labels.${type}Price`) }}:</div>
                  <div class="q-ml-md" style="font-size: 16px">{{ eventActivity.price }}€</div>
                </div>
              </div>
            </div>

            <div class="col-auto q-mt-auto">
              <q-btn
                v-if="isAdmin"
                color="primary"
                class="full-width"
                @click="navigateTo('/subscriptions')"
                icon="how_to_reg"
              >
                {{ $t('buttons.viewSubscriptions') }}
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
              {{ $t('labels.description') }}
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
      v-if="isAdmin"
      color="primary"
      class="q-mt-lg"
      @click="router.push(`/${props.section}/view`)"
      icon="arrow_back"
    />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { EventActivity } from '@/interfaces/EventActivity';

const props = defineProps<{
  id?: number;
  section: string;
  eventActivity: EventActivity;
  isAdmin: boolean;
}>();

const type = props.section === 'events' ? 'event' : 'activity';
const router = useRouter();
const idEventActivity = props.id ?? 0;
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
  if(idEventActivity != 0 && props.isAdmin) {
    router.push('/' + props.section + '/view/' + idEventActivity + path);
  }
};
</script>
