<template>
    <div class="home-page text-primary">
        <h1>Bienvenido a nuestra Tienda</h1>
        <p>Encuentra los mejores productos a los mejores precios.</p>
        <router-link to="/products" class="btn btn-dark bg-color3 text-primary">Compra Ya</router-link>
    </div>
</template>

<style scoped>
.home-page {
    background: url('@/assets/background.jpg') no-repeat center center/cover;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white; 
    padding: 20px;
}

h1 {
    font-size: 4rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

p {
    font-size: 1.5rem;
    margin-bottom: 20px;
}

.btn-dark {
    font-size: 1.2rem;
    padding: 10px 20px;
}
</style>
