import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GET, DELETE } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const auditPostStore = defineStore('auditPostStore', () => {
    const auditPosts = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/posts'
    const adminActivityStore = useAdminActivityStore()

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            _sort: sortBy[0].key,
            _order: sortBy[0].order,
            _page: page,
            _limit: Math.max(itemsPerPage, 0),
            q: search,
        }

        const { error: err, data, totalCount } = await GET(`${path}?status=pending`, { params })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            auditPosts.value = data
            totalItems.value = totalCount
        }

        loading.value = false
    }

    const deleteItems = async (items) => {
        for (let id of items) {
            await deleteItem({ id })
        }
    }

    const deleteItem = async (item) => {
        loading.value = true
        const { error: err } = await DELETE(`${path}/${item.id}`)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Delete audit post successfully')
            error.value = null
            auditPosts.value = auditPosts.value.filter((it) => it.id !== item.id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete post audit', targetId: item.id })
        }

        loading.value = false
    }

    return {
        auditPosts,
        error,
        loading,
        totalItems,
        getItems,
        deleteItem,
        deleteItems,
    }
})

export default auditPostStore
