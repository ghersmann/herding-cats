<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>
  <main class="container">
    <h2 class="title">Personal Notes</h2>
    <div id="app">
      <!-- Iteriere über die Notizen -->
      <div v-for="(note, index) in notes" :key="index" class="note-container">
        <template v-if="!editMode[index]">
          <!-- Div anzeigen, wenn nicht im Bearbeitungsmodus -->
          <p class="note-box" @click="startEditing(index)">{{ note }}</p>
        </template>
        <template v-else>
          <!-- Textarea anzeigen, wenn im Bearbeitungsmodus -->
          <textarea
            class="note-box edit-note"
            v-model="notes[index]"
            @keyup.enter="finishEditing(index)"
          ></textarea>
        </template>
        <button class="delete-btn" @click="deleteNote(index)">x</button>
      </div>
      <button class="add-note" @click="addNote" type="button">New Note</button>

      <router-link :to="{ path: '/AllTravels/' }"><button>Back to Trip</button></router-link>
    </div>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      notes: [],
      editMode: [false],
      state: herdingCatsstore()
    }
  },
  methods: {
    startEditing(index) {
      this.editMode[index] = true
    },
    finishEditing(index) {
      this.submitNote()
      this.editMode[index] = false
    },
    addNote() {
      this.notes.push('')
      this.editMode.push(true)
    },
    async deleteNote(index) {
      this.notes.splice(index, 1)
      this.editMode.splice(index, 1)
      this.submitNote()
    },
    async submitNote() {
      const userId = JSON.parse(localStorage.getItem('loggedUser')).id
      const currentUser = this.state.userData.find((data) => data.id === userId)
      currentUser.notes = this.notes.slice()

      await fetch(`${this.state.apiUrl}users/${userId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentUser)
      })
    }

    // async deleteItem(index) {
    //   const userId = JSON.parse(localStorage.getItem('loggedUser')).id
    //   const currentUser = this.state.userData.find((data) => data.id === userId)
    //   currentUser.notes.splice(index, 1)

    //   await fetch(`${this.state.apiUrl}users/${userId}/`, {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(currentUser)
    //   })
    // }
  },
  async created() {
    await this.state.loadUserData()

    const userId = JSON.parse(localStorage.getItem('loggedUser')).id
    const currentUser = this.state.userData.find((user) => user.id === userId)
    if (currentUser.notes.length > 0) {
      this.notes = currentUser.notes
    } else if (currentUser.notes.length === 0) {
      this.notes = ['Take notes and click enter once you are done']
    }
  }
}
</script>

<style scoped>
.title {
  margin-bottom: 2rem;
}

.note-container {
  display: flex;
  align-items: top;
}

.note-box {
  flex: 1;
  margin-bottom: 1.4rem;
  margin-top: 0;
  min-width: 5rem;
  padding: 1.4rem;
  background: #ffa;
  background-image: linear-gradient(150deg, #efec88 0%, #fefabc 100%);
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
}

.edit-note {
  box-shadow: 0 0 7px rgba(0, 0, 0, 0.8);
}

.delete-btn {
  margin-left: 1rem;
  border-radius: 0.5rem;
}

.add-note {
  background-color: var(--green-packing-list);
}

.container {
  background-color: var(--turqoise-notes);
}
</style>
