<template>
  <CatHeader />

  <main class="container">
    <h2>Personal Notes</h2>

    <ul class="list">
      <!-- Show placeholder text if there are no notes -->
      <li v-if="!state.user.notes.length" class="list-item">
        <div class="note-box">
          <p class="list-p">{{ placeholderText }}</p>
        </div>
      </li>

      <!-- Loop through notes and display them -->
      <li v-for="(note, index) in state.user.notes" :key="index" class="list-item">
      <!-- Apply the editing class conditionally -->
      <div :class="['note-box', { 'note-box--editing': editMode === index }]">
        <!-- Display note text or textarea based on edit mode -->
        <p v-if="editMode !== index" class="list-p" @click="startEditing(index)">
          {{ note }}
        </p>
        
        <div v-else>
          <textarea
            class="edit-note"
            v-model="state.user.notes[index]"
            :ref="setTextareaRef(index)"
            @keyup="adjustTextarea(index)"
          ></textarea>
          <div class="edit-btns">
            <button class="save-btn cncl-btn" @click="cancelEditing">Cancel</button>
            <button class="save-btn" @click="finishEditing">Save</button>
          </div>
        </div>
      </div>
      
      <!-- Delete button for the note -->
      <button class="delete-btn" @click="deleteNote(index)">x</button>
    </li>
    </ul>

    <!-- New note input area -->
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

    <!-- Back button to navigate to travels -->
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
      placeholderText: `Take notes or write poetry. Or something else. We don't care.`,
      textareaRefs: {}
    };
  },
  components: {
    CatHeader,
  },
  computed: {
    checkInput() {
      return this.newDetails.trim().length === 0;
    }
  },
  methods: {
    startEditing(index) {
      this.editMode = index;
      this.$nextTick(() => this.adjustTextarea(index));
    },
    setTextareaRef(index) {
      return (el) => {
        this.textareaRefs[index] = el;
      };
    },
    adjustTextarea(index) {
      const textarea = this.textareaRefs[index];
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    },
    async deleteNote(index) {
      this.state.user.notes.splice(index, 1);
      await this.state.updateUserState(this.state.user.id);
    },
    async finishEditing() {
      await this.state.updateUserState(this.state.user.id);
      this.editMode = null;
    },

    cancelEditing() {
      this.editMode = null;
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
}
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
}

.add-note {
  background-color: var(--green-packing-list);
}
</style>
