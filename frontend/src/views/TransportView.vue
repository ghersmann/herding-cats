<template>
 <CatHeader />

  <main class="container">
    <h2>Transport</h2>
    <p
        v-if="Object.values(state.tripData[0].details.transport).every((array) => array.length === 0)"
        class="placeholder-text"
      >
        Click "Add new Transport" to start Herding your Cats
    </p>

    <ul>
      <li
        class="transport-entry"
        v-for="(transport, index) of sortedTransportEntries"
        :key="transport.id"
      >
        <h3>{{ transport.name }}</h3>
        <ul class="entry-p">
          <li>{{ transport.address }}</li>
          <li>{{ transport.zipcode }} {{ transport.city }}</li>
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
        <button v-if="state.isUserThere" class="rect-delete-btn" @click="removeTransport(transport.id)">
          Delete
        </button>
      </li>
    </ul>
    <div class="input-area">
    <InputForm
      @clickAdd="getFromChild"
      :item-name="itemName"
      :begin-name="beginName"
      :end-name="endName"
      :placeholder="placeholder"
    />
          <router-link :to="{ path: '/timeline/' + this.$route.params.id }">
        <button class="timeline-btn">Trip Timeline</button>
      </router-link>
    <router-link :to="{ path: '/trip/' + this.$route.params.id }"
      ><button>Back to Trip</button></router-link
    >
    </div>
  </main>
</template>

<script>
import EditButton from '@/components/EditButton.vue'
import InputForm from '@/components/InputForm.vue'
import CatHeader from '@/components/CatHeader.vue'
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      state: herdingCatsstore(),
      itemName: 'Transport',
      beginName: 'Departure',
      endName: 'Arrival',
      placeholder: 'Flight, Train, Car etc...'
    }
  },
  computed: {
transportEntries() {
    if (this.state.tripData.length > 0) {
      if (this.state.tripData[0].details) {
        const transportData = this.state.tripData[0].details.transport;
        return transportData;
      }
      return [];
    } else {
      return [];
    }},

sortedTransportEntries() {
  return this.transportEntries.slice().sort((a, b) => {
    const [dayA, monthA, yearA, timeA] = a.startDate.split(/[.\s-]+/); 
    const [dayB, monthB, yearB, timeB] = b.startDate.split(/[.\s-]+/);

    const dateA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

    return dateA - dateB;
  });
}
  },

  components: {
    InputForm,
    EditButton,
    CatHeader
  },

  methods: {
    getFromChild(data) {
      this.transportList = data
    },
    
    async removeTransport(id) {
  if (confirm('Are you sure you wish to delete this?')) {
    const transportList = this.state.tripData[0].details.transport;
    const indexToRemove = transportList.findIndex(transport => transport.id === id);
    if (indexToRemove !== -1) {
      transportList.splice(indexToRemove, 1);
      await this.state.updateTripState(this.$route.params.id);
    } else {
      console.error('Transport entry not found for deletion');
    }
  }
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
  background-color: var(--turqoise-notes);
}

h3, p, .entry-p {
  color: white;
}

.transport-entry + .transport-entry {
  border-top: 0.25rem solid rgb(255, 255, 255);
}
</style>
