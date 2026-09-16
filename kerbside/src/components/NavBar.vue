<script setup>
// BR (A.2): Responsive navbar that collapses to a hamburger menu below the
// lg breakpoint, no custom JS needed beyond the Bootstrap bundle.
//
// BR (C.1): The login links use v-if / v-else against the shared
// currentUser state, the same conditional-rendering approach taught in
// Week 5 (Step 6, "Conditional Rendering") for showing different
// content depending on whether someone is logged in.
import { currentUser, logOut } from '../auth.js'
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
