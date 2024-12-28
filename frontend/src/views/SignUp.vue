<template>
  <div v-if="isModalOpen" class="overlay-mask" @click="closeDialog"></div>
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
      <button class="delete-btn" @click.prevent="toggleInfo">x</button>
    </span>
  </div>
</div>
        <input type="password" v-model="password" />


      <label class="required">Confirm Password</label>
      <input type="password" v-model="confirmPassword" />
    </form>

    <dialog class="info-box" ref="signup-warning">
      <h3>
        Sign up is currently disabled.
      </h3>
      <p>
        This is happening while I develop a more secure password management system.  
      </p>
      <p>
        Sorry for the inconvenience.
      </p>
      <button @click="closeDialog">Got it</button>
    </dialog>

      <button @click.prevent="openDialog">Create Account</button>
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
      userId: '',
      isModalOpen: true,
      showInfo: false
    }
  },

  mounted() {
    if (this.$refs['signup-warning']) {
      this.$refs['signup-warning'].showModal();
    }
  },

  methods: {
    toggleInfo() {
      this.showInfo = !this.showInfo; // Toggle visibility on click
    },

    openDialog() {
      this.isModalOpen = true;
      if (this.$refs['signup-warning']) {
        this.$refs['signup-warning'].showModal();
      }
    },

    closeDialog() {
      this.isModalOpen = false;
      if (this.$refs['signup-warning']) {
        this.$refs['signup-warning'].close();
      }
    },

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
        this.userId = (Date.now() + Math.floor(Math.random() * 10)).toString()
        //this.sendData()
      }
    },
    /* async sendData() {
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
    } */
  }
}
</script>

<style scoped>
.container {
  background-color: var(--pink-activities);
}

header {
  margin: 1rem auto;
  width: 32rem;
}

.catlogo {
  margin: 0 auto;
}

h2 {
  color: black;
}

.pw {
  position: relative;
}
</style>
