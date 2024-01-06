import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useSchoolYearStore = defineStore('schoolYearStore', () => {
    const schoolYears = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/enrollment-year'
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
            schoolYears.value = data.data.enrollmentYears
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
            toastSuccess('Create new school year successfully')
            error.value = null
            schoolYears.value.unshift(data)
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new school year', targetId: data.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`${path}/${item._id}`, {
            name: item.name,
            startYear: +item.startYear,
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit school year successfully')
            error.value = null
            const foundIndex = schoolYears.value.findIndex((x) => x._id == item._id)
            schoolYears.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit school year', targetId: data.id })
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
            toastSuccess('Delete school year successfully')
            error.value = null
            schoolYears.value = schoolYears.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete school year', targetId: item._id })
        }

        loading.value = false
    }

    const schoolYearNames = computed(() => {
        return schoolYears.value.map((it) => it.name)
    })

    return {
        schoolYears,
        error,
        loading,
        totalItems,
        schoolYearNames,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useSchoolYearStore
