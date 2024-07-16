<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logotype" />
  </header>
  <main class="container">
    <h2 class="title">Sign Up</h2>

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

    <router-link @click.prevent="createAccount" :to="validation() ? { name: 'alltravels' } : ''">
      <button class="weiterbtn">Create Account</button>
    </router-link>
  </main>
</template>

<script>
export default {
  data() {
    return {
      firstname: '',
      lastname: '',
      email: '',
      address: '',
      phone: '',
      password: '',
      confirmPassword: ''
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
      }
    }
  }
}
</script>

<style scoped>
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
  min-height: 30rem;
  background-color: var(--pink-activities);
}
</style>
