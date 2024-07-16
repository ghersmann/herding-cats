<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>
  <div class="container">
    <div class="burger-title">
      <div @mouseover="showSidebar = true" @mouseleave="hideSidebar" class="hamburger-menu">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </div>
      <h3 class="user-name">Hello <br />{{ state.user.name }}!</h3>
    </div>
    <!-- <transition name="slide">
      <div v-show="showSidebar" class="sidebar">
        <ul>
          <li><router-link to="/newtrip">Create new trip</router-link></li>
          <li><router-link to="/notes">Notes</router-link></li>
          <li><router-link to="/logout">Log Out</router-link></li>
        </ul>
      </div>
    </transition> -->

    <div id="app">
      <div class="wrap">
        <ejs-calendar
          id="calendar"
          ref="CalendarInstance"
          :isMultiSelection="isMultiSelection"
          :values="values2"
        ></ejs-calendar>
      </div>
    </div>

    <div class="calendar-list">
      <ul>
        <li class="calendar-list-item" v-for="trip in sortedEvents" :key="trip.id">
          <router-link :to="`/trip/${trip.id}`">
            <p>{{ trip.tripTitle }}</p>
            <br />
            {{ trip.tripStart.split(' ')[0] }} -
            {{ trip.tripEnd.split(' ')[0] }}
          </router-link>

          <span @click="favoriteStatus">
            {{ favStat ? '\ud83d\udda4' : '\u2665\ufe0f' }}
          </span>
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
  </div>
</template>

<script setup>
// import Vue from 'vue'
import { CalendarComponent as EjsCalendar } from '@syncfusion/ej2-vue-calendars'
// import { CalendarPlugin } from '@syncfusion/ej2-vue-calendars'
// Vue.use(CalendarPlugin)
</script>

<script>
import searchPublicTrips from '@/components/searchPublicTrips.vue'
import { herdingCatsstore } from '@/stores/counter.js'
import LogoutButton from '@/components/LogoutButton.vue'

export default {
  data() {
    return {
      showSidebar: false,
      favStat: false,
      isMultiSelection: true,
      state: herdingCatsstore(),
      values: [new Date('1/1/2020'), new Date('1/15/2020')],
      values2: []
    }
  },
  components: {
    LogoutButton,
    searchPublicTrips
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
    /*     hideSidebar() {
      setTimeout(() => {
        this.showSidebar = false
      }, 2000)
    }, */
    favoriteStatus() {
      this.favStat = !this.favStat
    },
    formatChange() {
      const eventStart = this.state.userTrips.map((trip) => trip.tripStart)
      this.values2 = eventStart.flatMap((dateString) => {
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
.hamburger-menu {
  width: 30px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.burger-title {
  display: flex;
  align-items: top;
}

.user-name {
  width: 21rem;
}
.container {
  background-color: var(--green-travel);
}

.create-trip-btn {
  background-color: var(--green-packing-list);
}

.personal-btn {
  color: black;
  background-color: var(--yellow-calendar);
}

.line {
  width: 100%;
  height: 3px;
  margin-top: 5px;
  background-color: white;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background-color: whitesmoke;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding-left: 5px;
}

h3 {
  color: white;
  margin-bottom: 1rem;
}

.slide-enter-active {
  transition: transform 0.3s;
}

.slide-leave-active {
  transition: transform 1s;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-200px);
}

.wrap {
  margin: 10px auto;
  max-width: 250px;
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
  margin-bottom: 2rem;
  border-top: 0.1rem solid var(--dark-button-blue);
}

span {
  padding-left: 1rem;
}
</style>
