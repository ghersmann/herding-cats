<template>
 <CatHeader />
 
  <main class="container">
      <h3>Hello {{ state.user.name }}!</h3>

    <div class="calendar-list">
      <ul>
        <li v-if="Object.values(state.user.trips).every((array) => array.length === 0)"
        class="calendar-list-item">
        <p>You currently have <br>no cats to herd.</p>
        <p>Start herding.</p>
        <img class="arrow-down" src="@/assets/arrow-white.svg" />
        </li>
        <li class="calendar-list-item" v-for="trip in sortedEvents" :key="trip.id">
          <router-link :to="`/trip/${trip.id}`">
            <p>{{ trip.tripTitle }}</p>
            <br />
            {{ trip.tripStart.split(' ')[0] }} -
            {{ trip.tripEnd.split(' ')[0] }}
          </router-link>
        </li>
      </ul>
    </div>

    <searchPublicTrips />
    <router-link :to="'/NewTrip'"
      ><button class="create-trip-btn">Create New Trip</button></router-link
    >
    <router-link :to="{ name: 'personalnotes' }"
      ><button class="personal-btn">Personal Notes</button></router-link
    >
    <LogoutButton />
  </main>
</template>


<script>
import searchPublicTrips from '@/components/searchPublicTrips.vue'
import { herdingCatsstore } from '@/stores/counter.js'
import LogoutButton from '@/components/LogoutButton.vue'
import CatHeader from '@/components/CatHeader.vue';

export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripDateValue: []
    }
  },
  components: {
    LogoutButton,
    searchPublicTrips,
    CatHeader
  },
  computed: {
    sortedEvents() {
      return this.state.userTrips.slice().sort((a, b) => {
        const [dayA, monthA, yearA, timeA] = a.tripStart.split(/[.\s-]+/)
        const [dayB, monthB, yearB, timeB] = b.tripStart.split(/[.\s-]+/)

        const dateA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`)
        const dateB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`)

        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          console.error('Invalid date format:', a.startDate, b.startDate)
          return 0
        }

        return dateA - dateB
      })
    }
  },
  methods: {
    formatChange() {
      const eventStart = this.state.userTrips.map((trip) => trip.tripStart)
      this.tripDateValue = eventStart.flatMap((dateString) => {
        const parts = dateString.split(' - ')
        const datePart = parts[0].split('.').reverse().join('-')
        const timePart = parts[1]
        const fullDate = new Date(`${datePart}T${timePart}`)
        return fullDate
      })
    },

    async checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        alert('No user logged in. No data to show. Sorry mate.')
        this.$router.push({ name: 'home' })
      } else {
        await this.state.loadUserTripData()
        this.formatChange()
      }
    }
  },
  async created() {
    await this.checkUser()
  }
}
</script>

<style scoped>
.arrow-down {
  width: 2rem;
  margin-top: 2rem;
  transform: rotate(270deg);
}

.container {
  background-color: var(--turqoise-gray-background);
}

.create-trip-btn {
  background-color: var(--green-packing-list);
}

.personal-btn {
  color: black;
  background-color: var(--yellow-calendar);
}

h3 {
  color: white;
  margin-bottom: 4rem;
}

.calendar-list {
  text-align: center;
}

ul li a {
  list-style-position: inside;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 1.2rem;
  color: white;
}

p {
  color: white;
  margin-bottom: 0;
}

.calendar-list-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 28rem;
  margin-bottom: 4rem;
  border-top: 0.1rem solid rgb(193, 193, 193);
}
</style>
