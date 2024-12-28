<template>
    <div v-if="isModalOpen" class="overlay-mask" @click="closeDialog"></div>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logotype" />
  </header>
  <main class="start-page-main">
    <h1>Herding Cats</h1>
    <h2>Travel App</h2>
    <h3>Manage the Impossible</h3>
    <div class="start-button-input">
      <router-link :to="{ name: 'login' }"><button>Log In</button></router-link>
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
     <dialog class="info-box" ref="test-info">
      <h2>
        Welcome to<br>
        Herding Cats
      </h2>
      <p>
        To test the app:  
      </p>
      <p>
        Type in Trip ID: "12345" and press Go to Trip.
      </p>
      <p>
        Test user:
      </p>
      <p>
        Login: john@doe.de<br>
        Password: john1234
      </p>
      <button class="cancel-btn" @click="closeDialog">Got it</button>
    </dialog>
    <section>
     <button @click="openDialog">Help</button>
    </section>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripId: '',
      disableGoBtn: true,
      isModalOpen: false 
    }
  },

  methods: {
    openDialog() {
      this.isModalOpen = true;
      if (this.$refs['test-info']) {
        this.$refs['test-info'].showModal();
      }
    },

    closeDialog() {
      this.isModalOpen = false;
      if (this.$refs['test-info']) {
        this.$refs['test-info'].close();
      }
    },

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
  async created() {
    await this.state.loadTripIds()
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

.info-box h2 {
  color: black;
}
</style>
