<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>
  <main class="container">
    <h2 class="title">Notes</h2>
    <ul class="note-content">
      <li
        v-for="(item, index) of this.state.tripData[0].details.notes"
        :key="index"
        class="list-item"
      >
        <p>{{ item }}</p>
        <button v-if="isUserThere" class="delete-btn" @click="deleteItem(index)">x</button>
      </li>
    </ul>

    <form class="note-input-form">
      <textarea
        v-if="isUserThere"
        v-model="newNotes"
        id="note-input"
        name="note-input"
        placeholder="Take notes for your trip ..."
        @keydown.enter="addNote"
      ></textarea>
      <button
        v-if="isUserThere"
        @click.prevent="addNote"
        :disabled="checkInput"
        :class="{ 'btn-disabled': checkInput }"
      >
        Add Note
      </button>

      <router-link :to="{ path: '/trip/' + this.$route.params.id }"
        ><button>Back to Trip</button></router-link
      >
    </form>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      newNotes: ''
    }
  },
  computed: {
    checkInput() {
      if (this.newNotes.trim().length >= 1) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    async checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    },

    async addNote() {
      if (this.newNotes.trim() !== '') {
        this.state.tripData[0].details.notes.push(this.newNotes.trim())
        this.newNotes = ''
      }
      await fetch(`${this.state.apiUrl}events/${this.$route.params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.tripData[0])
      })
    },

    async deleteItem(index) {
      this.state.tripData[0].details.notes.splice(index, 1)

      await fetch(`${this.state.apiUrl}events/${this.$route.params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.tripData[0])
      })
    }
  },
  created() {
    this.state.loadTripData(this.$route.params.id)
    this.checkUser()
  }
}
</script>

<style scoped>
header {
  margin: 1rem auto;
  display: flex;
  justify-content: center;
}
.container {
  background-color: var(--turqoise-notes);
}

h2 {
  color: black;
}
.container {
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, white 2.9rem, #c4ebf4 0.1rem);
  margin: 1rem auto;
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

.note-content {
  margin-top: 1.5rem;
}
.note-input-form {
  margin-top: auto;
  z-index: 2;
}

.list-item {
  justify-content: space-between;
}
p {
  font-size: 1.5rem;
  line-height: 2rem;
}
</style>
