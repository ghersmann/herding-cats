<template>
<CatHeader />

  <main class="container">
    <h2>Lodging</h2>
    <p
        v-if="Object.values(state.tripData[0].details).every((array) => array.length === 0)"
        class="placeholder-text"
      >
        Click "Add new Lodging" to start Herding your Cats
      </p>
    <ul>
      <li class="lodging-entry" v-for="(lodging, index) of lodgingEntries" :key="index">
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
        <button v-if="state.isUserThere" class="rect-delete-btn" @click="removeLodging(index)">
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

    removeLodging(index) {
      this.state.tripData[0].details.lodging.splice(index, 1)
      this.state.updateTripState(this.$route.params.id)
    },
  },
  created() {
    this.state.checkUser()
    this.state.loadTripData(this.$route.params.id)
  }
}
</script>

<style scoped>
.container {
  background-color: var(--gray-accomodation);
}

h2 {
  color: black;
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
}
</style>
