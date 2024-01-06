import { createApp } from 'vue';
import router from './router';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';

import App from './App.vue';
import translator from './locales/translator';
import stateManagement from './stores';

loadFonts();

createApp(App).use(stateManagement).use(vuetify).use(translator).use(router).mount('#app');
