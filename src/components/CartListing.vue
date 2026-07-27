<script setup>

defineProps({
    song: Object
});

defineEmits(['remove']);

</script>

<template>
    <li class="cart-item">
        <img class="drag-icon drag-handle" src="@/assets/img/drag.png" alt="drag">
        <span class="cart-item-title">{{ song.title }}</span>
        <button class="cart-item-remove" @click="$emit('remove')">X</button>
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