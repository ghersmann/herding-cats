<template>
  <label class="switch" for="switch-input"
    ><span class="label-text">{{ labelText }}</span>
    <input id="switch-input" name="switch" type="checkbox" />
    <span class="switch-background"></span>
  </label>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    labelText: String
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
  border: 1px solid white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
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
  background-color: #ccc;
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
  background-color: var(--required-red);
}

#switch-input:checked + span::before {
  transform: translateX(2rem);
}
</style>
