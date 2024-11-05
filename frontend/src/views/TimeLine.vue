<template>
<CatHeader />

  <main class="container">
    <h2>Timeline</h2>
      <div v-for="(item, index) in sortedEvents" :key="item">
        <h4 v-if="isNewDate(item.startDate, index)" class="weekday">
          {{ weekNumber(item.startDate) }} {{ item.startDate.slice(0, 10) }}
        </h4>
        <h4 class="type-of">{{ item.category.charAt(0).toUpperCase() + item.category.slice(1) }}</h4>
        <div class="activity-item">
        <h3>
          {{ item.name }}
        </h3>
        <p>Start: {{ item.startDate.slice(13, 18) }}</p>
        </div>
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
.container {
  background-color: var(--yellow-calendar);
}

h2 {
  color: black;
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
}

h3 {
  text-align: left;
  font-size: 2rem;
  text-shadow: none;
}

p {
  font-size: 1.5rem;
  margin: 0rem;
  line-height: 2rem; 
}

.activity-item {
margin-bottom: 2rem;
}

.weekday {
  border-bottom: 2px solid var(--green-travel);
  text-align: left;
  padding-bottom: 0.3rem;
  margin-bottom: 0.5rem;
  font-weight: 350;
}

.weekday:first-of-type {
  margin-top: 0;
}

.weekday + .weekday {
  margin-top: 5rem;
}

.type-of {
  text-align: left;
  margin-bottom: 0.5rem;
  padding-top: 1rem;
}
</style>
