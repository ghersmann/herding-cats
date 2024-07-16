<template>
  <form>
    <label for="search-field" style="display: none">Search for a trip to join</label>
    <input
      type="text"
      class="icon"
      placeholder="Search for a trip to join"
      id="search-field"
      name="search-field"
      v-model="searchField"
      @input="checkInputLength"
      @keydown.enter.once="searchPublicTrip"
    />
    <button
      @click.prevent="searchPublicTrip"
      :disabled="disableGoBtn"
      :class="{ 'btn-disabled': disableGoBtn }"
    >
      Search
    </button>
  </form>
  <section v-if="state.userSearchedTrips.length > 0" class="search-result">
    <p>Search Results</p>
    <router-link
      v-for="trip in state.userSearchedTrips"
      :key="trip.id"
      :to="{ path: '/trip/' + trip.id }"
    >
      <li class="li-items">
        <p class="search-result-text">
          {{ trip.tripTitle }} <br />{{ trip.tripStart.split(' ')[0] }} -
          {{ trip.tripEnd.split(' ')[0] }}
        </p>
      </li>
    </router-link>
    <button @click.prevent="resetSearch">Reset</button>
  </section>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  name: 'searchPublicTrips',
  props: {},
  data() {
    return {
      allTripData: [],
      searchField: '',
      disableGoBtn: true,
      state: herdingCatsstore()
    }
  },
  methods: {
    async searchPublicTrip() {
      const response = await fetch(this.state.apiUrl + 'events')
      const apiTripData = await response.json()
      this.allTripData = apiTripData
      const searchTermLower = this.searchField.toLowerCase()
      this.state.userSearchedTrips = this.allTripData.filter(
        (event) => event.public === true && event.tripTitle.toLowerCase().includes(searchTermLower)
      )
      this.searchField = ''
      this.disableGoBtn = true
      return this.state.userSearchedTrips
    },
    checkInputLength() {
      this.disableGoBtn = this.searchField.trim().length <= 1
    },
    resetSearch() {
      this.searchField = ''
      this.state.userSearchedTrips = []
      this.disableGoBtn = true
    }
  }
}
</script>

<style scoped>
.search-result-text {
  font-size: 1.5rem;
  line-height: 2rem;
}

.li-items {
  list-style-type: none;
}

.icon {
  padding-left: 3rem;
  background: url(../assets/search-icon.png) no-repeat left;
  background-size: 2rem;
  background-position: 0.5rem;
  background-color: white;
}

.search-result {
  position: relative;
  background-color: var(--gray-accomodation);
  border: 1px solid white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  padding: 1rem 2rem;
  margin: 0.7rem auto;
}

.close-btn {
  position: absolute;
}
</style>
