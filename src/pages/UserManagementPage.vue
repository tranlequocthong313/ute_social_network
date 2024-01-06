<script setup>
    import { storeToRefs } from 'pinia';
    import { onMounted, ref, watch } from 'vue';

    import TableWithActions from '@/components/TableWithActions.vue';
    import { translate } from '@/locales/translator.js';
    import useUserManagementStore from '@/stores/userManagementStore.js';
    import StatusChip from '@/components/StatusChip.vue';
    import CardStatisticsVertical from '@/components/CardStatisticsVertical.vue';
    import { VContainer } from 'vuetify/lib/components/index.mjs';
    import { emailRules, basicRules } from '@/utils/validation.js';
    import useFacultyStore from '@/stores/facultyStore.js';
    import useMajorStore from '@/stores/majorStore.js';
    import DatePickerMenu from '@/components/DatePickerMenu.vue';
    import useSchoolYearStore from '@/stores/schoolYearStore.js';
    import { getFormattedDate } from '@/utils/date';
    import useFilterStore from '@/stores/filterStore';

    const userManagementStore = useUserManagementStore();
    const { users, totalItems, loading, studentTypes } = storeToRefs(userManagementStore);

    const facultyStore = useFacultyStore();
    const { facultyNames, faculties } = storeToRefs(facultyStore);

    const majorStore = useMajorStore();
    const { majorNames, faculty: facultyId } = storeToRefs(majorStore);

    const schoolYearStore = useSchoolYearStore();
    const { schoolYearNames } = storeToRefs(schoolYearStore);

    onMounted(() => {
        Promise.all([facultyStore.getItems({ itemsPerPage: -1 }), schoolYearStore.getItems({ itemsPerPage: -1 })]);
    });

    const email = ref(null);
    const firstName = ref(null);
    const lastName = ref(null);
    const gender = ref(null);
    const dateOfBirth = ref(null);
    const phoneNumber = ref(null);
    const hometown = ref(null);
    const type = ref(null);
    const faculty = ref(null);
    const major = ref(null);
    const addForm = ref(null);
    const genders = ref(['male', 'female']);
    const userTypes = ref(['student', 'lecturer', 'alumni']);
    const _emailRules = ref(emailRules);
    const formRules = ref(basicRules);
    const editForm = ref(null);
    const user = ref(null);
    const schoolYear = ref(null);

    watch(faculty, async (value) => {
        if (value) {
            major.value = null;
            await getMajors(faculty.value);
        }
    });

    const openEdit = async (item) => {
        user.value = item;
        await getMajors(item.faculty);
    };

    const onUpdateFaculty = async (item) => {
        user.value.major = null;
        await getMajors(item);
    };

    const getMajors = async (facultyName) => {
        const it = faculties.value.find((it) => it.name === facultyName);
        facultyId.value = it.id;
        await majorStore.getItems({ itemsPerPage: -1 });
    };

    const filterStore = useFilterStore();
    filterStore.setFilters([
        {
            key: 'type',
            title: 'Type',
            value: ['lecturer', 'student', 'alumni'],
            type: 'checkbox',
        },
        {
            key: 'faculty',
            title: 'Faculty',
            value: ['it', 'medical'],
            type: 'checkbox',
        },
        {
            key: 'status',
            title: 'Status',
            value: ['active', 'deactive', 'pending'],
            type: 'radio',
        },
        {
            key: 'gender',
            title: 'Gender',
            value: ['male', 'female'],
            type: 'checkbox',
        },
        {
            key: 'hometown',
            title: 'Hometown',
            value: ['Quang Nam', 'Ho Chi Minh', 'Ha Noi', 'Da Nang', 'Nghe An', 'Hai Phong', 'Can Tho'],
            type: 'checkbox',
        },
        {
            key: 'yearOfBirth',
            title: 'Year of birth',
            value: [0, 100],
            type: 'range',
        },
    ]);

    // for developing without real backend
    const totalStats = [
        {
            label: 'active',
            value: '25.000',
            direction: 'up',
            percent: '+3%',
            time: 'then hour ago',
        },
        {
            label: 'deActive',
            value: '100.000',
            direction: 'up',
            percent: '+24%',
            time: 'then week ago',
        },
        {
            label: 'pending',
            value: '1.000.000',
            direction: 'up',
            percent: '+80%',
            time: 'then week ago',
        },
    ];

    const userManagementHeaders = [
        {
            key: 'id',
            title: translate('id'),
            align: 'center',
        },
        {
            key: 'firstName',
            title: translate('name'),
            align: 'center',
        },
        {
            key: 'email',
            title: translate('email'),
            align: 'center',
        },
        {
            key: 'type',
            title: translate('type'),
            align: 'center',
        },
        {
            key: 'faculty',
            title: translate('faculty'),
            align: 'center',
        },
        {
            key: 'createdAt',
            title: translate('createdAt'),
            align: 'center',
        },
        {
            key: 'status',
            title: translate('status'),
            align: 'center',
        },
        {
            key: 'actions',
            title: translate('action'),
            align: 'center',
            sortable: false,
        },
    ];

    const addItem = async () => {
        if ((await addForm.value.validate()).valid) {
            await userManagementStore.addItem({
                email: email.value,
                firstName: firstName.value,
                lastName: lastName.value,
                type: type.value,
                faculty: faculty.value,
                major: major.value,
                gender: gender.value,
                dateOfBirth: getFormattedDate(dateOfBirth.value, { time: false, format: 'yyyy-mm-dd' }),
                phoneNumber: phoneNumber.value,
                hometown: hometown.value,
                schoolYear: schoolYear.value,
                status: 'pending',
            });
            email.value = null;
            firstName.value = null;
            lastName.value = null;
            type.value = null;
            faculty.value = null;
            major.value = null;
            gender.value = null;
            dateOfBirth.value = null;
            phoneNumber.value = null;
            hometown.value = null;
            schoolYear.value = null;
        }
    };

    const editItem = async (item) => {
        if ((await editForm.value.validate()).valid) {
            item.dateOfBirth = getFormattedDate(item.dateOfBirth, { time: false, format: 'yyyy-mm-dd' });
            await userManagementStore.editItem(item);
        }
    };
</script>

<template>
    <VRow class="flex-wrap pa-4">
        <VCol cols="12" sm="4" v-for="({ label, value, direction, percent, time }, index) in totalStats" :key="index"
            ><CardStatisticsVertical
                :label="translate(label)"
                :value="value"
                :direction="direction"
                :percent="percent"
                :time="time"
        /></VCol>
    </VRow>

    <TableWithActions
        :headers="userManagementHeaders"
        :items="users"
        :loading="loading"
        :itemsLength="totalItems"
        statusKey="status"
        @addItem="addItem"
        @deleteItem="userManagementStore.deleteItem"
        @deleteItems="userManagementStore.deleteItems"
        @editItem="editItem"
        @openEdit="openEdit"
        @update-options="userManagementStore.getItems"
    >
        <template #add>
            <VContainer>
                <VForm ref="addForm">
                    <VRow>
                        <VCol cols="12">
                            <VTextField
                                type="email"
                                :label="translate('email')"
                                v-model.trim="email"
                                :rules="_emailRules"
                            />
                        </VCol>
                        <VCol cols="12" sm="6">
                            <VTextField :label="translate('firstName')" v-model.trim="firstName" :rules="formRules" />
                        </VCol>
                        <VCol cols="12" sm="6">
                            <VTextField :label="translate('lastName')" v-model.trim="lastName" :rules="formRules" />
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                v-model.trim="gender"
                                :label="translate('gender')"
                                :items="genders"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12">
                            <DatePickerMenu :label="translate('dateOfBirth')" v-model="dateOfBirth" />
                        </VCol>
                        <VCol cols="12">
                            <VTextField
                                :label="translate('phoneNumber')"
                                v-model.trim="phoneNumber"
                                :rules="formRules"
                            />
                        </VCol>
                        <VCol cols="12">
                            <VTextField :label="translate('hometown')" v-model.trim="hometown" :rules="formRules" />
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                v-model.trim="type"
                                :label="translate('type')"
                                :items="userTypes"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12" v-if="studentTypes.includes(type)">
                            <VSelect
                                v-model.trim="schoolYear"
                                :label="translate('schoolYear')"
                                :items="schoolYearNames"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                v-model.trim="faculty"
                                :label="translate('faculty')"
                                :items="facultyNames"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12" v-if="studentTypes.includes(type)">
                            <VSelect
                                v-model.trim="major"
                                :label="translate('major')"
                                :items="majorNames"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>

        <template #status="{ item }">
            <StatusChip :status="item?.status" />
        </template>

        <template #edit="{ item }">
            <VContainer>
                <VForm ref="editForm">
                    <VRow>
                        <VCol cols="12">
                            <h2>ID: {{ item._id }}</h2>
                        </VCol>
                        <VCol cols="12">
                            <VTextField
                                :label="translate('email')"
                                v-model.trim="item.email"
                                :rules="_emailRules"
                            ></VTextField>
                        </VCol>
                        <VCol cols="12" sm="6">
                            <VTextField
                                :label="translate('firstName')"
                                v-model.trim="item.firstName"
                                :rules="formRules"
                            ></VTextField>
                        </VCol>
                        <VCol cols="12" sm="6">
                            <VTextField
                                :label="translate('lastName')"
                                v-model.trim="item.lastName"
                                :rules="formRules"
                            ></VTextField>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                v-model.trim="item.gender"
                                :label="translate('gender')"
                                :items="genders"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12">
                            <DatePickerMenu :label="translate('dateOfBirth')" v-model="item.dateOfBirth" />
                        </VCol>
                        <VCol cols="12">
                            <VTextField
                                :label="translate('phoneNumber')"
                                v-model.trim="item.phoneNumber"
                                :rules="formRules"
                            />
                        </VCol>
                        <VCol cols="12">
                            <VTextField
                                :label="translate('hometown')"
                                v-model.trim="item.hometown"
                                :rules="formRules"
                            />
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                :label="translate('type')"
                                v-model.trim="item.type"
                                :items="userTypes"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12" v-if="studentTypes.includes(item.type)">
                            <VSelect
                                v-model.trim="item.schoolYear"
                                :label="translate('schoolYear')"
                                :items="schoolYearNames"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12">
                            <VSelect
                                :label="translate('faculty')"
                                v-model.trim="item.faculty"
                                :items="facultyNames"
                                :rules="formRules"
                                @update:model-value="onUpdateFaculty"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12" v-if="studentTypes.includes(item.type)">
                            <VSelect
                                :label="translate('major')"
                                v-model.trim="item.major"
                                :items="majorNames"
                                :rules="formRules"
                            ></VSelect>
                        </VCol>
                        <VCol cols="12">
                            <VCheckbox
                                :label="translate('status')"
                                v-model.trim="item.status"
                                false-value="deactive"
                                true-value="active"
                            />
                        </VCol>
                    </VRow>
                </VForm>
            </VContainer>
        </template>
    </TableWithActions>
</template>
