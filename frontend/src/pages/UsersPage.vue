<template>
  <q-page class="row items-center justify-evenly q-pa-md page-background">
    <div>
      <div class="container flex justify-center q-mb-lg" style="padding: 12px">
        <div class="flex items-center justify-center q-pr-sm border-right-grey-custom">
          <q-input
            v-model="search"
            dense
            input-style="color: white;"
            placeholder="Search..."
            color="white"
            class="custom-input blue-container-input"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="white"/>
            </template>
          </q-input>
        </div>
        <div class="flex items-center justify-center q-pl-sm">
          <q-btn v-for="button in buttons" :key="button.title" color="primary" class="button" style="width: 150px;">
            {{ button.title }}
          </q-btn>
        </div>
      </div>

      <q-table
        style="border-radius: 24px; min-height: 460px"
        class="q-mt-lg"
        :rows="rows"
        :columns="columns"
        row-key="name"
        flat
        bordered
        virtual-scroll
      >
        <template v-slot:header-cell="props">
          <q-th
            :props="props"
            class="bg-secondary text-white"
            style="font-size: 15px; font-weight: bold;"
          >
            {{ props.col.label }}
          </q-th>
        </template>

        <template v-slot:body-cell="props">
          <q-td :props="props">
            {{ props.value }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import type { QTableColumn } from 'quasar';

defineOptions({
  name: 'UserPage'
});

interface UserRow {
  name: string;
  age: number;
  dateOfBirth: string;
  gender: string;
  email: string;
}

interface Button {
  title: string;
  action: string;
}

const search = ref<string>('');

const columns = ref<QTableColumn<UserRow>[]>([
  { name: 'name', label: 'Nome', align: 'left', field: 'name', sortable: false },
  { name: 'age', label: 'Età', align: 'left', field: 'age', sortable: false },
  { name: 'dateOfBirth', label: 'Birth', align: 'left', field: 'dateOfBirth', sortable: false },
  { name: 'gender', label: 'Gender', align: 'left', field: 'gender', sortable: false },
  { name: 'email', label: 'Email', align: 'left', field: 'email', sortable: false },
]);


const rows = ref([
  {
    name: 'Alice Smith',
    age: 30,
    dateOfBirth: '1993-05-15',
    gender: 'Female',
    email: 'alice.smith@example.com'
  },
  {
    name: 'Bob Johnson',
    age: 45,
    dateOfBirth: '1978-02-20',
    gender: 'Male',
    email: 'bob.johnson@example.com'
  },
  {
    name: 'Charlie Brown',
    age: 28,
    dateOfBirth: '1995-08-10',
    gender: 'Male',
    email: 'charlie.brown@example.com'
  },
  {
    name: 'Diana Prince',
    age: 35,
    dateOfBirth: '1988-12-25',
    gender: 'Female',
    email: 'diana.prince@example.com'
  },
  {
    name: 'Evan Davis',
    age: 40,
    dateOfBirth: '1983-07-30',
    gender: 'Male',
    email: 'evan.davis@example.com'
  }
]);

const buttons: Button[] = [
  {
    title: 'Filtro 1',
    action: 'https://quasar.dev'
  },
  {
    title: 'Filtro 2',
    action: 'https://quasar.dev'
  },
  {
    title: 'Filtro 3',
    action: 'https://quasar.dev'
  },
  {
    title: 'Filtro 4',
    action: 'https://quasar.dev'
  }
];
</script>004AAD

<style lang="scss">
.input-blue {
  border: none !important;
  border-radius: 100px;
}
</style>
