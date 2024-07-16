<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>
  <main class="container">
    <h2 class="title">Profile page</h2>
    <div class="profile-entry">
      <label class="required" for="name">Name:</label>
      <p v-if="!editing">
        {{ currentGroupMember.name }}
      </p>
      <input v-else type="text" v-model="nameInput" :placeholder="currentGroupMember.name" />
    </div>

    <div class="profile-entry">
      <label for="adresse">Address:</label>
      <p v-if="!editing">
        {{ currentGroupMember.address }}
      </p>
      <input v-else type="text" v-model="addressInput" :placeholder="currentGroupMember.address" />
    </div>

    <div class="profile-entry">
      <label for="tele">Phone:</label>
      <div class="row">
        <p v-if="!editing">{{ currentGroupMember.tele }}</p>
        <a
          v-if="!editing"
          @click="sendMessage"
          href="'https://wa.me/' + 4915754288565"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img class="wa" src="../assets/WhatsApp.svg.png" alt="Click here to send a message" />
        </a>

        <input v-else type="text" v-model="teleInput" :placeholder="currentGroupMember.tele" />
      </div>

      <label v-if="isUserThere && editing" class="member-dates">(Please use the +49 format)</label>
    </div>
    <div class="profile-entry list-p">
      <ul class="member-dates">
        <li v-if="currentGroupMember.startDate">From: {{ currentGroupMember.startDate }}</li>
        <li v-if="currentGroupMember.endDate">Until: {{ currentGroupMember.endDate }}</li>
      </ul>
    </div>
    <div class="btns">
      <button v-if="isUserThere && !editing" class="edit-btn" @click="startEditing">Edit</button>
      <button v-if="editing" class="save-btn" @click="finishEditing">Save</button>
      <router-link :to="{ path: '/groupmembers/' + this.$route.params.id }"
        ><button class="back-btn">Back to Group Members</button></router-link
      >
    </div>
  </main>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      isUserThere: false,
      state: herdingCatsstore(),
      editing: false,
      nameInput: '',
      addressInput: '',
      teleInput: ''
    }
  },
  computed: {
    currentGroupMember() {
      if (this.state.tripData[0]) {
        return this.state.tripData[0].details.groupmembers.find(
          (item) => item.id === this.$route.params.index
        )
      } else {
        return []
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

    sendMessage() {
      const phoneNumber = this.teleInput.replace(/\D/g, '')
      const whatsappLink = `https://wa.me/${phoneNumber}`
      window.open(whatsappLink)
    },

    startEditing() {
      this.editing = true
      this.nameInput = this.currentGroupMember.name
      this.addressInput = this.currentGroupMember.address
      this.teleInput = this.currentGroupMember.tele
    },
    async finishEditing() {
      if (this.nameInput && this.nameInput !== this.currentGroupMember.name) {
        this.currentGroupMember.name = this.nameInput
      }
      if (this.addressInput && this.addressInput !== this.currentGroupMember.address) {
        this.currentGroupMember.address = this.addressInput
      }
      if (this.teleInput && this.teleInput !== this.currentGroupMember.tele) {
        this.currentGroupMember.tele = this.teleInput
      }

      await fetch(`${this.state.apiUrl}events/${this.$route.params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.tripData[0])
      })
      this.editing = false
    }
  },
  created() {
    this.state.loadTripData(this.$route.params.id)
    this.checkUser()
  }
}
</script>

<style scoped>
.profile-entry {
  margin-top: 2rem;
}

.wa {
  width: 2rem;
  margin-left: 1rem;
}
.row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.container {
  display: flex;
  flex-direction: column;
  background-color: var(--turqoise-gray-background);
}

.btns {
  margin-top: auto;
  margin-bottom: 0;
}

p,
label {
  color: white;
  text-shadow: 0px 0.2rem 0.2rem rgba(255, 255, 255, 0.25);
}

.edit-btn {
  background-color: var(--required-red);
}

.save-btn {
  background-color: var(--green-travel);
}
</style>
