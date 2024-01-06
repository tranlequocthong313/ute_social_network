import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const resourcePermissionStore = defineStore('resourcePermissionStore', () => {
    const resourcePermissions = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/permission/resource-permission'
    const resource = ref(null)
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
        } = await GET(`${path}?resourceId=${resource.value}`, { params })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            resourcePermissions.value = data.data.resourcePermissions
            totalItems.value = data.data.totalCount
        }

        loading.value = false
    }

    const addItem = async (item) => {
        loading.value = true
        const { error: err, data } = await POST(path, {
            ...item,
            resource: resource.value
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Create new resource permission successfully')
            error.value = null
            resourcePermissions.value.unshift(data.data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new resource permission', targetId: data.data._id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`${path}/${item._id}`, {
            operation: item.operation
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit resource permission successfully')
            error.value = null
            const foundIndex = resourcePermissions.value.findIndex((x) => x._id == item._id)
            resourcePermissions.value[foundIndex] = data.data
            await adminActivityStore.addItem({ activityType: 'Edit resource permission', targetId: data.data._id })
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
            toastSuccess('Delete resource permission successfully')
            error.value = null
            resourcePermissions.value = resourcePermissions.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete resource permission', targetId: item._id })
        }

        loading.value = false
    }

    const resourcePermissionNames = computed(() => {
        return resourcePermissions.value.map((it) => it.name)
    })

    return {
        resourcePermissions,
        resource,
        error,
        loading,
        totalItems,
        resourcePermissionNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default resourcePermissionStore
