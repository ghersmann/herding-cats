<template>
  <label class="switch" for="switch-input">
    <span class="label-text">{{ labelText }}</span>
    <input 
      id="switch-input" 
      name="switch" 
      type="checkbox" 
      v-model="tripPublicState"
    />
    <span class="switch-background"></span>
  </label>
</template>

<script>
import { herdingCatsstore } from '@/stores/counter.js'

export default {
  name: 'ToggleSwitch',
  props: {
    labelText: String
  },
  data() {
    return {
      state: herdingCatsstore(),
      tripPublicState: false, // Controls the state of the toggle switch
      initialPublicState: null // Store the initial value of `public`
    }
  },
  watch: {
    tripPublicState: 'updateTripPublicState' // Watch for changes to `tripPublicState`
  },
  methods: {
    // Function to update the public state of the trip
    async updateTripPublicState() {
      // Check if the state has changed before updating
      if (this.tripPublicState !== this.initialPublicState) {
        this.state.tripData[0].public = this.tripPublicState; // Update the state
        await this.state.updateTripState(this.$route.params.id); // Call the API to update the trip state
        // After updating, update the `initialPublicState` to the new value
        this.initialPublicState = this.tripPublicState;
      }
    }
  },
  created() {
    // Set the initial state of the toggle switch based on the trip's `public` value
    this.tripPublicState = this.state.tripData[0].public;
    // Store the initial value to compare later
    this.initialPublicState = this.state.tripData[0].public;
  }
}
</script>

<style scoped>
#switch-input {
  display: none;
}

.label-text {
  font-family: 'Satoshi-Variable';
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
  color: white;
}
.switch {
  background-color: var(--turqoise-notes);
  position: relative;
  width: 32rem;
  height: 4rem;
  display: grid;
  border-radius: 1rem;
  padding: 1rem;
  grid-template-columns: 26rem 4rem;
  grid-template-rows: 2rem;
  grid-template-areas: 'text switch';
}
.switch .label-text {
  margin: auto 0;
}

.switch-background {
  position: absolute;
  background-color: var(--required-red);
  border-radius: 1rem;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: background-color 0.4s;
  grid-area: switch;
}
.switch-background::before {
  background-color: white;
  border-radius: 50%;
  content: '';
  position: absolute;
  left: 0.25rem;
  bottom: 0.25rem;
  height: 1.5rem;
  width: 1.5rem;
}
#switch-input:checked + span {
  background-color: rgb(1, 193, 84);
}

#switch-input:checked + span::before {
  transform: translateX(2rem);
}
</style>
