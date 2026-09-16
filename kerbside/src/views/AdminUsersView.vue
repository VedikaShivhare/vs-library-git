<script setup>
// BR (C.2): Admin page - restricted to the Admin role only by the route
// guard in router/index.js. Lists every registered account so an Admin
// can see who has signed up and in what role, using the same loadUsers
// array from auth.js that Login and Register already read from.
import { loadUsers, ROLES } from '../auth.js'

const users = loadUsers()

// Turns the internal role value (e.g. 'councilOfficer') into the
// friendlier label shown on the Register page's dropdown, so this table
// reads the same way the rest of the app does.
const ROLE_LABELS = {
  [ROLES.RESIDENT]: 'Resident',
  [ROLES.COUNCIL_OFFICER]: 'Council Officer',
  [ROLES.ADMIN]: 'Admin',
}
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-1">Manage users</h1>
    <p class="text-muted mb-4">Every account registered on Kerbside.</p>

    <p v-if="users.length === 0" class="text-muted">No accounts have been registered yet.</p>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ ROLE_LABELS[user.role] ?? user.role }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
