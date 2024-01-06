import { computed } from 'vue';
import { useTheme as _useTheme } from 'vuetify';

const useTheme = () => {
    const theme = _useTheme();

    const toggleTheme = () => {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
        localStorage.setItem('theme', theme.global.name.value.toString());
    };

    const isDark = computed(() => {
        return theme.global.current.value.dark;
    });

    return { toggleTheme, isDark };
};

export default useTheme;
