<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>

  <main>
    <section v-if="state.tripData[0]" class="container overview">
      <EditTripTitleDate />
      <p
        v-if="Object.values(state.tripData[0].details).every((array) => array.length === 0)"
        class="initial-text"
      >
        Click "Add Item" to start Herding your Cats
      </p>

      <ul class="list">
        <li class="list-item" v-for="(key, index) in filteredDetailsKeys" :key="index">
          <router-link :to="`/${key}/${this.tripId}`">
            <img class="arrow" src="@/assets/arrow.svg" alt="Arrow symbol" />
            <p>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</p>
          </router-link>
        </li>
      </ul>
    </section>

    <!--     <transition name="slide">
      <div v-show="showSidebar" class="sidebar">
        <ul>
          <li><router-link to="/newtrip">Create new trip</router-link></li>
          <li><router-link to="/notes">Notes</router-link></li>
          <li><router-link to="/logout">Log Out</router-link></li>
        </ul>
      </div>
    </transition> -->
    <nav>
      <button v-if="isUserThere" @click="openOptions">Add Item</button>
      <dialog class="add-options" ref="add-options">
        <form method="dialog" action="">
          <router-link :to="{ path: '/transport/' + this.$route.params.id }"
            ><button>Transport</button></router-link
          >
          <router-link :to="{ path: '/lodging/' + this.$route.params.id }"
            ><button>Lodging</button></router-link
          >
          <router-link :to="{ path: '/activity/' + this.$route.params.id }"
            ><button>Activity</button></router-link
          >
          <router-link :to="{ path: '/groupmembers/' + this.$route.params.id }"
            ><button>Group Members</button></router-link
          >
          <router-link :to="{ path: '/packlist/' + this.$route.params.id }"
            ><button>Packing List</button></router-link
          >
          <router-link :to="{ path: '/notes/' + this.$route.params.id }"
            ><button>Notes</button></router-link
          >
          <button class="cancel-btn">Cancel</button>
        </form>
      </dialog>
      <router-link :to="{ path: '/timeline/' + this.$route.params.id }">
        <button class="timeline-btn">Trip Timeline</button>
      </router-link>
      <ToggleSwitch v-if="isUserThere" class="toggle-switch" labelText="This trip is Public" />
      <p class="white-box-id">Trip ID: {{ tripId }}</p>
      <button @click="copyId">Copy ID</button>
      <router-link :to="{ name: 'alltravels' }">
        <button class="back-btn" v-if="isUserThere">Back to all your trips</button></router-link
      >
      <router-link :to="{ name: 'home' }">
        <button v-if="!isUserThere">Back to Start Page</button></router-link
      >
      <DeleteButton v-if="isUserThere" />
    </nav>
  </main>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import DeleteButton from '@/components/DeleteButton.vue'
import EditTripTitleDate from '@/components/EditTripTitleDate.vue'
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripId: '',
      showSidebar: false,
      isUserThere: false
    }
  },
  components: {
    ToggleSwitch,
    DeleteButton,
    EditTripTitleDate
  },
  computed: {
    filteredDetailsKeys() {
      return Object.keys(this.state.tripData[0].details).filter(
        (key) => this.state.tripData[0].details[key].length > 0
      )
    }
  },
  methods: {
    openOptions() {
      this.$refs['add-options'].showModal()
    },

    async copyId() {
      await navigator.clipboard.writeText(this.tripId)
    },

    checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    }

    /*  hideSidebar() {
      setTimeout(() => {
        this.showSidebar = false
      }, 2000)
    } */
  },
  created() {
    this.tripId = this.$route.params.id
    this.state.loadTripData(this.tripId)
    this.checkUser()
  }
}
</script>

<style scoped>
.container {
  background-color: var(--gray-accomodation);
}

h4 {
  margin-top: 1rem;
}
.list {
  position: relative;
  margin-top: 2rem;
  width: 28rem;
}
.list-item {
  position: relative;
}
.arrow {
  z-index: 1;
  position: absolute;
  margin-left: 25rem;
  margin-top: 2.2rem;
}

.cancel-btn {
  margin-top: 2rem;
}

.back-btn {
  background-color: var(--green-travel);
}

button {
  width: 32rem;
}

.white-box-id {
  padding: 1rem;
  color: black;
  background-color: white;
  margin-bottom: 0;
  margin-top: 2rem;
  font-size: 1.3rem;
}

.overview {
  color: black;
  min-height: 10rem;
  background-color: var(--gray-accomodation);
}
.timeline-btn {
  color: black;
  background-color: var(--yellow-calendar);
}

.add-options form {
  display: flex;
  flex-direction: column;
}

/* .hamburger-menu {
  margin-top: 5rem;
  width: 30px;
  height: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
}

.line {
  width: 100%;
  height: 3px;
  margin-top: 5px;
  background-color: #000;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 200px;
  height: 100%;
  background-color: whitesmoke;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding-left: 5px;
}

.slide-enter-active {
  transition: transform 0.3s;
}

.slide-leave-active {
  transition: transform 1s;
}

.slide-enter,
.slide-leave-to {
  transform: translateX(-200px);
} */
</style>
