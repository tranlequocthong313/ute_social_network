import axios from 'axios'
import useAuthStore from '../stores/authStore'
import { getFormattedDate } from './date'

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL
axios.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config
})

export const GET = async (path, options = {}) => {
    try {
        console.log(`GET ${path}`, options)
        const res = await axios.get(path, options)
        const data = await res.data
        return { error: null, data: data }
    } catch (error) {
        return { error: error.response.data.error, data: null }
    }
}

export const POST = async (path, options = {}) => {
    try {
        console.log(`POST ${path}`, options)
        const data = await (await axios.post(path, options)).data
        return { error: null, data }
    } catch (error) {
        return { error: error.response.data.error, data: null }
    }
}

export const DELETE = async (path, options = {}) => {
    try {
        console.log(`DELETE ${path}`, options)
        const res = await axios.delete(path, options)
        const data = await res.data
        console.log('HERE MY DATA' + data)
        return { error: null, data: data }
    } catch (error) {
        console.log('HERE MY error' + error)
        console.log(error)
        return { error: error.response.data.error, data: null }
    }
}

export const PUT = async (path, options = {}) => {
    try {
        console.log(`PUT ${path}`, options)
        const res = await axios.put(path, options)
        const data = await res.data
        return { error: null, data: data }
    } catch (error) {
        return { error: error.response.data.error, data: null }
    }
}

export const PATCH = async (path, options = {}) => {
    try {
        console.log(`PATCH ${path}`, options)
        const res = await axios.patch(path, options)
        const data = await res.data
        return { error: null, data: data }
    } catch (error) {
        return { error: error.response.data.error, data: null }
    }
}

// for developing without real backend
axios.interceptors.request.use(
    (config) => {
        if (config.method === 'post') {
            // add createdAt field for creating new data
            // remove this interceptor after having backend api
            // config.data.createdAt = getFormattedDate()
        }

        return config
    },
    async function (err) {
        return Promise.reject(err)
    },
)

// for developing without real backend
axios.interceptors.response.use(
    (response) => {
        return response
    },
    async function (error) {
        const store = useAuthStore()
        console.log(error)
        if (error.response.status === 401 && error.response?.data?.error.includes('Token expired')) {
            console.log('refreshing token...')
            const {
                data,
            } = await store.refreshToken()
            console.log(data)
            localStorage.setItem('accessToken', data.data.accessToken)
            localStorage.setItem('refreshToken', data.data.refreshToken)
        }
        if (error.response.config.url.includes('refresh-token')) {
            await store.logout()
        }
        return Promise.reject(error)
    },
)
