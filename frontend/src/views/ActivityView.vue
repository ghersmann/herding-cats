<template>
  <CatHeader />

  <main class="container">
    <h2>Activities</h2>
    <p
        v-if="Object.values(state.tripData[0].details.activity).every((array) => array.length === 0)"
        class="placeholder-text"
      >
        Click "Add new Activity" to start Herding your Cats
      </p>
    <ul>
      <li class="activity-entry" v-for="(activity, index) of sortedActivityEntries" :key="index">
        <h3>{{ activity.name }}</h3>
        <ul class="entry-p">
          <li>{{ activity.address }}</li>
          <li>{{ activity.zipcode }} {{ activity.city }}</li>
          <li v-if="activity.startDate">From: {{ activity.startDate }}</li>
          <li v-if="activity.endDate">Until: {{ activity.endDate }}</li>
          <br />
          <li v-if="activity.notes">Notes: {{ activity.notes }}</li>
        </ul>
        <EditButton
          @clickAdd="getFromChild"
          :item-name="itemName"
          :begin-name="beginName"
          :end-name="endName"
          :placeholder="placeholder"
          :nameValue="activity.name"
          :zipcodeValue="activity.zipcode"
          :cityValue="activity.city"
          :addressValue="activity.address"
          :startDateValue="activity.startDate"
          :endDateValue="activity.endDate"
          :notesValue="activity.notes"
          :idValue="activity.id"
        />
        <button v-if="state.isUserThere" class="rect-delete-btn" @click="removeActivity(activity.id)">
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
      itemName: 'Activity',
      beginName: 'Start',
      endName: 'End',
      placeholder: 'Museum, Party, Sports etc...'
    }
  },
  components: {
    InputForm,
    EditButton,
    CatHeader
  },
  computed: {
    activityEntries() {
      if (this.state.tripData.length > 0) {
        if (this.state.tripData[0].details) {
          return this.state.tripData[0].details.activity
        }
        return []
      } else {
        return []
      }
    },
    sortedActivityEntries() {
  return this.activityEntries.slice().sort((a, b) => {
    const [dayA, monthA, yearA, timeA] = a.startDate.split(/[.\s-]+/); 
    const [dayB, monthB, yearB, timeB] = b.startDate.split(/[.\s-]+/);

    const dateA = new Date(`${yearA}-${monthA}-${dayA}T${timeA}`);
    const dateB = new Date(`${yearB}-${monthB}-${dayB}T${timeB}`);

    return dateA - dateB;
  });
}
  },
  methods: {
    getFromChild(data) {
      this.transportList = data
    },

    async removeActivity(id) {
  if (confirm('Are you sure you wish to delete this?')) {
    const activityList = this.state.tripData[0].details.activity;
    const indexToRemove = activityList.findIndex(activity => activity.id === id);
    if (indexToRemove !== -1) {
      activityList.splice(indexToRemove, 1);
      await this.state.updateTripState(this.$route.params.id);
    } else {
      console.error('Activity entry not found for deletion');
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
  background-color: var(--pink-activities);
}

h2 {
  color: black;
}
</style>
