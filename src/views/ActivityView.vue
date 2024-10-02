<template>
  <CatHeader />

  <main class="container">
    <h2 class="title">Activities</h2>
    <ul>
      <li class="activity-entry" v-for="(activity, index) of activityEntries" :key="index">
        <h3>{{ activity.name }}</h3>
        <ul class="list-p">
          <li>{{ activity.zipcode }} {{ activity.city }}</li>
          <li>{{ activity.address }}</li>
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
        <button v-if="isUserThere" class="rect-delete-btn" @click="removeActivity(index)">
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
import CatHeader from '@/components/CatHeader.vue';
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      isUserThere: false,
      state: herdingCatsstore(),
      itemName: 'Activity',
      placeholder: 'e.g. Museum'
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
    }
  },
  methods: {
    checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    },

    getFromChild(data) {
      this.transportList = data
    },

    removeActivity(index) {
      this.state.tripData[0].details.activity.splice(index, 1)
      this.state.deleteItem(this.$route.params.id)
    },
  },
  created() {
    this.checkUser()
    this.state.loadTripData(this.$route.params.id)
  }
}
</script>

<style scoped>
.container {
  background-color: var(--pink-activities);
  min-height: 10rem;
}

h3 {
  margin-top: 2rem;
}

.title {
  color: black;
  text-shadow: 0px 0.2rem 0.2rem rgba(0, 0, 0, 0.25);
}
</style>
