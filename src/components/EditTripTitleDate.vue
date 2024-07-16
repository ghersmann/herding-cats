<template>
  <div @click="editTripTitleDate">
    <h3>
      {{ state.tripData[0].tripTitle }}
    </h3>
    <h4>
      {{ state.tripData[0].tripStart.split(' ')[0] }} -
      {{ state.tripData[0].tripEnd.split(' ')[0] }}
    </h4>
  </div>
  <dialog class="edit-trip-title" ref="edit-trip-title">
    <form method="dialog" action="">
      <input
        type="text"
        name="edit-title"
        id="edit-title"
        :placeholder="state.tripData[0].tripTitle"
        v-model="state.tripData[0].tripTitle"
      />

      <button @click="saveTripChanges">Save Changes</button>

      <button class="cancel-btn">Cancel</button>
    </form>
  </dialog>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      name: 'EditTripTitleDate',
      state: herdingCatsstore()
    }
  },
  methods: {
    editTripTitleDate() {
      this.$refs['edit-trip-title'].showModal()
    },
    async saveTripChanges() {
      await fetch(`${this.state.apiUrl}events/${this.$route.params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.tripData[0])
      })
    }
  }
}
</script>

<style scoped>
h4 {
  margin-top: 1rem;
}
.cancel-btn {
  background-color: var(--required-red);
}
</style>
