import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, POST, PUT, DELETE } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useAdminStore = defineStore('adminStore', () => {
    const admins = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/aauth/admin'
    const adminActivityStore = useAdminActivityStore()
    const groups = ref(null)

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            // sort: sortBy[0]?.key,
            // order: sortBy[0]?.order,
            page: page,
            limit: Math.max(itemsPerPage, 0),
            search,
        }

        const {
            error: err,
            data
        } = await GET(path, { params })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            admins.value = data.data.admins
            totalItems.value = data.data.totalCount
        }

        loading.value = false
    }

    const addItem = async (item) => {
        loading.value = true
        const {
            error: err,
            data,
        } = await POST(path, item)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Create new admin successfully')
            error.value = null
            admins.value.unshift(data.data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new admin', targetId: data.data._id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`${path}/${item._id}`, {
            groupName: item.group.groupName,
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit admin successfully')
            error.value = null
            const foundIndex = admins.value.findIndex((x) => x.id == item._id)
            admins.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit admin', targetId: item.id })
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
        const { error: err } = await DELETE(`${path}/${item._id}`)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Delete admin successfully')
            error.value = null
            admins.value = admins.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete admin', targetId: item._id })
        }

        loading.value = false
    }

    return {
        admins,
        error,
        loading,
        totalItems,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useAdminStore
