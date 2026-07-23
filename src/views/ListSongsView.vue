<script setup>
import SongListing from '@/components/SongListing.vue';
import Cart from '@/components/Cart.vue';

import songs_map from '@/songs_map.json';
import { ref } from 'vue';

const songs = ref(songs_map);
console.log(songs.value);

</script>

<template>
    <h2 class="section-header">CANCIONEIRO</h2>

    <div class="songs">
        <table class="songs-table">
            <thead>
                <tr>
                <th data-column="title" data-order="asc">Título &#9660</th>
                <th data-column="moment" data-order="asc">Momento &#9660</th>
                <th data-column="tone" data-order="asc">Tom &#9660</th>
                <th data-column="add" data-order="asc">Adicionada &#9660</th>
                </tr>
            </thead>
            <tbody id="songs-list">
                <SongListing
                    v-for="(song, id) in songs"
                    :key="id"
                    :song="song"
                    :id="id"
                />
            </tbody>
        </table>
    </div>

    <Cart />

</template>
