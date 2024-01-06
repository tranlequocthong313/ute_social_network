import { defineStore } from 'pinia'
import { ref } from 'vue'

import { GET, POST } from '@/utils/http.js'
import { toastError } from '@/utils/toast'
import useAuthStore from './authStore.js'

const useAdminActivityStore = defineStore('adminActivityStore', () => {
    const activities = ref([])
    const error = ref(null)
    const loading = ref(false)
    const path = '/admin-activities'

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        const params = {
            _sort: sortBy[0]?.key,
            _order: sortBy[0]?.order,
            _page: page,
            _limit: Math.max(itemsPerPage, 0),
            q: search,
        }

        loading.value = true
        const { error: err, data } = await GET(path, { params })
        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            activities.value = data
        }
        loading.value = false
    }

    const addItem = async ({ activityType, targetId }) => {
        const authStore = useAuthStore()
        await POST(path, {
            activityType,
            targetId,
            admin: {
                id: authStore.user.id,
                email: authStore.user.email,
            },
        })
    }

    return { activities, error, loading, getItems, addItem }
})

export default useAdminActivityStore
