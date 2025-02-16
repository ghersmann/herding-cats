<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-large.svg" width="200px" alt="Herding Cats Logo" />
  </header>
  <main class="container">
    <h2>Login</h2>

        <label for="e-mail" class="required">E-Mail</label>
        <input type="email" id="e-mail" v-model="email" placeholder=" example@example.com" />

  <div class="pw-flex">
  <label for="pw" class="required">Password</label>
  <span class="info-icon" @click="toggleInfo">&#9432;</span>
  <div v-show="showInfo" class="overlay-mask" @click="toggleInfo"></div>
  <div class="infoIcondiv">
    <span class="info-list" v-show="showInfo">
      <p>Password must contain:</p>
      <ul class="info-p">
        <li>min. 8 characters</li>
        <li>min. 1 uppercase letter</li>
        <li>min. 1 lowercase letter</li>
        <li>min. 1 digit</li>
      </ul>
      <button class="delete-btn" @click="toggleInfo">x</button>
    </span>
  </div>
</div>

<input type="password" id="pw" v-model="password" />

        <button @click="logIn()">Log In</button>
        <router-link :to="{ name: 'home' }">
          <button>Back to Start Page</button>
        </router-link>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      state: herdingCatsstore(),
      email: '',
      password: '',
      showInfo: false // State variable to control info visibility
    }
  },

  methods: {
    toggleInfo() {
      this.showInfo = !this.showInfo; // Toggle visibility on click
    },

    async validation() {
    try {
        // Make an API request to fetch the user by email
        const response = await fetch(`${this.state.apiUrl}/users?email=${this.email}`);
        const user = await response.json();

        if (response.ok && user) {
            // If user is found, validate the password
            if (user.password === this.password) {
                // Set expiration time
                const expirationTime = Date.now() + 30 * 60 * 1000;

                // Store user in Pinia store
                this.state.user = user;

                // Store user and expiration time in localStorage
                localStorage.setItem('loggedUser', JSON.stringify(user));
                localStorage.setItem('expiresAt', expirationTime.toString());

                // Clear trip data and load user trip data
                this.state.tripData = [];
                this.state.loadUserTripData(); 

                return true;
            } else {
                // Incorrect password
                alert('Incorrect password.');
                return false;
            }
        } else {
            // User not found
            alert('User not found. Please check your email.');
            return false;
        }
    } catch (error) {
        console.error('Error during login validation:', error);
        alert('Server error. Please try again later.');
        return false;
    }
},

    async logIn() {
      const isValid = await this.validation(); // Wait for validation result
      if (isValid) {
        this.$router.push({ name: 'alltravels' }); // Redirect on successful login
      }
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  margin: 2rem auto;
  width: 100vw;
  height: 18rem;
}

.container {
  background-color: var(--pink-activities);
  min-height: auto;
}

h2 {
  color: black;
}

input[type='email'],
input[type='password'] {
  margin-bottom: 3rem;
}
</style>
