import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export const toastSuccess = (msg) => {
    toast.success(msg, {
        theme: 'colored',
        autoClose: 1000,
    });
};

export const toastError = (msg) => {
    toast.error(msg, {
        theme: 'colored',
        autoClose: 1000,
    });
};
