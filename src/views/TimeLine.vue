<template>
<CatHeader />

  <main class="container">
    <h2 class="title">Timeline</h2>
      <div v-for="(item, index) in sortedEvents" :key="item">
        <h3 v-if="isNewDate(item.startDate, index)" class="week">
          {{ weekNumber(item.startDate) }} {{ item.startDate.slice(0, 10) }}
        </h3>
        <h3 class="weekline">{{ item.category.charAt(0).toUpperCase() + item.category.slice(1) }}</h3>
        <p class="value-name">
          {{ item.name }}
        </p>
        <h3>{{ item.to }}</h3>
        <p class="value-startdate">Start: {{ item.startDate.slice(13, 18) }}</p>
      </div>

    <router-link :to="{ path: '/trip/' + this.$route.params.id }"
      ><button>Back to Trip</button></router-link
    >
  </main>
</template>

<script>
import CatHeader from '@/components/CatHeader.vue';
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripData: {},
      allEvents: []
    }
  },
  components: {
    CatHeader
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
 
      let daynr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      let weekday = todaydate.getDay()
      let weekday2 = daynr[parseInt(weekday)]
 
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
button {
  margin-top: auto; 
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
  font-weight: 350;
}

.weekline {
  border-top: 2px solid var(--green-travel);
  text-align: left;
  font-size: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  padding-top: 0.5rem;
  font-weight: 300;
}

.title {
  color: black;
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
  margin-bottom: 3rem;
}

.container {
  background-color: var(--yellow-calendar);
}
</style>
