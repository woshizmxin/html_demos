import Vue from "../node_modules/vue/dist/vue.js";
import VueRouter from "vue-router";
import routes from './router.config'
import app from './components/app';

Vue.use(VueRouter);

Vue.config.debug = true;

const router = new VueRouter({
    mode: 'history',
    scorllBehavior: () => ({
        y: 0
    }),
    routes
});

new Vue({
    router,
    render: h => h(app)
}).$mount("#app");
