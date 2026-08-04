<script setup>
import Navbar from '@/components/Navbar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
<Navbar />
<RouterView />
</template>

<style>

@media print {
  body * {
    visibility: hidden;
  }
  .content-section,
  .content-section * {
    visibility: visible;
  }
  .content-section {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
}

</style>
