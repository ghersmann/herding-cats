<template>
  <header>
    <img src="../assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>
  <main class="container">
    <h2 class="title">Timeline</h2>
    <div class="line">
      <div v-for="(item, index) in sortedEvents" :key="item">
        <h3 v-if="isNewDate(item.startDate, index)" class="week">
          {{ weekNumber(item.startDate) }} {{ item.startDate.slice(0, 10) }}
        </h3>
        <h3 class="weekline">{{ item.category }}</h3>
        <p class="value-name">
          {{ item.name }}
        </p>
        <h3>{{ item.to }}</h3>
        <p class="value-startdate">{{ item.startDate.slice(13, 18) }}</p>
      </div>
    </div>

    <router-link :to="{ path: '/trip/' + this.$route.params.id }"
      ><button>Back to Trip</button></router-link
    >
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripData: {},
      allEvents: []
    }
  },
  computed: {
    sortedEvents() {
      return this.mergeAndSortEvents.slice().sort((a, b) => {
        const [dayA, monthA, yearA, timeA] = a.startDate.split(/[.\s-]+/)
        const [dayB, monthB, yearB, timeB] = b.startDate.split(/[.\s-]+/)

        const dateA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`)
        const dateB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`)

        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          console.error('Invalid date format:', a.startDate, b.startDate)
          return 0
        }

        return dateA - dateB
      })
    },
    mergeAndSortEvents() {
      if (Object.keys(this.tripData).length > 0) {
        const middleData = this.tripData
        const details = middleData.details
        const filteredDetails = Object.values(details).flatMap((items) =>
          items.filter((item) => item.startDate)
        )
        return filteredDetails.filter(
          (item) =>
            item.category === 'activity' ||
            item.category === 'transport' ||
            item.category === 'lodging'
        )
      } else {
        console.log('error')
        return []
      }
    }
  },
  methods: {
    isNewDate(startDate, currentIndex) {
      // Check if current date is different from the previous date
      if (currentIndex === 0) {
        // Always show the date header for the first item
        return true
      } else {
        // Compare current date with the previous date
        const currentDate = startDate.slice(0, 10)
        const previousDate = this.sortedEvents[currentIndex - 1].startDate.slice(0, 10)
        return currentDate !== previousDate
      }
    },
    weekNumber(startDate) {
      //object with current date
      const year = startDate.slice(6, 10)
      const month = startDate.slice(3, 5)
      const day = startDate.slice(0, 2)
      const time = startDate.slice(13, 18)
      const reconvertedDate = year + '-' + month + '-' + day + 'T' + time
      const todaydate = new Date(reconvertedDate)
      //object für den 1. Januar des jetzigen Jahres
      // let oneJan = new Date(todaydate.getFullYear(), 0, 1)
      // // number of days between 1. Januar and today (24 Std./Tag, 60 min./std., 60 sec./min, 1000 Millisekunden/ sec.
      // let numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000))
      // Kalenderwoche:
      let daynr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      let weekday = todaydate.getDay()
      let weekday2 = daynr[parseInt(weekday)]
      // let result = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7)
      return weekday2
    }
  },

  async created() {
    await this.state.loadTripData(this.$route.params.id)
    this.tripData = this.state.tripData[0]
  }
}
</script>

<style scoped>
.list {
  margin-top: 2rem;
}
.list-item {
  display: block;
}
.value-name {
  margin: 0;
}
.value-startdate {
  margin-top: 0.5rem;
  margin-bottom: 3rem;
  font-size: 1.5rem;
}
.week {
  text-align: left;
}

.weekline {
  border-top: 2px solid white;
  text-align: left;
  font-size: 2rem;
}

.container {
  margin: 0.7rem auto;
  background-color: var(--yellow-calendar);
  min-height: 10rem;
}

.title {
  color: black;
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
  margin-bottom: 2rem;
}

.container {
  background-color: var(--pink-background);
}
</style>
