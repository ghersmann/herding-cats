<template>
  <div v-if="state.isMenuOpen" class="overlay-mask" @click="closeDialog"></div>
<div class="header-container">
  <header>
    <a href="#" @click.prevent="$router.go(-1)">
      <img class="left" src="@/assets/arrow-white.svg" alt="Arrow symbol" />
    </a>
    
    <a :href="state.isUserThere ? '/AllTravels' : '/trip/' + $route.params.id">
      <img class="center" src="../assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
    </a>
    
    <div class="right" @click.prevent="openMenu">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </header>

  <div class="side-menu" v-show="state.isMenuOpen">
    <form class="side-menu-form">
      <nav>
        <ul>
          <li><a href="/home" @click.prevent="navigateTo('/')" class="menu-p">Start Page</a></li>
          <li v-if="state.isUserThere"><a href="/AllTravels" @click.prevent="navigateTo('/AllTravels')" class="menu-p">My Travels</a></li>
          <li v-if="state.isUserThere"><a href="/settings" @click.prevent="navigateTo('/settings')" class="menu-p">Settings</a></li>
          <li><a href="/about" @click.prevent="navigateTo('/about')" class="menu-p">About</a></li>
        </ul>
        <ul>
          <li><router-link :to="{ path: '/trip/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Trip Overview</router-link
          ></li>
          <li><router-link :to="{ path: '/timeline/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Timeline</router-link
          ></li>
          <li><router-link :to="{ path: '/transport/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Transport</router-link
          ></li>
          <li><router-link :to="{ path: '/lodging/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Lodging</router-link
          >
          </li>
          <li><router-link :to="{ path: '/activity/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Activity</router-link
          ></li>
          <li><router-link :to="{ path: '/groupmembers/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Group Members</router-link
          ></li>
          <li><router-link :to="{ path: '/packlist/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Packing List</router-link
          ></li>
          <li><router-link :to="{ path: '/notes/' + this.$route.params.id }"
            @click.prevent="closeDialog()" class="menu-p">Notes</router-link
          ></li>
        </ul>
      </nav>
      <button @click.prevent="closeDialog" class="close-btn">Close Menu</button>
    </form>
  </div>
</div>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js';

export default {
  name: 'CatHeader',
  data() {
    return {
      state: herdingCatsstore(),
    };
  },
  methods: {
    openMenu() {
      this.state.isMenuOpen = !this.state.isMenuOpen;
    },
    closeDialog() {
      this.state.isMenuOpen = false;
    },
    navigateTo(path) {
      this.$router.push(path);
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.header-container {
  position: relative;
  width: 32rem;
  margin: 0 auto;
}

.side-menu {
  position: absolute; /* Positioned relative to .header-container */
  top: calc(100%); /* Places it below the header; add margin if needed */
  right: 0; /* Aligns right side of the menu with the right side of the header */
  width: 24rem;
  min-height: 20rem;
  background-color: var(--turqoise-gray-background);
  padding: 2rem;
  border-radius: 1rem;
  z-index: 1000; /* Ensures menu stacks above other elements */
}

.side-menu-form {
  display: flex;
  flex-direction: column;
}

header {
  margin: 1rem auto;
  width: 32rem;
  display: grid;
  grid-template-areas: "left center right";
  grid-template-columns: 2fr 1fr 2fr;
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  align-items: center;
}

.left {
  grid-area: left;
  margin-left: 1rem;
}

.center {
  grid-area: center;
  justify-self: center;
}

.right {
  grid-area: right;
  justify-self: end;
  margin-right: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 2rem;
}

.line {
  height: 0.2rem;
  width: 3rem;
  background-color: white;
  border-radius: 0.2rem;
}

.menu-p {
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 1.8rem;
  line-height: 4rem;
  margin-left: auto;
  margin-right: 0;
  color: white;
}

.close-btn {
  margin-top: 3rem;
  margin-bottom: 0;
}

button:hover,
button:focus {
  box-shadow: none;
}
</style>
