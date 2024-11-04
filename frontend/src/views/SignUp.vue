<template>
  <header>
    <img class="catlogo" src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logotype" />
  </header>
  <main class="container">
    <h2>Sign Up</h2>

    <form>
      <label class="required">First Name</label>
      <input type="text" v-model="firstname" />

      <label class="required">Last Name</label>
      <input type="text" v-model="lastname" />

      <label class="required">E-Mail</label>
      <input type="email" v-model="email" />

      <label>Address</label>
      <input type="text" v-model="address" />

      <label>Phone</label>
      <input type="text" v-model="phone" />

      <div class="info">
        <label class="required pw">
          Password
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
        <input type="password" v-model="password" />
      </div>

      <label class="required">Confirm Password</label>
      <input type="password" v-model="confirmPassword" />
    </form>

      <button @click.prevent="createAccount">Create Account</button>
    <router-link :to="{ name: 'home' }">
        <button>Back to Start Page</button></router-link
      >
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
import router from '@/router/index.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      phone: '',
      password: '',
      confirmPassword: '',
      userId: ''
    }
  },

  methods: {
    validation() {
      if (
        this.firstname === '' ||
        this.lastname === '' ||
        this.email === '' ||
        this.password.length < 8 ||
        !/[A-Z]/.test(this.password) ||
        !/[a-z]/.test(this.password) ||
        !/\d/.test(this.password) ||
        this.confirmPassword !== this.password
      ) {
        return false
      } else {
        return true
      }
    },

    createAccount() {
      if (!this.validation()) {
        alert(`Please make sure your name, e-mail address and password are entered correctly.
    Your password must contain:
    - min. 8 characters
    - min. 1 uppercase letter
    - min. 1 lowercase letter
    - min. 1 digit`)
        return
      } else {
        console.log('Validation ok')
        this.userId = (Date.now() + Math.floor(Math.random() * 10)).toString()
        this.sendData()
      }
    },
    async sendData() {
      const requestData = {
        id: this.userId,
        name: `${this.firstname} ${this.lastname}`,
        email: this.email,
        address: this.address,
        phone: this.phone,
        password: this.password,
        trips: [],
        }
        console.log(requestData)
      
      try {
        const createResponse = await fetch(this.state.apiUrl + 'users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        })

        if (createResponse.ok) {
          console.log('createResponse.ok')
          const responseData = await createResponse.json()
          this.state.user = responseData
          localStorage.setItem('loggedUser', JSON.stringify(this.state.user))
          console.log('User stored in local storage')
          router.push(`/AllTravels/`)
        } else {
          router.push('/')
          alert('Server Error. Failed to create user. Sorry.')
        }
      } catch (error) {
        router.push('/')
        alert('Server Error. Failed to create user. Sorry.')
      }
    }
  }
}
</script>

<style scoped>
header {
  margin: 1rem auto;
  width: 32rem;
}

.catlogo {
  margin: 0 auto;
}

h2 {
  color: black;
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
}

.info-icon {
  cursor: pointer;
  font-size: large;
}

.info-list {
  position: absolute;
  visibility: hidden;
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
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
}

.pw {
  position: relative;
}

.infoIcondiv:hover .info-list {
  visibility: visible;
}

.row {
  display: inline;
}

.container {
  background-color: var(--pink-activities);
}
</style>
