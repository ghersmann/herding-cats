<template>
  <CatHeader />

  <main class="container">
    <h2>Personal Notes</h2>

    <ul class="list">
      <!-- Placeholder text when no notes exist -->
      <li v-if="!state.user.notes.length" class="list-item">
        <div class="note-box">
          <p class="render-list-p">{{ placeholderText }}</p>
        </div>
      </li>

      <!-- Iterate through notes and render editable notes -->
      <li
        v-for="(note, index) in state.user.notes"
        :key="index"
        class="list-item note-box"
      >
        <RenderEditNotes
          :noteText="note"
            customEditClass="custom-edit-area"
          @update-note="updateNote(index, $event)"
          @delete-note="deleteNote(index)"
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

    <!-- Input area for adding a new note -->
    <div v-if="state.isUserThere" class="input-area">
      <textarea
        class="input-text-area"
        v-model="newDetails"
        placeholder="Write your poetry here"
        @keyup.enter="addNote"
      ></textarea>
      <button
        @click="addNote"
        :disabled="checkInput"
        :class="{ 'btn-disabled': checkInput }"
        class="add-note"
      >
        Add Note
      </button>
    </div>

    <router-link :to="{ path: '/AllTravels/' }">
      <button>Back to Your Travels</button>
    </router-link>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js';
import CatHeader from '@/components/CatHeader.vue';
import RenderEditNotes from '@/components/RenderEditNotes.vue';

export default {
  data() {
    return {
      newDetails: '',
      state: herdingCatsstore(),
      placeholderText: `Take notes or write poetry. Or something else. We don't care.`
    };
  },
  components: {
    CatHeader,
    RenderEditNotes
  },
  computed: {
    checkInput() {
      return this.newDetails.trim().length === 0;
    }
  },
  methods: {
    updateNote(index, newText) {
      this.state.user.notes[index] = newText;
      this.state.updateUserState(this.state.user.id);
    },
    async deleteNote(index) {
      this.state.user.notes.splice(index, 1);
      await this.state.updateUserState(this.state.user.id);
    },
    async addNote() {
      if (this.newDetails.trim() !== '') {
        this.state.user.notes.push(this.newDetails.trim());
        await this.state.updateUserState(this.state.user.id);
        this.newDetails = '';
      }
    }
  },
  async created() {
    await this.state.checkUser();
  }
};
</script>

<style scoped>
.container {
  background-color: var(--turqoise-notes);
}

h2 {
  margin-bottom: 1rem;
}

.list-item {
  position: relative;
  margin-top: 1rem;
}

.note-box {
  padding: 1rem;
  background: linear-gradient(150deg, #efec88 0%, #fefabc 100%);
  box-shadow: 0px 0.2rem 0.4rem rgba(0, 0, 0, 0.25);
  width: 28rem;
}

.add-note {
  background-color: var(--green-packing-list);
}
</style>

<style>
.custom-edit-area {
  width: 26rem;
}
</style>
