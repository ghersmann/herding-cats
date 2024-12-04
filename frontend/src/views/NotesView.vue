<template>
  <CatHeader />

  <main class="container">
    <h2 class="title">Notes</h2>
    <ul class="list">
      <li
        v-for="(note, index) in state.tripData[0].details.notes || []"
        :key="index"
        class="list-item"
      >
        <!-- RenderEditNotes with custom slot -->
        <RenderEditNotes
  :noteText="note"
  customEditClass="custom-edit-area"
  @update-note="updateNote(index, $event)"
  @delete-note="removeNote(index)"
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

    <form class="input-area">
      <textarea
        v-if="state.isUserThere"
        v-model="newNotes"
        id="note-input"
        name="note-input"
        placeholder="Take notes for your trip..."
        @keydown.enter.prevent="addNote"
      ></textarea>
      <button
        v-if="state.isUserThere"
        @click.prevent="addNote"
        :disabled="checkInput"
        :class="{ 'btn-disabled': checkInput }"
      >
        Add Note
      </button>

      <router-link :to="{ path: '/trip/' + this.$route.params.id }">
        <button>Back to Trip</button>
      </router-link>
    </form>
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
      newNotes: '',
    };
  },
  components: {
    CatHeader,
    RenderEditNotes,
  },
  computed: {
    checkInput() {
      return this.newNotes.trim().length < 1;
    },
  },
  methods: {
    async addNote() {
      if (this.newNotes.trim() !== '') {
        this.state.tripData[0]?.details?.notes.push(this.newNotes.trim());
        this.newNotes = '';
      }
      await this.state.updateTripState(this.$route.params.id);
    },
    updateNote(index, newText) {
      if (this.state.tripData[0]?.details?.notes) {
        this.state.tripData[0].details.notes[index] = newText;
        this.state.updateTripState(this.$route.params.id);
      }
    },
    async removeNote(index) {
      if (this.state.tripData[0]?.details?.notes) {
        this.state.tripData[0].details.notes.splice(index, 1);
        await this.state.updateTripState(this.$route.params.id);
      }
    },
  },
  async created() {
    await this.state.checkUser();
    await this.state.loadTripData(this.$route.params.id);
  },
};
</script>

<style scoped>
h2 {
  color: black;
}

.container {
  background: linear-gradient(to bottom, white 2.9rem, #c4ebf4 0.1rem);
  background-size: 100% 3rem;
  position: relative;
  padding-top: 2rem;
  padding-left: 3.5rem;
  border-radius: 0.5rem;
}

.container:before {
  content: '';
  display: block;
  position: absolute;
  z-index: 1;
  top: 0;
  left: 2rem;
  height: 100%;
  width: 1px;
  background: #db4034;
}

.list-item,
.input-area {
  width: 26rem;
}

.render-list-p {
  width: 23rem;
}
</style>

<style>
.custom-edit-area {
  width: 26rem;
}
</style>