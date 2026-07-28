<script setup>

import { useCart } from '@/composables/useCart';
import { useToast } from 'vue-toastification';

const { removeFromCart } = useCart();
const toast = useToast();

const props = defineProps({
    id: String,
    song: Object,
});

function handleRemove() {
  removeFromCart(props.id);
  toast(`Removendo ${props.song.title} do carrinho.`);
}

</script>

<template>
    <li class="cart-item">
        <img class="drag-icon drag-handle" src="@/assets/img/drag.png" alt="drag">
        <span class="cart-item-title drag-handle">{{ song.title }}</span>
        <button class="cart-item-remove" @click="handleRemove">X</button>
    </li>
</template>

<style scoped>

.cart-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8em;
}

.drag-icon {
    width: 1.5em;
    height: 1.5em;
    cursor: pointer;
}

.cart-item-title {
    flex: 1;
    color: white;
    text-align: left;
    margin-left: 0.4em;
}

.cart-item-remove {
    padding: 0.2em;
    font-weight: bold;
    color: wheat;
    background-color: red;
    border-radius: 2px;
    border-color: darkred;
    cursor: pointer;
    font-size: 1.2em;
    line-height: 1;
}

.cart-item-remove:hover {
    background-color: darkred;
}

</style>