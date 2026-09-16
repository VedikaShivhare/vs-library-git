<script setup>
// BR (A.2): Responsive navbar that collapses to a hamburger menu below the
// lg breakpoint, no custom JS needed beyond the Bootstrap bundle.
//
// BR (C.1): The login links use v-if / v-else against the shared
// currentUser state, the same conditional-rendering approach taught in
// Week 5 (Step 6, "Conditional Rendering") for showing different
// content depending on whether someone is logged in.
//
// BR (C.2): The Council Dashboard and Manage Users links each use their
// own v-if, checking currentUser.value?.role against the ROLES constant,
// so a resident never even sees a link to a page they are not allowed
// to open. This is the same conditional-rendering idea as the BR (C.1)
// login/logout switch above, just checked against a role instead of a
// plain logged-in/logged-out flag - the actual access control still
// happens in the router guard in router/index.js, this only hides the
// links so the navbar matches what each account is allowed to do.
import { currentUser, logOut, ROLES } from '../auth.js'
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogOut() {
  logOut()
  router.push('/')
}
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #1b5e20">
    <div class="container">
      <router-link class="navbar-brand" to="/">Kerbside</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#kerbNav"
        aria-controls="kerbNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div id="kerbNav" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/post" exact-active-class="active"
              >Post an Item</router-link
            >
          </li>

          <!-- BR (C.2): Only Council Officer and Admin accounts see this link. -->
          <li
            v-if="currentUser?.role === ROLES.COUNCIL_OFFICER || currentUser?.role === ROLES.ADMIN"
            class="nav-item"
          >
            <router-link class="nav-link" to="/council-dashboard" exact-active-class="active"
              >Council Dashboard</router-link
            >
          </li>

          <!-- BR (C.2): Only Admin accounts see this link. -->
          <li v-if="currentUser?.role === ROLES.ADMIN" class="nav-item">
            <router-link class="nav-link" to="/admin/users" exact-active-class="active"
              >Manage Users</router-link
            >
          </li>

          <!-- BR (C.1): Logged-in residents see their name and a logout -->
          <!-- button instead of the login/register links. -->
          <template v-if="currentUser">
            <li class="nav-item">
              <span class="nav-link text-white-50">Hi, {{ currentUser.name }}</span>
            </li>
            <li class="nav-item">
              <button type="button" class="btn btn-outline-light btn-sm" @click="handleLogOut">
                Log out
              </button>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link" to="/login" exact-active-class="active"
                >Log in</router-link
              >
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/register" exact-active-class="active"
                >Register</router-link
              >
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>
