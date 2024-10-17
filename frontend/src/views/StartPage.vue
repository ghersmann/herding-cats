<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logotype" />
  </header>
  <main class="start-page-main">
    <h1>Herding Cats</h1>
    <h2>Travel App</h2>
    <h3>Manage the Impossible</h3>
    <div class="start-button-input">
      <router-link :to="{ name: 'login' }"><button>LogIn</button></router-link>
      <router-link :to="{ name: 'signup' }"><button>Sign Up</button></router-link>
      <form @submit.prevent="checkValidId(tripId)">
        <input
          type="text"
          name="trip-id"
          id="trip-id"
          placeholder=" # Enter a Trip ID"
          v-model="tripId"
          @input="checkInputLength"
        />
        <button :disabled="disableGoBtn" :class="{ 'btn-disabled': disableGoBtn }">
          Go to Trip
        </button>
      </form>
    </div>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      tripId: '',
      disableGoBtn: true,
      allTripIds: [],
      state: herdingCatsstore()
    }
  },

  methods: {
    checkInputLength() {
      this.disableGoBtn = this.tripId.trim().length <= 3
    },

    async checkValidId(tripId) {
      if (this.state.allTripIds.length === 0) {
        await this.state.loadTripIds();
      }  
      if (this.state.allTripIds.includes(tripId)) {
        this.$router.push({ name: 'trip', params: { id: tripId } });
        return true;
      } else {
        alert("Invalid Trip ID. Please check the ID.");
        return false;
      }
    },

  },
  created() {
    this.state.loadTripIds()
  }
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100vw;
  height: 25.7rem;
}
img {
  padding: 2rem;
  margin-left: 1.5rem;
}
h2 {
  margin-top: 3rem;
}
h3 {
  margin-top: 2rem;
  color: white;
  font-weight: 400;
  text-shadow: 0px 0.2rem 0.2rem rgba(255, 255, 255, 0.25);
}
input[type='text'] {
  margin-top: 3rem;
}
.start-page-main {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 50vh;
}
.start-button-input {
  margin-top: auto;
}

.container {
  min-height: 30rem;
  background-color: var(--pink-activities);
}
</style>
