import { defineStore } from 'pinia'
import { ref } from 'vue'
import { GET, DELETE, PATCH } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const usePostViolationStore = defineStore('postViolationStore', () => {
    const violationPosts = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/violating-posts'
    const adminActivityStore = useAdminActivityStore()

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            _sort: sortBy[0]?.key,
            _order: sortBy[0]?.order,
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
            violationPosts.value = data
            totalItems.value = totalCount
        }

        loading.value = false
    }

    const approve = async (id) => {
        loading.value = true
        const { error: err } = await PATCH(`${path}/${id}`, {
            status: 'resolved',
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Approve report successfully')
            error.value = null
            violationPosts.value = violationPosts.value.filter((it) => it.id !== id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Approve post report', targetId: id })
        }

        loading.value = false
    }

    const decline = async (id) => {
        loading.value = true
        const { error: err } = await PATCH(`${path}/${id}`, {
            status: 'rejected',
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Decline report successfully')
            error.value = null
            violationPosts.value = violationPosts.value.filter((it) => it.id !== id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Decline post report', targetId: id })
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
            error.value = null
            violationPosts.value = violationPosts.value.filter((it) => it.id !== item.id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete post report', targetId: item.id })
        }

        loading.value = false
    }

    return {
        violationPosts,
        error,
        loading,
        totalItems,
        getItems,
        deleteItem,
        deleteItems,
        approve,
        decline,
    }
})

export default usePostViolationStore
