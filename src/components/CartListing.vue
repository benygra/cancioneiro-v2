<script setup>

import { defineProps, defineEmits } from 'vue';

defineProps({
    song: Object,
    id: String,
})

defineEmits(['remove'])
</script>

<template>
    <li class="cart-item">
        <span class="cart-item-title">{{ song.title }}</span>
        <button class="cart-item-remove" @click="$emit('remove')">X</button>
    </li>
</template>

<style scoped>
.cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
}

.cart-item-title {
    color: white;
}

.cart-item-remove {
    padding: 3px;
    font-weight: bold;
    background-color: red;
    border-radius: 2px;
    border-color: darkred;
    cursor: pointer;
    font-size: 1.2rem;
    line-height: 1;
}

.cart-item-remove:hover {
    background-color: darkred;
}

</style>