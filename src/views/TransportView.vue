<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>
  <main class="container">
    <h2 class="title">Transport</h2>
    <ul>
      <li
        class="transport-entry"
        v-for="(transport, index) of transportEntries"
        :key="transport.id"
      >
        <h3>{{ transport.name }}</h3>
        <ul class="list-p">
          <li>{{ transport.zipcode }} {{ transport.city }}</li>
          <li>{{ transport.address }}</li>
          <li v-if="transport.startDate">Departure: {{ transport.startDate }}</li>
          <li v-if="transport.endDate">Arrival: {{ transport.endDate }}</li>
          <br />
          <li v-if="transport.notes">Notes: {{ transport.notes }}</li>
        </ul>
        <EditButton
          @clickAdd="getFromChild"
          :item-name="itemName"
          :begin-name="beginName"
          :end-name="endName"
          :placeholder="placeholder"
          :nameValue="transport.name"
          :zipcodeValue="transport.zipcode"
          :cityValue="transport.city"
          :addressValue="transport.address"
          :startDateValue="transport.startDate"
          :endDateValue="transport.endDate"
          :notesValue="transport.notes"
          :idValue="transport.id"
        />
        <button v-if="isUserThere" class="rect-delete-btn" @click="deleteItem(index)">
          Delete
        </button>
      </li>
    </ul>
    <InputForm
      @clickAdd="getFromChild"
      :item-name="itemName"
      :begin-name="beginName"
      :end-name="endName"
      :placeholder="placeholder"
    />
    <router-link :to="{ path: '/trip/' + this.$route.params.id }"
      ><button>Back to Trip</button></router-link
    >
  </main>
</template>

<script>
import EditButton from '@/components/EditButton.vue'
import InputForm from '@/components/InputForm.vue'
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      isUserThere: false,
      tripApiUrl: 'http://localhost:3000/events',
      state: herdingCatsstore(),
      itemName: 'Transport',
      beginName: 'Departure',
      endName: 'Arrival',
      placeholder: 'e.g. Hauptbahnhof'
    }
  },
  computed: {
    transportEntries() {
      if (this.state.tripData.length > 0) {
        if (this.state.tripData[0].details) {
          return this.state.tripData[0].details.transport
        }
        return []
      } else {
        return []
      }
    }
  },

  components: {
    InputForm,
    EditButton
  },
  methods: {
    async checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    },

    getFromChild(data) {
      this.transportList = data
    },
    async deleteItem(index) {
      this.state.tripData[0].details.transport.splice(index, 1)
      await fetch(`${this.tripApiUrl}/${this.$route.params.id}/`, {
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
.container {
  background-color: var(--turqoise-notes);
  min-height: 10rem;
}
h3 {
  margin-top: 2rem;
  color: white;
  text-shadow: 0px 0.2rem 0.2rem rgba(255, 255, 255, 0.25);
}
.list-p {
  color: white;
  text-shadow: 0px 0.2rem 0.2rem rgba(255, 255, 255, 0.25);
}

.transport-entry + .transport-entry {
  border-top: 0.25rem solid rgb(255, 255, 255);
}
</style>
