import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import ListSongsView from "@/views/ListSongsView.vue";
import SongView from "@/views/SongView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/songs',
            name: 'songs',
            component: ListSongsView,
        },
        {
            path: '/songs/:id',
            name: 'song_detail',
            component: SongView,
            props: true,
        },
    ],
});

export default router;
