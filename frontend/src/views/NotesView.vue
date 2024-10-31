<template>
<CatHeader />

  <main class="container">
    <h2 class="title">Notes</h2>
    <ul class="note-content">
      <li
        v-for="(item, index) of this.state.tripData[0].details.notes"
        :key="index"
        class="list-item"
      >
        <p>{{ item }}</p>
        <button v-if="state.isUserThere" class="delete-btn" @click="removeNote(index)">x</button>
      </li>
    </ul>

    <form class="note-input-form">
      <textarea
        v-if="state.isUserThere"
        v-model="newNotes"
        id="note-input"
        name="note-input"
        placeholder="Take notes for your trip ..."
        @keydown.enter="addNote"
      ></textarea>
      <button
        v-if="state.isUserThere"
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
import CatHeader from '@/components/CatHeader.vue';
export default {
  data() {
    return {
      state: herdingCatsstore(),
      newNotes: ''
    }
  },
  
  components: {
    CatHeader
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
    async addNote() {
      if (this.newNotes.trim() !== '') {
        this.state.tripData[0].details.notes.push(this.newNotes.trim())
        this.newNotes = ''
      }
      await this.state.updateTripState(this.$route.params.id)
    },

    async removeNote(index) {
      this.state.tripData[0].details.notes.splice(index, 1)
      await this.state.updateTripState(this.$route.params.id)
    },
  },

  async created() {
    await this.state.checkUser()
    await this.state.loadTripData(this.$route.params.id)
  }
}
</script>

<style scoped>
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
  max-width: 10rem;
  word-wrap: break-word;
  overflow-wrap: break-word; 
}

p {
  font-size: 1.5rem;
  line-height: 2rem;
}
</style>
