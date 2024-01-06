import { defineStore, storeToRefs } from 'pinia'
import { ref, watch } from 'vue'

import { toastError, toastSuccess } from '@/utils/toast'
import { GET, DELETE, POST, PATCH } from '@/utils/http.js'
import { generatePassword } from '@/utils/string'
import useAdminActivityStore from './adminActivityStore'
import useFilterStore from './filterStore'

const useUserManagementStore = defineStore('userManagementStore', () => {
    const users = ref([])
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/users'
    const adminActivityStore = useAdminActivityStore()
    const studentTypes = ref(['student', 'alumni'])
    const { query } = storeToRefs(useFilterStore())

    watch(query, async () => {
        await getItems({})
    })

    const getItems = async ({ page = 1, itemsPerPage = 10, sortBy = [{ key: 'id', order: 'desc' }], search = '' }) => {
        loading.value = true

        const params = {
            _sort: sortBy[0]?.key,
            _order: sortBy[0]?.order,
            _page: page,
            _limit: Math.max(itemsPerPage, 0),
            q: search,
        }

        const { error: err, data, totalCount } = await GET(`${path}?${query.value}`, { params })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            error.value = null
            users.value = data
            totalItems.value = totalCount
        }

        loading.value = false
    }

    const addItem = async (item) => {
        loading.value = true
        const { error: err, data } = await POST(path, {
            ...item,
            password: generatePassword(),
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Create new user successfully')
            users.value.unshift(data.user)
            error.value = null
            await adminActivityStore.addItem({ activityType: 'Add new user', targetId: data.user.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PATCH(`${path}/${item.id}`, item)

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit user successfully')
            error.value = null
            const foundIndex = users.value.findIndex((x) => x.id == item.id)
            users.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit user', targetId: data.id })
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
            toastSuccess('Delete user successfully')
            error.value = null
            users.value = users.value.filter((it) => it.id !== item.id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete user', targetId: item.id })
        }

        loading.value = false
    }

    return {
        users,
        error,
        loading,
        totalItems,
        studentTypes,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useUserManagementStore
