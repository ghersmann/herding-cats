<template>
  <div v-if="state.isModalOpen" class="overlay-mask" @click="closeDialog"></div>

  <dialog ref="add-item" class="popup-add-edit">
    <form method="dialog" class="addLodging">
      <div class="inputtext">
        <label class="required" for="item-name">{{ itemName }}:</label>
        <input type="text" required id="item-name" v-model="name" :placeholder="placeholder" />
      </div>
      <div class="inputtext">
        <label for="begin">{{ beginName }}:</label>
        <input type="datetime-local" id="begin" v-model="startDate" />
        <label for="end">{{ endName }}:</label>
        <input type="datetime-local" id="end" v-model="endDate" />
        <label for="address">Adress:</label>
        <input type="text" id="address" v-model="address" />
        <label for="zipcode">Zipcode:</label>
        <input type="text" id="zipcode" v-model="zipcode" />
        <label for="city">City:</label>
        <input type="text" id="city" v-model="city" />
        <label for="notes">Notes:</label>
        <input type="text" id="notes" v-model="notes" />
      </div>
      <div v-if="isGroupMembers" class="admin">
        <label for="set-admin">Admin</label>
        <input id="set-admin" type="checkbox" v-model="isAdmin" />
      </div>
    
      <button @click="editItem" class="sv-btn-green">Save</button>
      <button @click="closeDialog">Cancel</button>
    </form>
  </dialog>
  <footer>
    <button v-if="state.isUserThere" @click.prevent="openDialog">Edit</button>
  </footer>
</template>



<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripDetails: [],
        category: '',
        name: this.nameValue,
        zipcode: this.zipcodeValue,
        city: this.cityValue,
        address: this.addressValue,
        startDate: this.startDateValue,
        endDate: this.endDateValue,
        notes: this.notesValue,
        isAdmin: this.isAdminValue,
        id: this.idValue,
    }
  },

  props: {
    itemName: String,
    beginName: {
      type: String,
      default: 'From'
    },
    endName: {
      type: String,
      default: 'Until'
    },
    contentArray: Array,
    placeholder: String,
    nameValue: String,
    zipcodeValue: String,
    cityValue: String,
    addressValue: String,
    startDateValue: String,
    endDateValue: String,
    notesValue: String,
    isAdminValue: Boolean,
    idValue: String
  },

  computed: {
    isGroupMembers() {
      return this.$route.name === 'groupmembers'
    },
    isLodging() {
      return this.$route.name === 'lodging'
    },
    isTransport() {
      return this.$route.name === 'transport'
    },
    currenEntry() {
      const category = this.$route.name
      return this.state.tripData[0].details[category].find((item) => item.id === this.id)
    }
  },

  methods: {
    convertDate(date) {
      if (date.length >= 1) {
        const year = date.slice(0, 4)
        const month = date.slice(5, 7)
        const day = date.slice(8, 10)
        const time = date.slice(11, 16)
        const convertedDate = day + '.' + month + '.' + year + ' - ' + time
        return convertedDate.toString()
      }
    },
    //converts the date into a format that can be displayed in the edit dialog
    reconvertDate(date) {
      if (date.length >= 1) {
        const year = date.slice(6, 10)
        const month = date.slice(3, 5)
        const day = date.slice(0, 2)
        const time = date.slice(13, 18)
        const reconvertedDate = year + '-' + month + '-' + day + 'T' + time
        return reconvertedDate
      }
    },

    async editItem() {
  // Validate that the required fields (like 'name') are not empty
  if (this.name.trim() === '') {
    alert('Please fill out all required fields');
    return;
  }

  // Convert the start and end dates into the required format before updating
  const convertedStartDate = this.convertDate(this.startDate);
  const convertedEndDate = this.convertDate(this.endDate);

  // Update the properties of the current entry (the entry being edited)
  this.currenEntry.name = this.name;
  this.currenEntry.zipcode = this.zipcode;
  this.currenEntry.city = this.city;
  this.currenEntry.address = this.address;
  this.currenEntry.startDate = convertedStartDate; // Store converted date format
  this.currenEntry.endDate = convertedEndDate; // Store converted date format
  this.currenEntry.notes = this.notes;
  this.currenEntry.isAdmin = this.isAdmin; // If applicable

  // Update the tripData state and send the updated entry to the API
  try {
    await this.state.updateTripState(this.$route.params.id);
    this.state.isModalOpen = false
  } catch (error) {
    console.error('Failed to update trip data:', error);
    alert('An error occurred while updating the item.');
  }
},


    openDialog() {
      this.state.isModalOpen = true
      this.$refs['add-item'].showModal()
      if (this.startDateValue) {
        this.startDate = this.reconvertDate(this.startDateValue)
      }
      if (this.endDateValue) {
        this.endDate = this.reconvertDate(this.endDateValue)
      }
    },

    closeDialog() {
      this.state.isModalOpen = false
      this.$refs['add-item'].close()
    }
  },
  created() {
    this.$watch('nameValue', (newValue) => {
      this.name = newValue
    })
    this.$emit('clickAdd', this.tripDetails)
    if (this.startDateValue) {
      this.startDate = this.reconvertDate(this.startDateValue)
    }
    if (this.endDateValue) {
      this.endDate = this.reconvertDate(this.endDateValue)
    }
    this.state.checkUser()
  },

  emits: ['clickAdd']
}
</script>