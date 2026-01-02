<template>
<CatHeader />

  <main class="container">
    <h2>Lodging</h2>
    <p
        v-if="Object.values(state.tripData[0].details.lodging).every((array) => array.length === 0)"
        class="placeholder-text"
      >
        Click "Add new Lodging" to start Herding your Cats
      </p>
    <ul>
      <li class="lodging-entry" v-for="(lodging, index) of sortedLodgingEntries" :key="index">
        <h3>{{ lodging.name }}</h3>
        <ul class="entry-p">
          <li>{{ lodging.zipcode }} {{ lodging.city }}</li>
          <li>{{ lodging.address }}</li>
          <li v-if="lodging.startDate">From: {{ lodging.startDate }}</li>
          <li v-if="lodging.endDate">Until: {{ lodging.endDate }}</li>
          <br />
          <li v-if="lodging.notes">Notes: {{ lodging.notes }}</li>
        </ul>
        <EditButton
          @clickAdd="getFromChild"
          :item-name="itemName"
          :begin-name="beginName"
          :end-name="endName"
          :placeholder="placeholder"
          :nameValue="lodging.name"
          :zipcodeValue="lodging.zipcode"
          :cityValue="lodging.city"
          :addressValue="lodging.address"
          :startDateValue="lodging.startDate"
          :endDateValue="lodging.endDate"
          :notesValue="lodging.notes"
          :idValue="lodging.id"
        />
        <button v-if="state.isUserThere" class="rect-delete-btn" @click="removeLodging(lodging.id)">
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
import CatHeader from '@/components/CatHeader.vue';
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      state: herdingCatsstore(),
      itemName: 'Lodging',
      beginName: 'Arrival',
      endName: 'Departure',
      placeholder: 'Hotel, Pension, AirBnB etc...'
    }
  },
  computed: {
    lodgingEntries() {
      if (this.state.tripData.length > 0) {
        if (this.state.tripData[0].details) {
          return this.state.tripData[0].details.lodging
        }
        return []
      } else {
        return []
      }
    },
    sortedLodgingEntries() {
  return this.lodgingEntries.slice().sort((a, b) => {
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
      this.lodgingList = data
    },

    async removeLodging(id) {
  if (confirm('Are you sure you wish to delete this?')) {
    const lodgingList = this.state.tripData[0].details.lodging;
    const indexToRemove = lodgingList.findIndex(lodging => lodging.id === id);
    if (indexToRemove !== -1) {
      lodgingList.splice(indexToRemove, 1);
      await this.state.updateTripState(this.$route.params.id);
    } else {
      console.error('Lodging entry not found for deletion');
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
  background-color: var(--gray-accomodation);
}

h2 {
  color: black;
}
</style>
