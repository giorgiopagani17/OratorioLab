<template>
  <div>
    <div class="row items-center justify-between bg-secondary" style="border-radius: 12px 12px 0px 0px">
      <q-btn flat round color="white" icon="chevron_left" @click="previousMonth" />
      <div class="text-h6 text-white text-bold">{{ currentMonthYear }}</div>
      <q-btn flat round color="white" icon="chevron_right" @click="nextMonth" />
    </div>

    <div class="row">
      <div v-for="day in daysOfWeek" :key="day"
           class="col text-center q-pa-sm text-bold bg-secondary text-white">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="(day, index) in calendarDays" :key="index"
           class="calendar-day q-pa-sm"
           :class="{ 'other-month': !day.isCurrentMonth }">
        <div class="row items-start justify-between">
          <span :class="{ 'text-weight-medium': day.isToday }">
            {{ day.dayNumber }}
          </span>
        </div>
        <div class="events-wrapper">
          <template v-if="day.events.length">
            <q-badge v-if="day.events.length > 1"
                     color="grey-7"
                     class="event-badge q-mr-xs"
                     rounded
                     @click="showAllEvents(day.events)">
              {{ day.events.length }} {{ $t(`types.${text}`) }}
            </q-badge>
            <q-badge v-if="day.events.length === 1"
                     :color="day.events[0].color"
                     class="event-badge q-mr-xs q-mb-xs"
                     rounded
                     @click="showEventDetails(day.events[0])">
              {{ day.events[0].title }}
            </q-badge>
          </template>
        </div>
      </div>
    </div>

    <InfoCalendarModal v-model="eventDialog" :rowData="selectedEvents" />
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { date } from 'quasar'
import { useI18n } from 'vue-i18n'
import activities from '@/data/activities.json'
import events from '@/data/events.json'
import InfoCalendarModal from '@/components/Modals/components/InfoCalendarModal.vue';

export default defineComponent({
  name: 'EventCalendar',
  components: {InfoCalendarModal},
  props: {
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { t } = useI18n()
    const currentDate = ref(new Date())
    const eventDialog = ref(false)
    const selectedEvents = ref([])

    const items = computed(() => {
      const data = props.type === 'activities' ? activities.activities : events.events
      return data.map(item => ({
        id: item.id,
        title: item.name,
        description: item.description,
        startDate: item.startDate.split('T')[0],
        endDate: item.endDate.split('T')[0],
        price: props.type === 'activities' ? item.targets[0].price : item.price,
        color: 'primary',
        fullData: item
      }))
    })

    const daysOfWeek = computed(() => {
      const days = []
      for(let i = 0; i < 7; i++) {
        days.push(t(`calendar.daysOfWeek.${i}`))
      }
      return days
    })

    const currentMonthYear = computed(() => {
      const month = currentDate.value.getMonth()
      const year = currentDate.value.getFullYear()
      const translatedMonth = t(`calendar.months.${month}`)
      return `${translatedMonth} ${year}`
    })

    const getEventsForDay = (dateStr) => {
      return items.value.filter(event => {
        const currentDay = new Date(dateStr).getTime()
        const eventStart = new Date(event.startDate).getTime()
        const eventEnd = new Date(event.endDate).getTime()

        return currentDay >= eventStart && currentDay <= eventEnd
      })
    }

    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      let firstDayOfWeek = firstDay.getDay()
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

      const days = []

      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(year, month - 1, prevMonthLastDay - i)
        const formattedDate = date.formatDate(prevDate, 'YYYY-MM-DD')
        days.push({
          dayNumber: prevMonthLastDay - i,
          isCurrentMonth: false,
          isToday: false,
          events: getEventsForDay(formattedDate)
        })
      }

      const today = new Date()
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i)
        const formattedDate = date.formatDate(currentDate, 'YYYY-MM-DD')
        days.push({
          dayNumber: i,
          isCurrentMonth: true,
          isToday: date.isSameDate(currentDate, today),
          events: getEventsForDay(formattedDate)
        })
      }

      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i)
        const formattedDate = date.formatDate(nextDate, 'YYYY-MM-DD')
        days.push({
          dayNumber: i,
          isCurrentMonth: false,
          isToday: false,
          events: getEventsForDay(formattedDate)
        })
      }

      return days
    })

    const previousMonth = () => {
      currentDate.value = date.subtractFromDate(currentDate.value, { months: 1 })
    }

    const nextMonth = () => {
      currentDate.value = date.addToDate(currentDate.value, { months: 1 })
    }

    const showEventDetails = (event) => {
      selectedEvents.value = [event]
      eventDialog.value = true
    }

    const showAllEvents = (events) => {
      selectedEvents.value = events
      eventDialog.value = true
    }

    return {
      currentDate,
      daysOfWeek,
      currentMonthYear,
      calendarDays,
      previousMonth,
      nextMonth,
      eventDialog,
      selectedEvents,
      showEventDetails,
      showAllEvents,
      text: props.type
    }
  }
})
</script>

<style lang="scss" scoped>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: #e0e0e0;
  border: 1px solid #e0e0e0;
  width: 100%;
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  overflow: hidden;
}

.calendar-day {
  background-color: white;
  min-height: 65px;
  max-height: 100px;
  position: relative;
  padding: 8px;
  transition: background-color 0.2s ease;
  overflow: hidden;
}

.calendar-day:hover {
  background-color: #f5f5f5;
}

.other-month {
  color: #999;
  background-color: #f8f8f8;
}

.event-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 4px);
  width: fit-content;
  transition: opacity 0.2s ease;
}

.events-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  max-height: calc(100% - 24px); /* Leave space for date number */
  overflow: hidden; /* Hide overflow */
}

.event-badge:hover {
  opacity: 0.9;
}

.row .col:first-child {
  border-top-left-radius: 0;
}

.row .col:last-child {
  border-top-right-radius: 0;
}

@media (max-width: 600px) {
  .calendar-grid {
    font-size: 0.85rem;
  }

  .calendar-day {
    min-height: 70px;
    max-height: 70px;
  }

  .event-badge {
    font-size: 0.7rem;
    padding: 1px 4px;
  }

  .text-h6 {
    font-size: 1rem !important;
  }

  .row .col {
    padding: 4px !important;
  }
}

@media (max-width: 400px) {
  .calendar-grid {
    font-size: 0.75rem;
  }

  .calendar-day {
    min-height: 60px;
    max-height: 60px;
  }

  .events-wrapper {
    margin-top: 2px;
    gap: 1px;
  }

  .event-badge {
    font-size: 0.65rem;
    padding: 1px 3px;
  }
}
</style>
