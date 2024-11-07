<template>
<CatHeader />

  <main class="container">
      <h2 v-if="!editing">
        {{ currentGroupMember.name }}
      </h2>
      <input v-else type="text" v-model="nameInput" :placeholder="currentGroupMember.name" />

      <label for="adresse">Address:</label>
      <p v-if="!editing">
        {{ currentGroupMember.address || ("n/a".toString()) }}
      </p>
      <textarea v-else v-model="addressInput" :placeholder="currentGroupMember.address" />

      <label for="tele">Phone:</label>
        <p v-if="!editing">
          {{ currentGroupMember.tele || ("n/a".toString()) }}
        </p>
        <input v-else type="number" id="tele" v-model="teleInput" :placeholder="currentGroupMember.tele" />

      <label v-if="state.isUserThere && editing" class="member-dates">(Please use the +49 format)</label>

      <label for="participation">Participates:</label>
      <ul id="participation">
        <li class="member-dates">From: {{ currentGroupMember.startDate || ("n/a".toString()) }}</li>
        <li class="member-dates">Until: {{ currentGroupMember.endDate || ("n/a".toString()) }}</li>
      </ul>

    <div class="input-area">
      <button v-if="state.isUserThere && !editing" class="edit-btn" @click="startEditing">Edit</button>
      <div class="sv-cncl-btns">
        <button v-if="editing" class="sv-btn-green" @click="finishEditing">Save</button>
      <button v-if="editing" class="cncl" @click="cancelEditing">Cancel</button>

    </div>
      <router-link :to="{ path: '/groupmembers/' + this.$route.params.id }"
        ><button class="back-btn">Back to Group Members</button></router-link
      >
    </div>
  </main>
</template>

<script>
import CatHeader from '@/components/CatHeader.vue';
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      editing: false,
      nameInput: '',
      addressInput: '',
      teleInput: ''
    }
  },
components: {
  CatHeader
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
    startEditing() {
      this.editing = true
      this.nameInput = this.currentGroupMember.name
      this.addressInput = this.currentGroupMember.address
      this.teleInput = this.currentGroupMember.tele
    },

    cancelEditing() {
      this.editing = false;
    },

    async finishEditing() {
      if (this.nameInput && this.nameInput !== this.currentGroupMember.name) {
        this.currentGroupMember.name = this.nameInput
      }
      if (this.addressInput && this.addressInput !== this.currentGroupMember.address) {
        this.currentGroupMember.address = this.addressInput
      }
      if (this.teleInput && this.teleInput !== this.currentGroupMember.tele) {
        this.currentGroupMember.tele = this.teleInput.toString()
      }

      await this.state.updateTripState(this.$route.params.id)
      
      this.editing = false
    }
  },
  async created() {
    await this.state.checkUser()
    await this.state.loadTripData(this.$route.params.id)
  }
}
</script>

<style scoped>
.container {
  background-color: var(--turqoise-gray-background);
}

p,
label {
  color: white;
  text-shadow: 0px 0.2rem 0.2rem rgba(255, 255, 255, 0.25);
}

.edit-btn {
  background-color: var(--required-red);
}

.cncl {
  background-color: var(--required-red);
}

#participation {
  margin-top: 0.5rem;
}
</style>
