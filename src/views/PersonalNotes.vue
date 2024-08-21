<template>
  <CatHeader />

  <main class="container">
    <h2 class="title">Personal Notes</h2>
    <div v-if="notes.length === 0" class="note-container">
      <p class="note-box">{{ placeholderText }}</p>
    </div>
    <div v-else v-for="(note, index) in notes" :key="index" class="note-container">
      <template v-if="editMode !== index">
        <p class="note-box" @click="startEditing(index)">{{ note }}</p>
      </template>
      <template v-else>
        <textarea
          class="note-box edit-note"
          v-model="notes[index]"
          @keyup.enter="finishEditing(index)"
        ></textarea>
        <button class="delete-btn save-btn" @click="finishEditing(index)">Save</button>
      </template>
      <button class="delete-btn" @click="deleteNote(index)">x</button>
      
    </div>

    <div class="input-area">
      <textarea
        v-if="isUserThere"
        class="input-text-area"
        v-model="newDetails"
        id="item-input"
        placeholder="Write your poetry here"
        @keyup.enter="addNote"
      ></textarea>
      <button
        v-if="isUserThere"
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
      notes: [],
      editMode: null,
      isUserThere: false,
      newDetails: '',
      state: herdingCatsstore(),
      placeholderText: `Take notes or write poetry. Or something else. We don't care.` // Placeholder text
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
    async checkUser() {
      if (!this.state.user || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false;
      } else {
        this.isUserThere = true;
      }
    },

    async loadUserNotes() {
      const userId = JSON.parse(localStorage.getItem('loggedUser')).id;
      const currentUser = this.state.userData.find(user => user.id === userId);
      if (currentUser.notes.length > 0) {
        this.notes = currentUser.notes;
      } else {
        this.notes = [];
      }
    },

    startEditing(index) {
      this.editMode = index;
    },

    finishEditing() {
      this.submitNote();
      this.editMode = null;
    },

    addNote() {
      this.notes.push(this.newDetails.trim());
      this.submitNote();
      this.newDetails = '';
    },

    async deleteNote(index) {
      this.notes.splice(index, 1);
      this.submitNote();
    },

    async submitNote() {
      const userId = JSON.parse(localStorage.getItem('loggedUser')).id;
      const currentUser = this.state.userData.find(data => data.id === userId);
      currentUser.notes = [...this.notes];

      await fetch(`${this.state.apiUrl}users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentUser)
      });
    }
  },
  async created() {
    await this.checkUser();
    await this.state.loadUserData();
    await this.loadUserNotes();
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
}

.edit-note {
  box-shadow: 0px 0.2rem 0.4rem rgba(255, 255, 255, 0.9);
  border: 0;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
  color: #000000;
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
