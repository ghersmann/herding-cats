<template>
    <CatHeader />

  <main>
    <section v-if="state.tripData[0]" class="container overview">
      <EditTripTitleDate />
      <p
        v-if="Object.values(state.tripData[0].details).every((array) => array.length === 0)"
        class="placeholder-text"
      >
        Click "Add Item" to start Herding your Cats
      </p>

      <ul class="list">
        <li class="list-item" v-for="(key, index) in filteredDetailsKeys" :key="index">
          <router-link :to="`/${key}/${this.$route.params.id}`">
            <img class="arrow" src="@/assets/arrow.svg" alt="Arrow symbol" />
            <p>{{ key.charAt(0).toUpperCase() + key.slice(1) }}</p>
          </router-link>
        </li>
      </ul>
    </section>
    <nav>
      <button v-if="state.isUserThere" @click="openOptions">Add Item</button>
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
      <ToggleSwitch v-if="state.isUserThere && state.isDataLoaded" class="toggle-switch" labelText="This trip is Public" />
      <p class="white-box-id">Trip ID: {{ this.$route.params.id }}</p>
      <button @click="copyId">Copy ID</button>
      <router-link :to="{ name: 'alltravels' }">
        <button class="back-btn" v-if="state.isUserThere">Back to all your trips</button></router-link
      >
      <router-link :to="{ name: 'home' }">
        <button v-if="!state.isUserThere">Back to Start Page</button></router-link
      >
      <DeleteButton v-if="state.isUserThere" />
    </nav>
  </main>
</template>

<script>
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import DeleteButton from '@/components/DeleteButton.vue'
import EditTripTitleDate from '@/components/EditTripTitleDate.vue'
import CatHeader from '@/components/CatHeader.vue'
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
    }
  },
  components: {
    ToggleSwitch,
    DeleteButton,
    EditTripTitleDate,
    CatHeader
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
      await navigator.clipboard.writeText(this.$route.params.id)
    },
  },
  async created() {
    await this.state.checkUser()
    await this.state.loadTripData(this.$route.params.id);
    this.state.isDataLoaded = true;
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
  background-color: var(--pink-background);
  color: black;
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

.placeholder-text {
  text-align: center;
}
</style>
