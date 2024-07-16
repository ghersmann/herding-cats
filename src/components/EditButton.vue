<template>
  <dialog ref="add-item">
    <form method="dialog" class="addLodging">
      <div class="inputtext">
        <label class="required" for="item-name">{{ itemName }}:</label>
        <input required id="item-name" v-model="newEntry.name" :placeholder="placeholder" />
      </div>
      <div class="inputtext">
        <label v-if="!isGroupMembers" for="zipcode">Zipcode:</label>
        <input v-if="!isGroupMembers" id="zipcode" v-model="newEntry.zipcode" />
        <label v-if="!isGroupMembers" for="city">City:</label>
        <input v-if="!isGroupMembers" id="city" v-model="newEntry.city" />
        <label v-if="!isGroupMembers" for="address">Adress:</label>
        <input v-if="!isGroupMembers" id="address" v-model="newEntry.address" />
        <label for="begin">{{ beginName }}:</label>
        <input type="datetime-local" id="begin" v-model="newEntry.startDate" />
        <label for="end">{{ endName }}:</label>
        <input type="datetime-local" id="end" v-model="newEntry.endDate" />
        <label v-if="!isGroupMembers" for="notes">Notes:</label>
        <input v-if="!isGroupMembers" id="notes" v-model="newEntry.notes" />
      </div>
      <div v-if="isGroupMembers" class="admin">
        <input id="set-admin" type="checkbox" v-model="newEntry.isAdmin" />
        <label for="set-admin">Admin</label>
      </div>
      <button @click="editItem">Save</button>
      <button @click="closeDialog">Cancel</button>
    </form>
  </dialog>
  <footer>
    <button v-if="isUserThere" @click.prevent="openDialog">Edit</button>
  </footer>
</template>

<style>
.inputtext input {
  margin-bottom: 10px;
  display: block;
}

.admin input {
  margin-right: 5px;
}
</style>

<script>
import { herdingCatsstore } from '@/stores/counter.js'
export default {
  data() {
    return {
      isUserThere: false,
      tripApiUrl: 'http://localhost:3000/events',
      state: herdingCatsstore(),
      tripDetails: [],
      newEntry: {
        category: '',
        name: this.nameValue,
        zipcode: this.zipcodeValue,
        city: this.cityValue,
        address: this.addressValue,
        startDate: this.startDateValue,
        endDate: this.endDateValue,
        notes: this.notesValue,
        isAdmin: this.isAdminValue,
        id: this.idValue
      }
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
      return this.state.tripData[0].details[category].find((item) => item.id === this.newEntry.id)
    }
  },

  methods: {
    async checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    },

    convertDate(date) {
      if (date.length >= 1) {
        const year = date.slice(0, 4)
        const month = date.slice(5, 7)
        const day = date.slice(8, 10)
        const time = date.slice(11, 16)
        const convertedDate = day + '.' + month + '.' + year + ' - ' + time
        return convertedDate
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
      if (this.newEntry.name.trim() === '') {
        alert('Please fill out all required fields')
      } else {
        if (this.newEntry.startDate) {
          this.newEntry.startDate = this.convertDate(this.newEntry.startDate)
        }
        if (this.newEntry.endDate) {
          this.newEntry.endDate = this.convertDate(this.newEntry.endDate)
        }
        this.currenEntry.name = this.newEntry.name
        this.currenEntry.zipcode = this.newEntry.zipcode
        this.currenEntry.city = this.newEntry.city
        this.currenEntry.address = this.newEntry.address
        this.currenEntry.startDate = this.newEntry.startDate
        this.currenEntry.endDate = this.newEntry.endDate
        this.currenEntry.notes = this.newEntry.notes

        await fetch(`${this.tripApiUrl}/${this.$route.params.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.tripData[0])
        })
      }
    },
    openDialog() {
      this.$refs['add-item'].showModal()
      if (this.startDateValue) {
        this.newEntry.startDate = this.reconvertDate(this.startDateValue)
      }
      if (this.endDateValue) {
        this.newEntry.endDate = this.reconvertDate(this.endDateValue)
      }
    },
    closeDialog() {
      this.$refs['add-item'].close()
    }
  },
  created() {
    this.$watch('nameValue', (newValue) => {
      this.newEntry.name = newValue
    })
    this.$emit('clickAdd', this.tripDetails)
    if (this.startDateValue) {
      this.newEntry.startDate = this.reconvertDate(this.startDateValue)
    }
    if (this.endDateValue) {
      this.newEntry.endDate = this.reconvertDate(this.endDateValue)
    }
    this.checkUser()
  },

  emits: ['clickAdd']
}
</script>
