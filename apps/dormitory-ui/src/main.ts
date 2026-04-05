import { createApp } from "vue";
import "./assets/styles/main.css";
import { createPinia } from "pinia";
import { useAuthStore } from "./stores/authStore";

import App from "./App.vue";
import router from "./router";

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

const authStore = useAuthStore();
authStore.initialize();

app.use(router);
app.use(Antd);

app.mount("#app");
