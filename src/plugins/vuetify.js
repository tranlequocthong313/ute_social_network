// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

// Vuetify
import { createVuetify } from 'vuetify';

import { VDataTable, VDataTableServer, VDataTableVirtual } from 'vuetify/labs/VDataTable';
import { VDatePicker } from 'vuetify/labs/VDatePicker';

export default createVuetify({
    components: {
        VDataTable,
        VDataTableServer,
        VDataTableVirtual,
        VDatePicker,
    },
    theme: {
        defaultTheme: 'light',
    },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
