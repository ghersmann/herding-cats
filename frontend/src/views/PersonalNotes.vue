<template>
  <CatHeader />

  <main class="container">
    <h2 class="title">Personal Notes</h2>
    <div v-if="state.user.notes.length === 0" class="note-container">
      <p class="note-box">{{ placeholderText }}</p>
    </div>
    <div v-else v-for="(note, index) in state.user.notes" :key="index" class="note-container">
      <template v-if="editMode !== index">
        <p class="note-box" @click="startEditing(index)">{{ note }}</p>
      </template>
      <template v-else>
        <textarea
          class="note-box edit-note"
          v-model="state.user.notes[index]"
          :ref="setTextareaRef(index)"
          @keyup="adjustTextarea(index)"
        ></textarea>
        <button class="delete-btn save-btn" @click="finishEditing(index)">Save</button>
      </template>
      <button class="delete-btn" @click="deleteNote(index)">x</button>
      
    </div>

    <div class="input-area">
      <textarea
        v-if="state.isUserThere"
        class="input-text-area"
        v-model="newDetails"
        id="item-input"
        placeholder="Write your poetry here"
        @keyup.enter="addNote"
      ></textarea>
      <button
        v-if="state.isUserThere"
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
import { herdingCatsstore } from '@/stores/counter.js'
import CatHeader from '@/components/CatHeader.vue';

export default {
  data() {
    return {
      editMode: null,
      newDetails: '',
      state: herdingCatsstore(),
      placeholderText: `Take notes or write poetry. Or something else. We don't care.`, // Placeholder text
      textareaRefs: {}
    }
  },
  components: {
    CatHeader,
  },
  computed: {
    checkInput() {
      return this.newDetails.trim().length < 1;
    }
  },
  methods: {
    startEditing(index) {
      this.editMode = index; // Enter edit mode for the specific note
      this.$nextTick(() => this.adjustTextarea(index));
    },

    setTextareaRef(index) {
      return (el) => {
        this.textareaRefs[index] = el; // Store the reference for each textarea by index
      };
    },

    adjustTextarea(index) {
      const textarea = this.textareaRefs[index]; // Access the textarea ref for the given index
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = textarea.scrollHeight + 'px'; // Adjust to content
      }
    },

    async deleteNote(index) {
      this.state.user.notes.splice(index, 1); // Remove the note from the array in the Pinia store
      await this.state.updateUserState(this.state.user.id); // Call store action to persist the update
    },

    async finishEditing() {
      await this.state.updateUserState(this.state.user.id); // Call store action to persist the update
      this.editMode = null;
    },

    async addNote() {
      this.state.user.notes.push(this.newDetails.trim());
      await this.state.updateUserState(this.state.user.id); // Call store action to persist the update
      this.newDetails = '';
    },
  },

  async created() {
    await this.state.checkUser();
  }
}
</script>



<style scoped>
.note-container {
  display: flex;
  align-items: top;
  position: relative;
}

.note-box,
.edit-note {
  flex: 1;
  margin-top: 0;
  margin-bottom: 1rem;
  min-width: 24rem;
  padding: 1.4rem;
  background: #ffa;
  background-image: linear-gradient(150deg, #efec88 0%, #fefabc 100%);
  box-shadow: 0px 0.2rem 0.4rem rgba(0, 0, 0, 0.25);
  overflow: hidden; 
  position: relative;
  font-size: 1.5rem
}

.edit-note {
  box-shadow: 0px 0.2rem 0.4rem rgba(255, 255, 255, 0.9);
  border: 0;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 1.5rem;
  color: #000000;
  flex-grow: 1;
  position: relative;
  height: auto;
  overflow-y: auto;
}


.delete-btn {
  margin-left: 1rem;
  border-radius: 0rem;
}

.save-btn {
  position: absolute;
  bottom: 2rem;
  right: 4rem;
  max-width: 3rem;
}

.add-note {
  background-color: var(--green-packing-list);
}

.input-area {
  margin-top: auto;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: var(--turqoise-notes);
}
</style>
