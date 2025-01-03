<template>
  <CatHeader />

  <main class="container">
    <h2>Packing List</h2>
    <p
      v-if="Object.values(state.tripData[0].details.packlist).every((array) => array.length === 0)"
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
        <!-- Use RenderEditNotes Component with Scoped Slot -->
        <RenderEditNotes
          :noteText="item"
          @update-note="updatePackItem(index, $event)"
          @delete-note="removePackItem(index)"
        >
          <template #note="{ text, startEditing }">
            <p
              class="render-list-p"
              @click="startEditing"
            >
              {{ text }}
            </p>
          </template>
        </RenderEditNotes>
      </li>
    </ul>
    <div class="input-area">
      <textarea
        v-if="state.isUserThere"
        class="input-text-area"
        v-model="newDetails"
        id="item-input"
        placeholder=" Add stuff to bring..."
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
import RenderEditNotes from '@/components/RenderEditNotes.vue';

export default {
  data() {
    return {
      state: herdingCatsstore(),
      newDetails: '',
    };
  },
  components: {
    CatHeader,
    RenderEditNotes,
  },
  computed: {
    checkInput() {
      return this.newDetails.trim().length < 1;
    },
  },
  methods: {
    async addItem() {
      if (this.newDetails.trim() !== '') {
        this.state.tripData[0].details.packlist.push(this.newDetails.trim());
        this.newDetails = '';
      }
      await this.state.updateTripState(this.$route.params.id);
    },
    async updatePackItem(index, newText) {
      this.state.tripData[0].details.packlist[index] = newText;
      await this.state.updateTripState(this.$route.params.id);
    },
    async removePackItem(index) {
      this.state.tripData[0].details.packlist.splice(index, 1);
      await this.state.updateTripState(this.$route.params.id);
    },
  },
  async created() {
    await this.state.checkUser();
    await this.state.loadTripData(this.$route.params.id);
  },
};
</script>

<style scoped>
.container {
  background-color: var(--green-packing-list);
}

.render-list-p, .placeholder-text {
  color: white; 
}
</style>
