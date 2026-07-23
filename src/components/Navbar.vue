<script setup>
import { defineProps } from 'vue';

defineProps({
    title: {
        type: String,
        default: "Cancioneiro"
    }
});
</script>

<template>
  <header class="main-header">
    <nav class="nav">
      <ul>
        <li><a href="/index.html">INÍCIO</a></li>
        <li><a href="/list_songs.html">LISTA DE CÂNTICOS</a></li>
      </ul>
    </nav>
    <h1 class="songbook-name">{{ title }}</h1>
  </header>
</template>
