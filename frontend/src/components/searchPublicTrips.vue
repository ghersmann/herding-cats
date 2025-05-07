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
          {{ trip.tripTitle }}
        </p>
      </li>
    </router-link>
    <button @click.prevent="resetSearch" class="reset-btn">Reset</button>
  </section>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  name: 'searchPublicTrips',
  props: {},
  data() {
    return {
      searchField: '',
      disableGoBtn: true,
      state: herdingCatsstore()
    }
  },
  methods: {
    async searchPublicTrip() {
      // Ensure trip titles are loaded
      await this.state.loadTripTitlesAndIds();

      const query = this.searchField.trim().toLowerCase();

      // Filter trips based on searchField
      this.state.userSearchedTrips = this.state.allTripTitles.filter(trip =>
      trip.tripTitle && trip.tripTitle.toLowerCase().includes(query)
      );
      
      this.searchField = ''
      this.disableGoBtn = true
      return this.state.userSearchedTrips;
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
  width: 28rem;
  min-height: 17rem;
  padding: 1rem 2rem;
  margin: 0.7rem auto;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
}

.reset-btn {
margin-top: auto;
}
</style>
