<script setup>
import { ref, computed } from 'vue';

import SongListing from '@/components/SongListing.vue';
import Cart from '@/components/Cart.vue';

import songs_map from '@/songs_map.json';

const ASCENDING_ORDER = {order: 'asc', symbol: '▼'};
const DESCENDING_ORDER = {order: 'desc', symbol: '▲'};

const DEFAULT_ORDER = ASCENDING_ORDER;

const songs = ref(songs_map);

const sortColumn = ref(null); // the column the user is currently selecting to sort
const sortOrder = ref(null); // the current sorting order of the column selection
const searchQuery = ref('');

const filteredSongs = ref(Object.entries(songs.value));

/**
 * Sorts the given column by either ascending or descending order
 * (alternating). After three 'clicks', it goes back to the default order (the sites').
 * If the user selects the column for the first time, it sorts by ascending order.
 * Otherwise, it flips the order (ascending/descending) depending on the state of the user interaction.
 * @param column the column the user is selecting to be sorted.
 */
function sortBy(column) {
  if (sortColumn.value === column) {
    // clicking the same column again flips the order....
    if (!sortOrder.value) {
        sortOrder.value = ASCENDING_ORDER;
    }

    else if (sortOrder.value.order === ASCENDING_ORDER.order) {
        sortOrder.value = DESCENDING_ORDER;
    }

    else if (sortOrder.value.order === DESCENDING_ORDER.order) {
        sortOrder.value = null;
        sortColumn.value = null;
    }

  } else {
    sortOrder.value = DEFAULT_ORDER;
    sortColumn.value = column;
  }
}

/**
 * Gets the symbol referring the given column.
 * If the user is not selecting it, there is no symbol associated.
 */
const getOrder = (column) => {
  if (sortColumn.value === column) {
    return sortOrder.value?.symbol;
  }

  return null;
};

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
  const dir = sortOrder.value.order === 'asc' ? 1 : -1;

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

</script>

<template>
    <section class="content-section songs">
        <h2 class="section-header">CANCIONEIRO</h2>

        <!-- User input to search the songs -->
        <div class="user-input">
            <input 
                class="search-input" 
                type="text" 
                v-model="searchQuery" 
                placeholder="Pesquisar cânticos..." 
                @keyup.enter="filterSongs"
            >
            <img 
                class="magnifier-image" 
                src="@/assets/img/magnifier.png" 
                alt="magnifier" 
                @click="filterSongs"
            >
        </div>
        
        <!-- Songs table -->
        <table class="songs-table">
            <thead>
                <tr>
                    <th @click="sortBy('title')">
                        Título
                        <span class="order">{{ getOrder('title') }}</span>
                    </th>
                    <th @click="sortBy('moment')">
                        Momento
                        <span class="order">{{ getOrder('moment') }}</span>
                    </th>
                    <th @click="sortBy('tone')" colspan="2">
                        Tom
                        <span class="order">{{ getOrder('tone') }}</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <SongListing
                    v-for="[id, song] in sortedSongs"
                    :key="id"
                    :song="song"
                    :id="id"
                />
                <tr v-if="sortedSongs.length === 0">
                    <td colspan="4" class="no-results">
                        Nenhum cântico encontrado com esse nome ou momento.
                    </td>
                </tr>
            </tbody>
        </table>
    </section>

    <Cart />

</template>

<style scoped>

.songs {
    margin-bottom: 5.1em;
    max-width: 1500px;
}

.user-input {
    display: flex;
    height: 3em;
}

.search-input {
    width: 100%;
    padding: 0.8em;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 0.4em;
}

.magnifier-image {
    cursor: pointer;
}

.songs-table {
    width: 100%;
    margin-top: 1.3em;
}

.songs-table th {
    background-color: var(--default-bg-color);
    color: white;
    padding: 0.8em;
}

.songs-table th:hover {
    text-decoration: underline;
    cursor: pointer;
}

.order {
    color: white;
    font-weight: bold;
}

.no-results {
    text-align: center;
    padding: 1.5em;
    font-style: italic;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .songs-table th {
        font-size: 0.9em;
    }
}

</style>