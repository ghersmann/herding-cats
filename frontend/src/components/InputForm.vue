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
      <div v-if="isGroupMembers" class="admin-checkbox">
        <label for="set-admin">Admin</label>
        <input id="set-admin" type="checkbox" v-model="isAdmin" />
      </div>
      <button @click="addItem" class="sv-btn-green">Save</button>
      <button @click="closeDialog">Cancel</button>
    </form>
  </dialog>
  <footer>
    <button v-if="state.isUserThere" @click.prevent="openDialog">Add new {{ itemName }}</button>
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
      name: '',
      zipcode: '',
      city: '',
      address: '',
      startDate: '',
      endDate: '',
      notes: '',
      isAdmin: false,
      id: 1,
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

    async addItem() {
      if (this.name.trim() === '') {
        alert('Please fill out all required fields')
      } else {
        const newEntry = {
        id: Math.floor(Math.random() * 1000000).toString(),
        category: this.$route.name,
        startDate: this.convertDate(this.startDate),
        endDate: this.convertDate(this.endDate),
        name: this.name,
        zipcode: this.zipcode,
        city: this.city,
        address: this.address,
        notes: this.notes,
        isAdmin: this.isAdmin,
        }
        
        const category = this.$route.name
        this.state.tripData[0].details[category].push({ ...newEntry })

        await this.state.updateTripState(this.$route.params.id)

        this.name = ''
        this.zipcode = ''
        this.city = ''
        this.address = ''
        this.startDate = ''
        this.endDate = ''
        this.notes = ''
        this.isAdmin = false
        this.id = 1

        this.state.isModalOpen = false
      }
    },
    openDialog() {
      this.state.isModalOpen = true;
      this.$refs['add-item'].showModal();
    },
    closeDialog() {
      this.state.isModalOpen = false;
      this.$refs['add-item'].close();
    }
  },
  async created() {
    await this.$emit('clickAdd', this.tripDetails)
    await this.state.checkUser()
  },

  emits: ['clickAdd']
}
</script>
