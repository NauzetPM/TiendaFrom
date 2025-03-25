<template>
    <footer class="footer hover-primary">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>
                        Siguenos
                    </h5>
                    <div class="social-links ">
                        <a title="facebook" href="https://facebook.com" target="_blank" >
                            <i class="bi bi-facebook hover-primary"></i>
                        </a>
                        <a title="twitter" href="https://twitter.com" target="_blank" >
                            <i class="bi bi-twitter hover-primary"></i>
                        </a>
                        <a title="instagram" href="https://instagram.com" target="_blank">
                            <i class="bi bi-instagram hover-primary"></i>
                        </a>
                        <a title="linkedin" href="https://linkedin.com" target="_blank">
                            <i class="bi bi-linkedin hover-primary"></i>
                        </a>
                    </div>
                </div>
                <div class="col-md-4">
                    <h5>Contactanos</h5>
                    <p>
                        <i class="bi bi-envelope"></i>
                         contact@yourstore.com
                    </p>
                    <p>
                        <i class="bi bi-telephone"></i>
                         +1 234 567 890
                        </p>
                    <p>
                        <i class="bi bi-geo-alt"></i>
                         123 Main Street, City, Country
                        </p>
                </div>
                <div class="col-md-4">
                    <h5>
                        Terminos
                    </h5>
                    <ul class="list-unstyled">
                        <li>
                            <router-link to="/privacidad#nav">
                                Política de privacidad
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/cookies#nav">
                                Cookies
                            </router-link>
                        </li>
                        <li>
                            <router-link to="/condiciones#nav">
                                Terminos y Condiciones
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="text-center mt-3">
                <p>&copy; {{ new Date().getFullYear() }} Your Store. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
    background-color: #222;
    color: white;
    padding: 30px 0;
}

.footer h5 {
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: bold;
}

.footer a {
    color: white;
    text-decoration: none;
    margin-right: 10px;
    font-size: 20px;
}

.footer a:hover {
    color: #f8c102;
}

.social-links a {
    display: inline-block;
    margin-right: 10px;
}

.list-unstyled {
    padding-left: 0;
}

.list-unstyled li {
    margin-bottom: 8px;
}

.list-unstyled a {
    color: white;
}

.list-unstyled a:hover {
    text-decoration: underline;
    color: #f8c102;
}
</style>
