import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { POST, PUT } from '@/utils/http'
import { toastError, toastSuccess } from '@/utils/toast'

const useAuthStore = defineStore('authStore', () => {
    const user = ref(JSON.parse(localStorage.getItem('user')))
    const error = ref(null)
    const router = useRouter()
    const loading = ref(false)
    const path = '/aauth'

    const loggedIn = computed(() => user.value !== null)

    const login = async ({ email, password }) => {
        loading.value = true
        const {
            error: err,
            data,
        } = await POST(`${path}/login`, {
            email,
            password,
        })

        if (err) {
            console.log('ERROR')
            error.value = err
            toastError(err)
        } else {
            error.value = null
            user.value = data.data?.user
            localStorage.setItem('accessToken', data.data?.tokens.accessToken)
            localStorage.setItem('refreshToken', data.data?.tokens.refreshToken)
            localStorage.setItem('user', JSON.stringify(user.value))
        }
        loading.value = false
    }

    const logout = async () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        user.value = null
        router.push({ name: 'login' })
    }

    const refreshToken = async () => {
        console.log('auth store running')
        console.log(localStorage.getItem('refreshToken'))
        return await POST(`${path}/refresh-token`, {
            refreshToken: localStorage.getItem('refreshToken'),
        })
    }

    const changeUsername = async (username) => {
        console.log(username)
        const {
            error: err,
            data,
        } = await PUT(`${path}/${user.value._id}/change-username`, {
            username,
        })

        if (err) {
            console.log('ERROR')
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Change username successfully!')
            error.value = null
            user.value = data.data
            localStorage.setItem('user', JSON.stringify(user.value))
        }
    }

    const changePassword = async ({ currentPassword, newPassword }) => {
        const { error: err } = await PUT(`${path}/${user.value._id}/change-password`, {
            currentPassword,
            newPassword,
        })

        if (err) {
            console.log('ERROR')
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Change password successfully!')
        }
    }

    return { user, error, loggedIn, login, logout, refreshToken, changeUsername, changePassword, loading }
})

export default useAuthStore
