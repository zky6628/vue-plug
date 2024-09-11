<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    .zh-card {
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(120, 190, 90, 0.3);
        background: #fff;
    }
</style>