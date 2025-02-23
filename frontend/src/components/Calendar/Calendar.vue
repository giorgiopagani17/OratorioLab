<template>
  <div>
    <!-- Header -->
    <div class="row items-center justify-between bg-secondary" style="border-radius: 12px 12px 0px 0px">
      <q-btn flat round color="white" icon="chevron_left" @click="previousMonth" />
      <div class="text-h6 text-white">{{ currentMonthYear }}</div>
      <q-btn flat round color="white" icon="chevron_right" @click="nextMonth" />
    </div>

    <!-- Days of week -->
    <div class="row">
      <div v-for="day in daysOfWeek" :key="day"
           class="col text-center q-pa-sm text-weight-medium bg-secondary text-white">
        {{ day }}
      </div>
    </div>

    <!-- Calendar grid -->
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

    <!-- Event Details Dialog -->
    <q-dialog v-model="eventDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ $t('calendar.eventDetails') }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedEvent">
          <div class="text-h6">{{ selectedEvent.title }}</div>
          <div class="text-subtitle2">{{ formatEventDateTime(selectedEvent) }}</div>
          <div class="q-mt-md">{{ selectedEvent.description }}</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue'
import { date } from 'quasar'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'EventCalendar',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { locale } = useI18n()
    const currentDate = ref(new Date())
    const eventDialog = ref(false)
    const selectedEvent = ref(null)

    const events = ref([
      {
        id: 1,
        title: 'Meeting',
        description: 'Team meeting',
        startDate: date.formatDate(new Date(), 'YYYY-MM-DD'),
        endDate: date.formatDate(date.addToDate(new Date(), { days: 2 }), 'YYYY-MM-DD'),
        color: 'primary'
      },
      {
        id: 2,
        title: 'Meeting',
        description: 'Team meeting',
        startDate: date.formatDate(new Date(), 'YYYY-MM-DD'),
        endDate: date.formatDate(date.addToDate(new Date(), { days: 2 }), 'YYYY-MM-DD'),
        color: 'primary'
      }
    ])

    const daysOfWeek = computed(() =>
      locale.value === 'it'
        ? ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    )

    const monthNames = {
      it: {
        'January': 'Gennaio', 'February': 'Febbraio', 'March': 'Marzo',
        'April': 'Aprile', 'May': 'Maggio', 'June': 'Giugno',
        'July': 'Luglio', 'August': 'Agosto', 'September': 'Settembre',
        'October': 'Ottobre', 'November': 'Novembre', 'December': 'Dicembre'
      },
      en: {
        'January': 'January', 'February': 'February', 'March': 'March',
        'April': 'April', 'May': 'May', 'June': 'June',
        'July': 'July', 'August': 'August', 'September': 'September',
        'October': 'October', 'November': 'November', 'December': 'December'
      }
    }

    const currentMonthYear = computed(() => {
      const month = date.formatDate(currentDate.value, 'MMMM')
      const year = date.formatDate(currentDate.value, 'YYYY')
      return `${monthNames[locale.value][month]} ${year}`
    })

    const getEventsForDay = (currentDate) => {
      return events.value.filter(event => {
        const start = new Date(event.startDate)
        const end = new Date(event.endDate)
        const current = new Date(currentDate)
        return current >= start && current <= end
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

      // Previous month days
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const prevDate = new Date(year, month - 1, prevMonthLastDay - i)
        days.push({
          dayNumber: prevMonthLastDay - i,
          isCurrentMonth: false,
          isToday: false,
          events: getEventsForDay(date.formatDate(prevDate, 'YYYY-MM-DD'))
        })
      }

      // Current month days
      const today = new Date()
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const currentDate = new Date(year, month, i)
        days.push({
          dayNumber: i,
          isCurrentMonth: true,
          isToday: date.isSameDate(currentDate, today),
          events: getEventsForDay(date.formatDate(currentDate, 'YYYY-MM-DD'))
        })
      }

      // Next month days
      const remainingDays = 42 - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const nextDate = new Date(year, month + 1, i)
        days.push({
          dayNumber: i,
          isCurrentMonth: false,
          isToday: false,
          events: getEventsForDay(date.formatDate(nextDate, 'YYYY-MM-DD'))
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
      selectedEvent.value = event
      eventDialog.value = true
    }

    const showAllEvents = (events) => {
      selectedEvent.value = events[0]
      eventDialog.value = true
    }

    const formatEventDateTime = (event) => {
      const startDate = new Date(event.startDate)
      const endDate = new Date(event.endDate)
      const formatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
      const lang = locale.value === 'it' ? 'it-IT' : 'en-US'
      return `${startDate.toLocaleDateString(lang, formatOptions)} - ${endDate.toLocaleDateString(lang, formatOptions)}`
    }

    return {
      currentDate,
      daysOfWeek,
      currentMonthYear,
      calendarDays,
      previousMonth,
      nextMonth,
      eventDialog,
      selectedEvent,
      showEventDetails,
      showAllEvents,
      formatEventDateTime,
      text: props.type
    }
  }
})
</script>

<style scoped>
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
  position: relative;
  padding: 8px;
  transition: background-color 0.2s ease;
}

.calendar-day:hover {
  background-color: #f5f5f5;
}

.other-month {
  color: #999;
  background-color: #f8f8f8;
}

.events-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}

.event-badge {
  font-size: 0.75rem;
  padding: 2px 6px;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  transition: opacity 0.2s ease;
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
</style>
