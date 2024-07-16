<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logotype" />
  </header>
  <main class="container">
    <h2 class="title">Packing List</h2>
    <ul class="list">
      <li
        v-for="(item, index) of this.state.tripData[0].details.packlist"
        :key="index"
        class="list-item"
      >
        <p>{{ item }}</p>
        <button v-if="isUserThere" class="delete-btn" @click="deleteItem(index)">x</button>
      </li>
    </ul>
    <div class="input-area">
      <textarea
        v-if="isUserThere"
        class="input-text-area"
        v-model="newDetails"
        id="item-input"
        placeholder="Add stuff to bring"
        @keyup.enter="addItem"
      ></textarea>
      <button
        v-if="isUserThere"
        @click="addItem"
        :disabled="checkInput"
        :class="{ 'btn-disabled': checkInput }"
      >
        Add Item
      </button>
      <router-link :to="{ path: '/trip/' + this.$route.params.id }"
        ><button>Back to Trip</button></router-link
      >
    </div>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      isUserThere: false,
      state: herdingCatsstore(),
      newDetails: ''
    }
  },
  computed: {
    checkInput() {
      if (this.newDetails.trim().length >= 1) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    async checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    },
    async addItem() {
      if (this.newDetails.trim() !== '') {
        this.state.tripData[0].details.packlist.push(this.newDetails.trim())
        this.newDetails = ''
      }
      await fetch(`${this.state.apiUrl}events/${this.$route.params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.tripData[0])
      })
    },

    async deleteItem(index) {
      this.state.tripData[0].details.packlist.splice(index, 1)

      await fetch(`${this.state.apiUrl}events/${this.$route.params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.tripData[0])
      })
    }
  },
  created() {
    this.state.loadTripData(this.$route.params.id)
    this.checkUser()
  }
}
</script>

<style scoped>
h3 {
  color: white;
}

.list-item p {
  max-width: 24rem;
  color: white;
  margin-right: auto;
  margin-top: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: var(--green-packing-list);
}

.input-area {
  margin-top: auto;
}
</style>
