<template>
  <BodySection>
    <template v-slot:leftHeader>
      {{ $t(section === 'activities' ? 'titles.teamsParticipants' : 'titles.participants') }}
    </template>

    <template v-slot:rightHeader>
      <span class="text-primary">{{ participants?.length || 0 }} n°</span>
    </template>

    <div v-if="isLoading" class="q-pa-md">
      <q-skeleton type="rect" height="50px" class="q-mb-sm" />
      <q-skeleton type="rect" height="50px" class="q-mb-sm" />
      <q-skeleton type="rect" height="50px" class="q-mb-sm" />
    </div>

    <div v-else class="full-width content-container-informations">
      <div v-if="section === 'activities'" class="q-mb-sm">
        <q-tabs
          v-model="activeTab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="participants" :label="$t('labels.participants')" style="width: 50%"/>
          <q-tab name="teams" :label="$t('labels.teams')" style="width: 50%"/>
        </q-tabs>
      </div>

      <q-tab-panels v-if="section === 'activities'" v-model="activeTab" animated class="content-area-informations">
        <!-- Participants Tab -->
        <q-tab-panel name="participants" class="q-pa-none">
          <q-list separator v-if="displayedParticipants.length > 0">
            <q-item v-for="user in displayedParticipants" :key="user.cf" clickable>
              <q-item-section avatar>
                <UserAvatar
                  :name="user.name"
                  bgColor="primary"
                  textColor="white"
                  :size="'40px'"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ user.name }}</q-item-label>
                <q-item-label caption class="single-line-truncate">{{ user.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge :color="user.paid ? 'positive' : 'negative'">
                  {{ user.paid ? $t('labels.paid') : $t('labels.notPaid') }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
          <EmptyStateDisplay :message="$t('errors.noParticipantsFound')" v-else />
        </q-tab-panel>

        <!-- Teams Tab -->
        <q-tab-panel name="teams" class="q-pa-none">
          <q-list separator v-if="teams.length > 0">
            <q-item v-for="team in teams" :key="team.id" clickable>
              <q-item-section avatar>
                <q-avatar>
                  <img :src="team.image">
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ team.name }}</q-item-label>
                <q-item-label caption class="single-line-truncate">
                  <q-icon name="people" size="xs" /> {{ team.memberCount }} {{ $t('labels.members') }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge color="primary">
                  {{ team.score }} {{ $t('labels.points') }}
                </q-badge>
              </q-item-section>
            </q-item>
          </q-list>
          <EmptyStateDisplay :message="$t('errors.noTeamsFound')" v-else />
        </q-tab-panel>
      </q-tab-panels>

      <div v-else class="content-area-informations">
        <q-list separator>
          <q-item v-for="user in displayedParticipants" :key="user.cf" clickable>
            <q-item-section avatar>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar.png">
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ user.name }}</q-item-label>
              <q-item-label caption class="single-line-truncate">{{ user.email }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-badge :color="user.paid ? 'positive' : 'negative'">
                {{ user.paid ? $t('labels.paid') : $t('labels.notPaid') }}
              </q-badge>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="button-area text-center q-mt-md">
        <q-btn color="primary" :label="$t('buttons.seeAll')" @click="handleNavigateToSubscriptions" />
      </div>
    </div>
  </BodySection>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BodySection from '@/components/Sections/BodySection.vue';
import EmptyStateDisplay from '@/components/Utils/EmptyStateDisplay.vue';
import UserAvatar from '@/components/Avatars/UserAvatar.vue';

interface User {
  name: string;
  email: string;
  cf: string;
  paid?: boolean;
}

interface Team {
  id: number;
  name: string;
  image: string;
  memberCount: number;
  score: number;
}

const props = defineProps<{
  isLoading: boolean;
  participants: User[];
  displayedParticipants: User[];
  navigateToSubscriptionsPage: () => void;
  navigateToTeamsPage: () => void;
  section: string;
}>();

const teams: Team[]  = [
  {
    id: 1,
    name: 'Squadra Blu',
    image: 'https://cdn.quasar.dev/img/mountains.jpg',
    memberCount: 8,
    score: 120
  },
  {
    id: 2,
    name: 'Squadra Rossa',
    image: 'https://cdn.quasar.dev/img/parallax1.jpg',
    memberCount: 7,
    score: 115
  },
  {
    id: 3,
    name: 'Squadra Verde',
    image: 'https://cdn.quasar.dev/img/parallax2.jpg',
    memberCount: 9,
    score: 145
  }
];

const activeTab = ref('participants');

const handleNavigateToSubscriptions = () => {
  if(activeTab.value === 'participants') {
    props.navigateToSubscriptionsPage();
  } else if(activeTab.value === 'teams') {
    props.navigateToTeamsPage();
  }
};
</script>

<style scoped>
.button-area {
  padding: 10px 0;
}
</style>
