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
      // Validation logic here...
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
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
}

input[type='email'],
input[type='password'] {
  margin-bottom: 3rem;
}

.pw-flex {
  display: flex;
  align-items: center;
}

.info-icon {
  cursor: pointer;
  font-size: 2rem;
  margin-left: 1rem;
}

.infoIcondiv {
  position: relative;
}

.info-list {
  position: absolute;
  transform: translateX(-45%);
  background-color: #fff;
  color: black;
  border: 1px solid var(--dark-button-blue);
  padding-top: 0; 
  padding-left: 2rem;
  padding-bottom: 2rem;
  width: 26rem;
  box-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
  z-index: 10;
  margin-top: 1rem;
}

.info-p {
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 1.8rem;
  color: black;
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
  margin-top: 1rem;
}

.delete-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

</style>
