<template>
    <nav>
        <router-link to="/">Home</router-link>
        <router-link to="/about">About</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/examplepug">Pug Example</router-link>
        <router-link to="/example2">Example 2</router-link>
    </nav>
</template>

<style>
nav {
    background-color: #333;
    padding: 1rem;
    margin-bottom: 20px;
}

nav a {
    color: white;
    text-decoration: none;
    margin-right: 15px;
    padding: 5px 10px;
}

nav a.router-link-active {
    background-color: #666;
    border-radius: 4px;
}
</style>
