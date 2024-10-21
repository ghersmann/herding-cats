<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-large.svg" width="200px" alt="Herding Cats Logo" />
    <h2>Login</h2>
  </header>
  <main class="container">
    <label for="e-mail"><h3 class="required">E-Mail</h3></label>
    <input type="email" id="e-mail" v-model="email" placeholder=" example@example.com" />
    <div class="row">
      <label for="pw" class="info">
        <div><h3 class="required">Password</h3></div>
        <div class="infoIcondiv">
          <span class="info-icon">&#9432;</span>
          <span class="info-list">
            <p>Password must contain:</p>
            <ul>
              <li>min. 8 characters</li>
              <li>min. 1 uppercase letter</li>
              <li>min. 1 lowercase letter</li>
              <li>min. 1 digit</li>
            </ul>
          </span>
        </div>
      </label>
    </div>
    <input type="password" id="pw" v-model="password" />
    <button @click="logIn()">LogIn</button>
    <router-link :to="{ name: 'home' }">
        <button>Back to Start Page</button></router-link
      >
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
    }
  },

  methods: {
    async validation() {
      try {
        // Make an API request to fetch the user by email
        const response = await fetch(`${this.state.apiUrl}/users?email=${this.email}`);
        const user = await response.json();
        
        if (response.ok && user) {
          // If user is found, validate the password
          if (user.password === this.password) {
            // Store user in Pinia store and localStorage
            this.state.user = user;
            localStorage.setItem('loggedUser', JSON.stringify(user));
            this.state.tripData = [];
            this.state.loadUserTripData(); // Load user trip data
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
      } else {
        // Alert is handled in the validation method
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
  height: 22.7rem;
}
.container {
  background-color: var(--pink-activities);
  min-height: auto;
}

.info-icon {
  cursor: pointer;
  font-size: large;
}

.info-list {
  position: absolute;
  visibility: hidden;
  top: 100%;
  left: 0;
  background-color: #fff;
  color: black;
  text-align: left;
  border: 1px solid var(--dark-button-blue);
  padding: 1rem;
  width: 26rem;
  height: 15rem;
  margin: 0;
}

.info-list ul li {
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 1.5rem;
  padding-left: 20px;
  text-indent: -20px;
}

.infoIcondiv {
  margin-top: 5px;
  width: 10%;
  float: left;
}

.infoIcondiv {
  position: relative;
}

.infoIcondiv:hover .info-list {
  visibility: visible;
}

.row {
  display: inline;
}
</style>
