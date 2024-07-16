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
      showList: false
    }
  },

  methods: {
    validation() {
      this.state.user = this.state.userData.find((user) => user.email === this.email)

      if (this.state.user) {
        if (this.state.user.password === this.password) {
          localStorage.setItem('loggedUser', JSON.stringify(this.state.user))
          this.state.tripData = []
          this.state.loadUserTripData()
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },

    logIn() {
      if (this.validation()) {
        this.$router.push({ name: 'alltravels' })
      } else {
        alert('Please make sure your e-mail and password is entered correctly.')
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
