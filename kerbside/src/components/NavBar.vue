<script setup>
// BR (A.2): Responsive navbar that collapses to a hamburger menu below the
// lg breakpoint, no custom JS needed beyond the Bootstrap bundle.
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
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link class="nav-link" to="/" exact-active-class="active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/post" exact-active-class="active"
              >Post an Item</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/register" exact-active-class="active"
              >Register</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
