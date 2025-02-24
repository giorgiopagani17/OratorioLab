import { defineStore } from 'pinia';

interface Target {
  name: string;
  price: number;
  startYear: number;
  endYear: number;
}

interface EventActivity {
  name: string;
  description: string;
  note: string;
  maxParticipants: number;
  startingDate: string;
  endingDate: string;
  image?: string;
  targets?: Target[];
}

export const useEventsActivitiesStore = defineStore('eventsActivities', {
  state: () => ({
    eventsActivities: [] as EventActivity[],
    eventsActivitiesIndex: localStorage.getItem('eventsActivitiesIndex') || '0',
  }),
  actions: {
    addEventActivity(eventActivity: Omit<EventActivity, 'image' | 'targets'>) {
      this.eventsActivitiesIndex = (parseInt(this.eventsActivitiesIndex) + 1).toString();
      this.eventsActivities.push({ ...eventActivity, image: '', targets: [] });
      localStorage.setItem('eventsActivities', JSON.stringify(this.eventsActivities));
    },
    addImage(index: number, image: string) {
      if (this.eventsActivities[index]) {
        this.eventsActivities[index].image = image;
        localStorage.setItem('eventsActivities', JSON.stringify(this.eventsActivities));
      }
    },
    addTargets(index: number, targets: Target[]) {
      if (this.eventsActivities[index]) {
        this.eventsActivities[index].targets = targets;
        localStorage.setItem('eventsActivities', JSON.stringify(this.eventsActivities));
      }
    },
    clearEventActivities() {
      this.eventsActivities = [];
      this.eventsActivitiesIndex = '0';
      localStorage.removeItem('eventsActivities');
      localStorage.removeItem('eventsActivitiesIndex');
    },
  },
});
