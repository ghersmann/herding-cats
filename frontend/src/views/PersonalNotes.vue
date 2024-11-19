<template>
  <CatHeader />

  <main class="container">
    <h2>Personal Notes</h2>

    <ul class="list">
      <li v-if="!state.user.notes.length" class="list-item">
        <div class="note-box">
          <p class="list-p">{{ placeholderText }}</p>
        </div>
      </li>

      <li v-for="(note, index) in state.user.notes" :key="index" class="list-item">
        <EditableNote
          :noteText="note"
          @update-note="updateNote(index, $event)"
          @delete-note="deleteNote(index)"
        />
      </li>
    </ul>

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
import EditableNote from '@/components/EditableNote.vue';

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
    EditableNote
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
      this.state.user.notes.push(this.newDetails.trim());
      await this.state.updateUserState(this.state.user.id);
      this.newDetails = '';
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

.list-p {
  margin: 0;
  font-size: 1.5rem;
  width: 23rem;
}

 .note-box {
  padding: 1.4rem;
  background: linear-gradient(150deg, #efec88 0%, #fefabc 100%);
  box-shadow: 0px 0.2rem 0.4rem rgba(0, 0, 0, 0.25);
  width: 28rem;
}
/*
.note-box--editing {
  box-shadow: white 0px 0px 1rem;
}

.edit-note {
  background: rgb(0 0 0 / 0%);
  box-sizing: inherit;
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  height: auto;
  overflow-y: auto;
  box-shadow: none;
}

.edit-note:hover,
.edit-note:active,
.edit-note:focus {
  box-shadow: none;
  outline: none;
}

.delete-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
} */

.add-note {
  background-color: var(--green-packing-list);
}
</style>
