<template>
  <CatHeader />

  <main class="container">
    <h2>Packing List</h2>
    <p
      v-if="Object.values(state.tripData[0].details).every((array) => array.length === 0)"
      class="placeholder-text"
    >
      It's empty.
    </p>
    <ul class="list">
      <li
        v-for="(item, index) in state.tripData[0].details.packlist"
        :key="index"
        class="list-item"
      >
        <!-- Use EditableNote Component -->
        <EditableNote
          :noteText="item"
          @update-note="updatePackItem(index, $event)"
          @delete-note="removePackItem(index)"
        />
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
      <router-link :to="{ path: '/trip/' + this.$route.params.id }">
        <button>Back to Trip</button>
      </router-link>
    </div>
  </main>
</template>


<script>
import { herdingCatsstore } from '@/stores/counter.js';
import CatHeader from '@/components/CatHeader.vue';
import EditableNote from '@/components/EditableNote.vue';

export default {
  data() {
    return {
      state: herdingCatsstore(),
      newDetails: ''
    };
  },
  components: {
    CatHeader,
    EditableNote
  },
  computed: {
    checkInput() {
      return this.newDetails.trim().length < 1;
    }
  },
  methods: {
    async addItem() {
      if (this.newDetails.trim() !== '') {
        this.state.tripData[0].details.packlist.push(this.newDetails.trim());
        this.newDetails = '';
      }
      await this.state.updateTripState(this.$route.params.id);
    },
    updatePackItem(index, newText) {
      this.state.tripData[0].details.packlist[index] = newText;
      this.state.updateTripState(this.$route.params.id);
    },
    async removePackItem(index) {
      this.state.tripData[0].details.packlist.splice(index, 1);
      await this.state.updateTripState(this.$route.params.id);
    }
  },
  async created() {
    await this.state.checkUser();
    await this.state.loadTripData(this.$route.params.id);
  }
};
</script>


<style scoped>
.container {
  background-color: var(--green-packing-list);
}

.list-p,
p {
  color: white;
  text-shadow: 0px 0.2rem 0.2rem rgba(255, 255, 255, 0.25);
}
</style>
