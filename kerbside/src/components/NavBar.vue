<script setup>
// Bootstrap's collapsible navbar is the clearest, most easily demonstrated
// piece of BR A.2: on wide screens the links sit inline, and beneath the
// `lg` breakpoint it collapses to a hamburger menu automatically, with no
// custom JS required beyond the Bootstrap bundle already imported in
// main.js.
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
        </ul>
      </div>
    </div>
  </nav>
</template>
