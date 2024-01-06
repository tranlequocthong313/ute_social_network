import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useResourceStore = defineStore('resourceStore', () => {
    const resources = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/permission/resource'
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

        const { error: err, data } = await GET(path, { params })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            resources.value = data.data.resources
            totalItems.value = data.data.totalCount
        }

        loading.value = false
    }

    const addItem = async (item) => {
        loading.value = true
        const { error: err, data } = await POST(path, item)

        console.log(err)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Create new resource successfully')
            error.value = null
            resources.value.unshift(data.data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new resource', targetId: data.data.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`${path}/${item._id}`, {
            resourceName: item.resourceName,
            othersPermission: +item.othersPermission,
        })
        console.log(data)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit resource successfully')
            error.value = null
            const foundIndex = resources.value.findIndex((x) => x._id == item._id)
            resources.value[foundIndex] = data.data
            await adminActivityStore.addItem({ activityType: 'Edit resource', targetId: data.data._id })
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
            toastSuccess('Delete resource successfully')
            error.value = null
            resources.value = resources.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete resource', targetId: item._id })
        }

        loading.value = false
    }

    const resourceNames = computed(() => {
        return resources.value.map((it) => it.name)
    })

    return {
        resources,
        error,
        loading,
        totalItems,
        resourceNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useResourceStore
