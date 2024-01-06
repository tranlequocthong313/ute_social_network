import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useAdminGroupStore = defineStore('adminGroupStore', () => {
    const adminGroups = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/aauth/admin-groups'
    const group = ref(null)
    const adminActivityStore = useAdminActivityStore()

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            // _sort: sortBy[0].key,
            // _order: sortBy[0].order,
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
            adminGroups.value = data.data._groups
            totalItems.value = data.data.totalCount
        }

        loading.value = false
    }

    const addItem = async (item) => {
        loading.value = true
        const { error: err, data } = await POST(path, item)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Create new admin group successfully')
            error.value = null
            adminGroups.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new admin group', targetId: data.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`${path}/${item._id}`, {
            groupName: item.groupName,
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit admin group successfully')
            error.value = null
            const foundIndex = adminGroups.value.findIndex((x) => x._id == item._id)
            adminGroups.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit admin group', targetId: data.id })
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
            toastSuccess('Delete admin group successfully')
            error.value = null
            adminGroups.value = adminGroups.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete admin group', targetId: item._id })
        }

        loading.value = false
    }

    const groupNames = computed(() => {
        return adminGroups.value.map((it) => it.groupName)
    })

    return {
        groupNames,
        adminGroups,
        error,
        loading,
        totalItems,
        group,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useAdminGroupStore
