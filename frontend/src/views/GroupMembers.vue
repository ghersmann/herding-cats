<template>
<CatHeader />

  <main id="form" class="container">
    <h2>Group Members</h2>
    <p
        v-if="Object.values(state.tripData[0].details).every((array) => array.length === 0)"
        class="placeholder-text"
      >
        Click "Add new Member" to start Herding your Cats
      </p>

    <ul class="list">
      <!-- Render admins that created the trip -->
      <li class="list-item" v-for="(groupMember, index) in filteredUsers" :key="index">
        <p class="list-p">{{ groupMember.name }} - Admin</p>
        <br />
        <ul>
          <li v-if="groupMember.startDate"><p class="list-p">From: {{ groupMember.startDate }}</p></li>
          <li v-if="groupMember.endDate"><p class="list-p">Until: {{ groupMember.endDate }}</p></li>
        </ul>
      </li>

      <!-- render group members that were manually added -->
      <li v-for="(groupMember, index) in this.groupmembersEntries" :key="index">
        <div class="list-item">
          <router-link :to="{ name: 'profile', params: { index: groupMember.id } }">
            <p class="list-p">{{ groupMember.name }} - {{ groupMember.isAdmin ? 'Admin' : 'Participant' }}</p>
          </router-link>

          <button v-if="state.isUserThere" class="delete-btn" @click="deleteMember(index)">x</button>
        </div>
        <ul>
          <li v-if="groupMember.startDate" class="member-dates">From: {{ groupMember.startDate }}</li>
          <li v-if="groupMember.endDate" class="member-dates">Until: {{ groupMember.endDate }}</li>
        </ul>
      </li>
    </ul>
    <div class="input-area">
      <InputForm @clickAdd="getFromChild" :item-name="itemName" :placeholder="placeholder" />
      <router-link :to="{ path: '/trip/' + this.$route.params.id }"
        ><button>Back to Trip</button></router-link
      >
    </div>
  </main>
</template>

<script>
import InputForm from '@/components/InputForm.vue'
import CatHeader from '@/components/CatHeader.vue'
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      state: herdingCatsstore(),
      itemName: 'Member',
      placeholder: 'e.g. Max Mustermann'
    }
  },

  components: {
    InputForm,
    CatHeader
  },

  computed: {
    // filter out users that were loaded in via loadUserData()
    // but that don't participate in the trip
    filteredUsers() {
      const { userData } = this.state
      if (!userData || !this.$route.params.id) {
        return []
      }

      return userData.filter((user) => user.trips.includes(this.$route.params.id))
    },

    groupmembersEntries() {
      if (this.state.tripData.length > 0) {
        if (this.state.tripData[0].details) {
          return this.state.tripData[0].details.groupmembers
        }
        return []
      } else {
        return []
      }
    },

    adminsEntries() {
      if (this.state.tripData.length > 0) {
        if (this.state.tripData[0].details) {
          return this.state.tripData[0].admins
        }
        return []
      } else {
        return []
      }
    }
  },

  methods: {
    deleteMember(index) {
      this.state.tripData[0].details.groupmembers.splice(index, 1)
      this.state.updateTripState(this.$route.params.id)
    },

    goToProfile(id) {
      this.$router.push({ name: 'profile', params: { id } })
    },

    getFromChild(data) {
      this.groupMembers = data
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
  background-color: var(--turqoise-gray-background);
}

.list-p,
p {
  color: white;
}

.list-item {
  height: 4rem;
}
</style>
