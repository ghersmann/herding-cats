<template>
  <header>
    <a href="#" @click.prevent="$router.go(-1)"><img class="left" src="@/assets/arrow-white.svg" alt="Arrow symbol" /></a>
      <img class="center" src="../assets/cat-logo/cat-logo-small.svg" alt="Herding Cats Logo" />
    <!-- Is user there? go to alltravels, if not goto tripoverview -->
  <div class="right" @click.prevent="openMenu">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
  </div>
      
  </header>
</template>
  
<script>
  import { herdingCatsstore } from '@/stores/counter.js'
  export default {
    name: 'CatHeader',
    props: {},
    data() {
      return {
        state: herdingCatsstore(),
      }
    },
    methods: {
      openMenu() {
        console.log('menu')
      }
    }
  }
</script>
  
<style scoped>
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
  </style>
  