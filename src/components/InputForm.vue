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
      <button @click="addItem">Save</button>
      <button @click="closeDialog">Cancel</button>
    </form>
  </dialog>
  <footer>
    <button v-if="isUserThere" @click.prevent="openDialog">Add new {{ itemName }}</button>
  </footer>
</template>

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
        name: '',
        zipcode: '',
        city: '',
        address: '',
        startDate: '',
        endDate: '',
        notes: '',
        isAdmin: false,
        id: 1
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
    placeholder: String
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

    async addItem() {
      if (this.newEntry.name.trim() === '') {
        alert('Please fill out all required fields')
      } else {
        this.newEntry.id = Math.floor(Math.random() * 1000000).toString()
        this.newEntry.category = this.$route.name
        const category = this.$route.name
        this.newEntry.startDate = this.convertDate(this.newEntry.startDate)
        this.newEntry.endDate = this.convertDate(this.newEntry.endDate)
        this.state.tripData[0].details[category].push({ ...this.newEntry })

        await fetch(`${this.tripApiUrl}/${this.$route.params.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.state.tripData[0])
        })

        this.newEntry.name = ''
        this.newEntry.zipcode = ''
        this.newEntry.city = ''
        this.newEntry.address = ''
        this.newEntry.startDate = ''
        this.newEntry.endDate = ''
        this.newEntry.notes = ''
        this.newEntry.isAdmin = false
      }
    },
    openDialog() {
      this.$refs['add-item'].showModal()
    },
    closeDialog() {
      this.$refs['add-item'].close()
    }
  },
  created() {
    this.$emit('clickAdd', this.tripDetails)
    this.checkUser()
  },

  emits: ['clickAdd']
}
</script>

<style scoped>
.inputtext {
  margin-bottom: 1rem;
  display: block;
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 1.5rem;
  color: #000000;
}
.admin input {
  margin-right: 5px;
}
</style>
