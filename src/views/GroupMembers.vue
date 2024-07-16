<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
  </header>
  <main id="form" class="container">
    <h2 class="title">Group Members</h2>
    <ul class="list list-p">
      <!-- render admins that created the trip, 
            so that they don't have to manually add themselves. 
            because they are stored in /users and not in /events, 
            they are currently non interactable
          -->
      <li class="list-item" v-for="(groupMember, index) in filteredUsers" :key="index">
        {{ groupMember.name }} - Admin
        <br />
        <ul>
          <li v-if="groupMember.startDate">From: {{ groupMember.startDate }}</li>
          <li v-if="groupMember.endDate">Until: {{ groupMember.endDate }}</li>
        </ul>
      </li>

      <!-- render group members that were manually added -->
      <li v-for="(groupMember, index) in this.groupmembersEntries" :key="index">
        <div class="list-item">
          <router-link :to="{ name: 'profile', params: { index: groupMember.id } }">
            {{ groupMember.name }} - {{ groupMember.isAdmin ? 'Admin' : 'Participant' }}
          </router-link>

          <button v-if="isUserThere" class="delete-btn" @click="deleteMember(index)">x</button>
        </div>
        <ul class="member-dates">
          <li v-if="groupMember.startDate">From: {{ groupMember.startDate }}</li>
          <li v-if="groupMember.endDate">Until: {{ groupMember.endDate }}</li>
        </ul>
      </li>
    </ul>
    <div class="btns">
      <InputForm @clickAdd="getFromChild" :item-name="itemName" :placeholder="placeholder" />
      <router-link :to="{ path: '/trip/' + this.$route.params.id }"
        ><button>Back to Trip</button></router-link
      >
    </div>
  </main>
</template>

<script>
import InputForm from '@/components/InputForm.vue'
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  data() {
    return {
      isUserThere: false,
      tripApiUrl: 'http://localhost:3000/events',
      state: herdingCatsstore(),
      itemName: 'Member',
      placeholder: 'e.g. Max Mustermann'
    }
  },
  created() {
    this.state.loadTripData(this.$route.params.id)
    this.state.loadUserData()
    this.checkUser()
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
  components: {
    InputForm
  },

  methods: {
    async checkUser() {
      if (this.state.user === null || Object.keys(this.state.user).length === 0) {
        this.isUserThere = false
      } else {
        this.isUserThere = true
      }
    },

    async deleteMember(index) {
      this.state.tripData[0].details.groupmembers.splice(index, 1)
      await fetch(`${this.tripApiUrl}/${this.$route.params.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.state.tripData[0])
      })
    },
    goToProfile(id) {
      this.$router.push({ name: 'profile', params: { id } })
    },
    getFromChild(data) {
      this.groupMembers = data
    }
  }
}
</script>

<style scoped>
.list-item {
  justify-content: space-between;
  margin-top: 2rem;
}

.delete-btn {
  line-height: 0rem;
}
.container {
  display: flex;
  flex-direction: column;
  background-color: var(--turqoise-gray-background);
}

.btns {
  margin-top: auto;
  margin-bottom: 0;
}

.list-p,
a {
  font-size: 2rem;
  color: white;
  text-shadow: 0px 0.2rem 0.2rem rgba(255, 255, 255, 0.25);
}
</style>
