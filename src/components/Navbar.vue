<template>
  <nav class="nav">
    <ul class="navbar">
      <li class="navbar-item"><a href="/">INÍCIO</a></li>
      <li class="navbar-item"><a href="/songs">LISTA DE CÂNTICOS</a></li>
    </ul>
  </nav>
</template>

<style scoped>

.nav {
  --nav-line-color: rgba(255, 255, 255, .3);
  --nav-text-color: white;
  --nav-top-color: #cb9808;
  --nav-bottom-color: #826105;

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

.navbar-item a {
  display: block;
  padding: 0.5em 2.5em;
  color: var(--nav-text-color);
  text-decoration: none;
}

.navbar-item a:hover {
  background-color: var(--nav-line-color);
}

</style>
