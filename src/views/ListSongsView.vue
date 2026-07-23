<script setup>
import SongListing from '@/components/SongListing.vue';
import Cart from '@/components/Cart.vue';

import songs_map from '@/songs_map.json';
import { ref } from 'vue';
import { computed } from 'vue';

const songs = ref(songs_map);

const sortColumn = ref(null);
const sortOrder = ref('asc');
const searchQuery = ref('');

const filteredSongs = ref(Object.entries(songs.value));

function sortBy(column) {
  if (sortColumn.value === column) {
    // clicking the same column again flips the order....
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';

  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
}

function filterSongs() {
  const entries = Object.entries(songs.value);
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    filteredSongs.value = entries;
    return;
  }

  filteredSongs.value = entries.filter(([, song]) => {
    const title = (song.title || '').toLowerCase();
    const moment = (song.moment || '').toLowerCase();
    return title.includes(query) || moment.includes(query);
  });
}

const sortedSongs = computed(() => {
  const entries = filteredSongs.value;

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
        <div class="text-input">
            <input type="text" id="search-input" v-model="searchQuery" placeholder="Pesquisar cânticos..." class="search-input" @keyup.enter="filterSongs">
            <img src="@/assets/img/magnifier.png" alt="magnifier" class="magnifier" @click="filterSongs">
        </div>
        

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

.text-input {
    display: flex;
}

.magnifier {
    width: 50px;
    height: 50px;
    cursor: pointer;
}

</style>