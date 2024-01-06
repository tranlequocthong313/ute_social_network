import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useFacultyStore = defineStore('facultyStore', () => {
    const faculties = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/faculty'
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
            faculties.value = data.data.faculties
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
            toastSuccess('Create new faculty successfully')
            error.value = null
            faculties.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new faculty', targetId: data.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`${path}/${item._id}`, {
            name: item.name,
            code: item.code,
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit faculty successfully')
            error.value = null
            const foundIndex = faculties.value.findIndex((x) => x._id == item._id)
            faculties.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit faculty', targetId: data.id })
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
            toastSuccess('Delete faculty successfully')
            error.value = null
            faculties.value = faculties.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete faculty', targetId: item._id })
        }

        loading.value = false
    }

    const facultyNames = computed(() => {
        return faculties.value.map((it) => it.name)
    })

    return {
        faculties,
        error,
        loading,
        totalItems,
        facultyNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useFacultyStore
