<script setup>
import SongListing from '@/components/SongListing.vue';
import Cart from '@/components/Cart.vue';

import songs_map from '@/songs_map.json';
import { ref } from 'vue';
import { computed } from 'vue';

const songs = ref(songs_map);

const sortColumn = ref(null);
const sortOrder = ref('asc');

function sortBy(column) {
  if (sortColumn.value === column) {
    // clicking the same column again flips the order....
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';

  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
}

const sortedSongs = computed(() => {
  const entries = Object.entries(songs.value);

  if (!sortColumn.value) return entries;

  const col = sortColumn.value;
  const dir = sortOrder.value === 'asc' ? 1 : -1;

  return [...entries].sort(([, a], [, b]) => {
    const valA = a[col];
    const valB = b[col];

    if (valA == null) return 1;
    if (valB == null) return -1;

    if (typeof valA === 'string') {
      return valA.localeCompare(valB) * dir;
    }
    return (valA - valB) * dir;
  });
});

const toggle = (sortColumn, desiredColumn, sortOrder) => {
    if (sortColumn === desiredColumn) {
        if (sortOrder === 'asc') {
            return '▼';
        }

        return '▲';
    }

    return '▼';
}


</script>

<template>
    <h2 class="section-header">CANCIONEIRO</h2>

    <div class="songs">
        <table class="songs-table">
            <thead>
                <tr>
                <th @click="sortBy('title')">
                    Título
                    <span class="order">{{ toggle(sortColumn, 'title', sortOrder) }}</span>
                </th>
                <th @click="sortBy('moment')">
                    Momento
                    <span class="order">{{ toggle(sortColumn, 'moment', sortOrder) }}</span>
                </th>
                <th @click="sortBy('tone')">
                    Tom
                    <span class="order">{{ toggle(sortColumn, 'tone', sortOrder) }}</span>
                </th>
                <th>Adicionada</th>
                </tr>
            </thead>
            <tbody id="songs-list">
                <SongListing
                    v-for="[id, song] in sortedSongs"
                    :key="id"
                    :song="song"
                    :id="id"
                />
            </tbody>
        </table>
    </div>

    <Cart />

</template>

<style scoped>
.order {
    color: white;
    font-weight: bold;
}
</style>