import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { GET, DELETE, POST, PUT } from '@/utils/http.js'
import { toastError, toastSuccess } from '@/utils/toast'
import useAdminActivityStore from './adminActivityStore'

const useAdminInGroupStore = defineStore('adminInGroupStore', () => {
    const error = ref(null)
    const loading = ref(false)
    const totalItems = ref(0)
    const path = '/aauth/admin-groups'
    const group = ref(null)
    const admins = ref([])
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
        } = await GET(`/aauth/admin?group=${group.value}`, { params })

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
        const { error: err, data } = await POST(`${path}/${group.value}/admins`, {
            adminId: item._id,
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Add new admin to group successfully')
            error.value = null
            totalItems.value++
            await adminActivityStore.addItem({ activityType: 'Add new admin to group', targetId: data.id })
        }

        loading.value = false
    }

    const editItem = async (item) => {
        loading.value = true
        const { error: err, data } = await PUT(`/aauth/admin/${item._id}`, {
            groupName: item.group.groupName,
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Edit admin from group successfully')
            error.value = null
            const foundIndex = admins.value.findIndex((x) => x._id == item.adminId)
            admins.value[foundIndex] = data
            await adminActivityStore.addItem({ activityType: 'Edit admin from group', targetId: data.id })
        }

        loading.value = false
    }

    const deleteItems = async (items) => {
        console.log('HERE')
        console.log(items)
        // for (let item of items) {
        //     console.log(item)
        // await deleteItem({ item })
        // }
    }

    const deleteItem = async (item) => {
        loading.value = true
        const { error: err } = await DELETE(`${path}/${group.value}/admins`, {
            data: {
                adminId: item._id,
            },
        })

        if (err) {
            error.value = err
            toastError(err)
        } else {
            toastSuccess('Delete admin from group successfully')
            error.value = null
            admins.value = admins.value.filter((it) => it._id !== item._id)
            totalItems.value--
            await adminActivityStore.addItem({ activityType: 'Delete admin from group', targetId: group.value })
        }

        loading.value = false
    }

    return {
        error,
        loading,
        totalItems,
        group,
        admins,
        getItems,
        addItem,
        editItem,
        deleteItem,
        deleteItems,
    }
})

export default useAdminInGroupStore
