<template>
  <nav class="nav">
    <ul class="navbar">
      <li class="navbar-item"><router-link to="/">INÍCIO</router-link></li>
      <li class="navbar-item"><router-link to="/songs">LISTA DE CÂNTICOS</router-link></li>
    </ul>
  </nav>
</template>

<style scoped>

.nav {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1.1em;
  font-weight: lighter;
  background-image: linear-gradient(to top, var(--nav-bottom-color) 10%, var(--nav-top-color) 100%);
}

.navbar-item {
  display: inline-block;
  margin: 0.6em 0;
}

.navbar-item * {
  display: block;
  padding: 0.5em 2.5em;
  color: var(--nav-text-color);
  text-decoration: none;
}

.navbar-item *:hover {
  background-color: var(--nav-line-color);
}

</style>
