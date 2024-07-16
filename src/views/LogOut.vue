<template>
  <header>
    <img src="@/assets/cat-logo/cat-logo-large.svg" alt="Herding Cats Logotype" />
  </header>
  <main class="container">
    <h2>
      Off to corral some kitty chaos.<br />
      See you around!
    </h2>

    <div class="backtoLogIn">
      <router-link :to="{ name: 'home' }"><button>Back to Start Page</button></router-link>
    </div>
  </main>
</template>

<style scoped>
header {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  width: 100vw;
  height: 21.7rem;
  padding: 3rem;
}

.container {
  min-height: 30rem;
  background-color: var(--pink-activities);
}
img {
  margin-left: 1.5rem;
}

h2 {
  margin-top: 2rem;
  color: black;
}

.backtoLogIn {
  margin-top: 5rem;
}
</style>
