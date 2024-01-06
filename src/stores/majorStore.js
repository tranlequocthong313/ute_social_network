import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const majorStore = defineStore('majorStore', () => {
    const majors = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/major'
    const faculty = ref(null)
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
        } = await GET(`${path}?facultyId=${faculty.value}`, { params })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            majors.value = data.data.majors
            totalItems.value = data.data.totalCount
        }

        loading.value = false
    }

    const getAllMajors = async () => {
        const {
            error: err,
            data
        } = await GET(`${path}`)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            majors.value = data.data.majors
            totalItems.value = data.data.totalCount
        }
    }

    const addItem = async (item) => {
        loading.value = true
        const { error: err, data } = await POST(path, {
            ...item,
            facultyId: String(faculty.value),
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Create new major successfully')
            error.value = null
            majors.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new major', targetId: data.id })
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
            toastSuccess('Edit major successfully')
            error.value = null
            const foundIndex = majors.value.findIndex((x) => x._id == item._id)
            majors.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit major', targetId: data.id })
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
            toastSuccess('Delete major successfully')
            error.value = null
            majors.value = majors.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete major', targetId: item._id })
        }

        loading.value = false
    }

    const majorNames = computed(() => {
        return majors.value.map((it) => it.name)
    })

    return {
        majors,
        faculty,
        error,
        loading,
        totalItems,
        majorNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
        getAllMajors
    }
})

export default majorStore
