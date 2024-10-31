<template>
  <CatHeader />

  <main class="container">
    <h2 class="title">Packing List</h2>
    <ul class="list">
      <li
        v-for="(item, index) of this.state.tripData[0].details.packlist"
        :key="index"
        class="list-item"
      >
        <p class="list-p">{{ item }}</p>
        <button v-if="state.isUserThere" class="delete-btn" @click="removePackItem(index)">x</button>
      </li>
    </ul>
    <div class="input-area">
      <textarea
        v-if="state.isUserThere"
        class="input-text-area"
        v-model="newDetails"
        id="item-input"
        placeholder="Add stuff to bring"
        @keyup.enter="addItem"
      ></textarea>
      <button
        v-if="state.isUserThere"
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
import CatHeader from '@/components/CatHeader.vue';
export default {
  data() {
    return {
      state: herdingCatsstore(),
      newDetails: ''
    }
  },
  components: {
    CatHeader
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
    async addItem() {
      if (this.newDetails.trim() !== '') {
        this.state.tripData[0].details.packlist.push(this.newDetails.trim())
        this.newDetails = ''
      }
      await this.state.updateTripState(this.$route.params.id)
    },

    removePackItem(index) {
      this.state.tripData[0].details.packlist.splice(index, 1)
      this.state.updateTripState(this.$route.params.id)
    },
  },

  async created() { 
    await this.state.checkUser()
    await this.state.loadTripData(this.$route.params.id)
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
