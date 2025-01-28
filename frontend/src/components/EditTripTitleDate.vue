<template>
  <div class="edit-trip" @click="editTripTitleDate">
    <h3>
      {{ state.tripData[0].tripTitle }}
    </h3>
    <h4>
      {{ state.tripData[0].tripStart.split(' ')[0] }} -
      {{ state.tripData[0].tripEnd.split(' ')[0] }}
    </h4>
  </div>
  <dialog class="popup-add-edit" ref="edit-trip-title">
    <form method="dialog" action="" >
      <input
      class="trip-title"
        type="text"
        name="edit-title"
        id="edit-title"
        :placeholder="state.tripData[0].tripTitle"
        v-model="state.tripData[0].tripTitle"
      />
 <label class="required">Start of trip</label>
      <input class="trip-title" v-model="formattedStartDate" type="datetime-local" />

      <label class="required">End of trip</label>
      <input class="trip-title" v-model="formattedEndDate" type="datetime-local" />

      <button @click="saveTripChanges" class="sv-btn-green">Save</button>

      <button @click="cancelEdit">Cancel</button>
    </form>
  </dialog>
</template>


<script>
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      name: 'EditTripTitleDate',
      state: herdingCatsstore(),
      formattedStartDate: '',
      formattedEndDate: '',

    }
  },
  methods: {
    validateDates() {
  if (!this.formattedStartDate || !this.formattedEndDate) {
    alert('Both start date and end date must be provided.');
    return false;
  }

  const startDate = new Date(this.formattedStartDate);
  const endDate = new Date(this.formattedEndDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    alert('Invalid date format.');
    return false;
  }

  if (endDate < startDate) {
    alert('End date cannot be earlier than the start date.');
    return false;
  }

  return true;
},


    formatDateToInput(date) {
  try {
    const [datePart, timePart] = date.split(' - ');
    const [day, month, year] = datePart.split('.');
    return `${year}-${month}-${day}T${timePart}`;
  } catch (error) {
    console.error('Invalid date format:', date);
    return '';
  }
},


    formatDateFromInput(date) {
      const [datePart, timePart] = date.split('T');
      const [year, month, day] = datePart.split('-');
      return `${day}.${month}.${year} - ${timePart}`;
    },

    formatDateForDisplay(date) {
      return this.formatDateFromInput(this.formatDateToInput(date));
    },

    editTripTitleDate() {
      if (this.state.isUserThere) {
      this.state.isModalOpen = true;
      this.formattedStartDate = this.formatDateToInput(this.state.tripData[0].tripStart);
      this.formattedEndDate = this.formatDateToInput(this.state.tripData[0].tripEnd);
      this.$refs['edit-trip-title'].showModal();
      }
    },

    cancelEdit() {
      this.state.isModalOpen = false;
      this.$refs['edit-trip-title'].close();
    },

    async saveTripChanges() {
  if (this.validateDates()) {
    console.log('Validation passed. Saving changes...');
    this.state.tripData[0].tripStart = this.formatDateFromInput(this.formattedStartDate);
    this.state.tripData[0].tripEnd = this.formatDateFromInput(this.formattedEndDate);

    await this.state.updateTripState(this.$route.params.id);
    this.state.isModalOpen = false;
    this.$refs['edit-trip-title'].close();
  } else {
    console.error('Validation failed. Changes not saved.');
    this.state.isModalOpen = false;
    this.$refs['edit-trip-title'].close();
  }
}

  }
}
</script>

<style scoped>
h4 {
  margin-top: 1rem;
}

.edit-trip {
  cursor: pointer;
  margin-bottom: 1rem;
}

.popup-add-edit {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>
