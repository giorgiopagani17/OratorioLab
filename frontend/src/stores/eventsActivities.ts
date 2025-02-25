import { defineStore } from 'pinia';

interface Coordinates {
  latitude: number;
  longitude: number;
  civicNumber: string;
  address: string;
}

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
  place?: Coordinates[];
  startingDate: string;
  endingDate: string;
  image?: string;
  targets?: Target[];
}

export const useEventsActivitiesStore = defineStore('eventsActivities', {
  state: () => {
    const savedActivities = localStorage.getItem('eventsActivities');
    return {
      eventsActivities: savedActivities ? JSON.parse(savedActivities) : [] as EventActivity[],
      eventsActivitiesIndex: localStorage.getItem('eventsActivitiesIndex') || '0',
    };
  },
  actions: {
    addEventActivity(eventActivity: Omit<EventActivity, 'image' | 'targets'>) {
      const newEventActivity: EventActivity = {
        ...eventActivity,
        place: [],
        image: '',
        targets: []
      };
      this.eventsActivities.push(newEventActivity);
      localStorage.setItem('eventsActivities', JSON.stringify(this.eventsActivities));
    },
    addImage(index: number, image: string) {
      if (this.eventsActivities[index]) {
        this.eventsActivities[index].image = image;
        localStorage.setItem('eventsActivities', JSON.stringify(this.eventsActivities));
      }
    },
    addCoordinates(index: number, coordinates: Coordinates[]) {
      if (this.eventsActivities[index]) {
        this.eventsActivities[index].place = coordinates;
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
