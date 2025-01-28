<template>
  <div v-if="state.isModalOpen" class="overlay-mask" @click="closeDialog"></div>

  <dialog ref="edit-item" class="popup-add-edit" v-bind="$attrs">
    <form class="editLodging">
      <div class="inputtext">
        <label class="required" for="item-name">{{ itemName }}:</label>
        <input type="text" required id="item-name" v-model="name" :placeholder="placeholder" />
      </div>
      <div class="inputtext">
        <label for="begin">{{ beginName }}:</label>
        <input type="datetime-local" id="begin" v-model="startDate" />
        <label for="end">{{ endName }}:</label>
        <input type="datetime-local" id="end" v-model="endDate" />
        <label for="address">Address:</label>
        <input type="text" id="address" v-model="address" />
        <label for="zipcode">Zipcode:</label>
        <input type="text" id="zipcode" v-model="zipcode" />
        <label for="city">City:</label>
        <input type="text" id="city" v-model="city" />
        <label for="notes">Notes:</label>
        <input type="text" id="notes" v-model="notes" />
      </div>
      <div v-if="isGroupMembers" class="admin-checkbox">
        <label for="set-admin">Admin</label>
        <input id="set-admin" type="checkbox" v-model="isAdmin" />
      </div>
      <button type="button" @click="editItem" class="sv-btn-green">Save</button>
      <button type="button" @click="closeDialog">Cancel</button>
    </form>
  </dialog>
  <footer>
    <button v-if="state.isUserThere" @click.prevent="openDialog">Edit {{ itemName }}</button>
  </footer>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js';
export default {
  data() {
    return {
      state: herdingCatsstore(),
      tripDetails: [],
      category: '',
      name: '',
      zipcode: '',
      city: '',
      address: '',
      startDate: '',
      endDate: '',
      notes: '',
      isAdmin: false,
      id: null, // Use the correct ID for editing
    };
  },

  props: {
    itemName: String,
    beginName: {
      type: String,
      default: 'From',
    },
    endName: {
      type: String,
      default: 'Until',
    },
    contentArray: Array,
    placeholder: String,
    nameValue: String, // Add these
    zipcodeValue: String,
    cityValue: String,
    addressValue: String,
    startDateValue: String,
    endDateValue: String,
    notesValue: String,
    idValue: [String, Number],
  },

  computed: {
    isGroupMembers() {
      return this.$route.name === 'groupmembers';
    },
    isLodging() {
      return this.$route.name === 'lodging';
    },
    isTransport() {
      return this.$route.name === 'transport';
    },
  },

  methods: {
    dateToString(date) {
      if (date.length >= 1) {
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8, 10);
        const time = date.slice(11, 16);
        return `${day}.${month}.${year} - ${time}`;
      }
    },

    stringDateToIso(date) {
      if (!date) return ''; // Return an empty string for undefined/null/empty input

      // Match and extract the day, month, year, hour, and minute from the input format
      const dateRegex = /^(\d{2})\.(\d{2})\.(\d{4}) - (\d{2}):(\d{2})$/;
      const match = date.match(dateRegex);

      if (!match) {
        console.error('Invalid date format:', date);
        return ''; // Return an empty string for invalid formats
      }

      const [, day, month, year, hour, minute] = match;

      // Build an ISO format string: "yyyy-MM-ddTHH:mm"
      const isoDate = `${year}-${month}-${day}T${hour}:${minute}`;
      return isoDate;
    },

    async editItem() {
      if (this.name.trim() === '') {
        alert('Please fill out all required fields');
        return; // Prevent further execution if fields are empty
      }

      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);

      // Validation for startDate and endDate
      if (endDate < startDate) {
        alert(`${this.endName} cannot be earlier than the ${this.beginName}.`);
        this.endDate = ''; // Optionally clear the invalid field
        return; // Prevent further execution
      }

      // Find the item to edit in the state data
      const category = this.$route.name;
      const itemIndex = this.state.tripData[0].details[category].findIndex((item) => item.id === this.id);

      if (itemIndex !== -1) {
        const updatedEntry = {
          id: this.id, // Retain the original ID
          category: category,
          startDate: this.dateToString(this.startDate),
          endDate: this.dateToString(this.endDate),
          name: this.name,
          zipcode: this.zipcode,
          city: this.city,
          address: this.address,
          notes: this.notes,
          isAdmin: this.isAdmin,
        };

        // Update the item in the state
        this.state.tripData[0].details[category][itemIndex] = updatedEntry;

        // Update the state in the store
        await this.state.updateTripState(this.$route.params.id);

        // Reset form fields after successful edit
        this.resetFields();

        // Close the dialog
        this.closeDialog();
      } else {
        alert('Item not found for editing.');
      }
    },

    openDialog() {
      this.state.isModalOpen = true;
      this.$refs['edit-item'].showModal();

      this.id = this.idValue;
      this.name = this.nameValue;
      this.zipcode = this.zipcodeValue;
      this.city = this.cityValue;
      this.address = this.addressValue;
      this.startDate = this.stringDateToIso(this.startDateValue);
      this.endDate = this.stringDateToIso(this.endDateValue);
      this.notes = this.notesValue;
    },

    closeDialog() {
      this.state.isModalOpen = false;
      this.$refs['edit-item'].close();
    },

    resetFields() {
      this.id = null;
      this.name = '';
      this.zipcode = '';
      this.city = '';
      this.address = '';
      this.startDate = '';
      this.endDate = '';
      this.notes = '';
      this.isAdmin = false;
    },
  },

  async created() {
    await this.$emit('clickEdit', this.tripDetails);
    await this.state.checkUser();
  },

  emits: ['clickEdit', 'clickAdd'],
};
</script>
