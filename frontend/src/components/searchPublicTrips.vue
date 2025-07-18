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
  <p>Search Results for: "{{ displaySearchedWord }}"</p>
  
  <ul class="found-item-wrapper">
    <li v-for="trip in state.userSearchedTrips" :key="trip.id" class="li-items">
      <router-link
        :to="{ path: '/trip/' + trip.id }"
        class="trip-link"
      >
        <p class="search-result-text">{{ trip.tripTitle }}</p>
      </router-link>
      <button
        class="save-trip-btn"
        @click="saveTripToList(trip.id)"
        :disabled="state.user.trips.includes(trip.id)"
        :class="{ 'btn-just-saved': justSavedTripIds.includes(trip.id) }"
      >
        {{ justSavedTripIds.includes(trip.id) 
            ? 'Saved!' 
            : (state.user.trips.includes(trip.id) ? 'Saved' : 'Save trip') }}
      </button>
    </li>
  </ul>
  
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
      displaySearchedWord: '',
      disableGoBtn: true,
      justSavedTripIds: [],
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
      
      this.displaySearchedWord = this.searchField
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
    },

    async saveTripToList(tripId) {
      if (!this.state.user.trips.includes(tripId)) {
        this.state.user.trips.push(tripId);
        await this.state.updateUserState(this.state.user.id)
        await this.state.loadUserTripData()

        this.justSavedTripIds.push(tripId);
        setTimeout(() => {
          this.justSavedTripIds = this.justSavedTripIds.filter(id => id !== tripId);
        }, 1500);
      }
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
  display: flex;
  align-items: center;
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
margin-top: 2rem;
}

.save-trip-btn {
  background-color: var(--dark-button-blue);
  width: 4rem;
  height: 3rem;
  border-radius: 0.5rem;
  margin-left: auto;
  margin-right: 0;
  font-size: 1rem;
}

.save-trip-btn:disabled {
  background-color: gray;
  cursor: not-allowed;
  opacity: 0.7;
}

.saved-message {
  font-size: 1.5rem;
  color: var(--dark-button-blue);
  opacity: 1;
  transition: opacity 1.5s ease-out;
}

.animate-saved {
  animation: fadeOut 1.5s forwards;
}

@keyframes fadeOut {
  0% { opacity: 1; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.05); }
}

.btn-just-saved {
  background-color: var(--dark-button-blue);
  color: white;
  animation: pulseFade 1.5s ease-in-out forwards;
}

@keyframes pulseFade {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

</style>
