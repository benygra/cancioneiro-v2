<script setup>

defineProps({
    title: String
});

</script>

<template>
    <div class="not-found">
        <h2 class="not-found-title anton">Não encontrado :(</h2>
        <p v-if="title">Tentaremos adicionar {{ title }} o quanto antes.</p>
        <p>Desculpe pelo incómodo.</p>
    </div>
</template>

<style scoped>

.not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3em;
    max-width: 600px;
    margin: 0 auto;
}

.not-found * {
    padding: 0.2em 0;
    text-align: center;
}

.not-found-title {
    color: darkred;
    font-size: 2.6em;
}

</style>
