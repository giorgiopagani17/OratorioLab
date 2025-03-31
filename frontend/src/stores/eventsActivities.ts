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

interface ActivityReview {
  name: string;
  startDate: string;
  endDate: string;
}

interface EventActivity {
  type: string;
  name: string;
  description: string;
  note: string;
  maxParticipants: number;
  place?: Coordinates[];
  startDate: string;
  endDate: string;
  image?: string;
  targets?: Target[];
  isReview?: boolean;
  activitiesReview?: ActivityReview[];
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
    addEventActivity(eventActivity: Partial<EventActivity>) {
      const newEventActivity: EventActivity = {
        type: eventActivity.type || '',
        name: eventActivity.name || '',
        description: eventActivity.description || '',
        note: eventActivity.note || '',
        maxParticipants: eventActivity.maxParticipants || 0,
        startDate: eventActivity.startDate || '',
        endDate: eventActivity.endDate || '',
        place: eventActivity.place || [],
        image: eventActivity.image || '',
        targets: eventActivity.targets || [],
        activitiesReview: eventActivity.activitiesReview || [],
        isReview: eventActivity.isReview || false
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
    addPeriod(index: number, date: {
      startDate: string;
      endDate: string;
    }) {
      console.log(date)
      if (this.eventsActivities[index]) {
        this.eventsActivities[index] = {
          ...this.eventsActivities[index],
          startDate: date.startDate,
          endDate: date.endDate,
        };
        localStorage.setItem('eventsActivities', JSON.stringify(this.eventsActivities));
      }
    },
    addActivityReview(index: number, activitiesReviewData: ActivityReview[]){
      if (this.eventsActivities[index] && activitiesReviewData.length > 0) {
        this.eventsActivities[index].activitiesReview = activitiesReviewData;
        this.eventsActivities[index].isReview = true;

        // Find the earliest start date and latest end date
        let earliestStartDate = new Date(activitiesReviewData[0].startDate);
        let latestEndDate = new Date(activitiesReviewData[0].endDate);

        for (const activity of activitiesReviewData) {
          const startDate = new Date(activity.startDate);
          const endDate = new Date(activity.endDate);

          if (startDate < earliestStartDate) {
            earliestStartDate = startDate;
          }

          if (endDate > latestEndDate) {
            latestEndDate = endDate;
          }
        }

        // Set the event start and end dates
        this.eventsActivities[index].startDate = earliestStartDate.toISOString().slice(0, 19);
        this.eventsActivities[index].endDate = latestEndDate.toISOString().slice(0, 19);

        localStorage.setItem('eventsActivities', JSON.stringify(this.eventsActivities));
      }
    },
    clearActivityReview(index: number) {
      if (this.eventsActivities[index]) {
        this.eventsActivities[index].activitiesReview = [];
        this.eventsActivities[index].isReview = false;
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
