<script setup>
// BR (C.2): Access-denied page, as required by Week 5 (Step 6,
// Requirements): "Create an access-denied page to show unauthenticated
// users." The route guard in router/index.js sends anyone here who
// tries to open a page their account is not allowed to see, whether
// that is because they are not logged in at all or because they are
// logged in with the wrong role.
</script>

<template>
  <div class="container py-5 text-center">
    <h1 class="h3 mb-3">Access denied</h1>
    <p class="mb-4">
      You don't have permission to view that page. If you think this is a mistake, check that
      you are logged in with the right account.
    </p>
    <router-link to="/" class="btn btn-success">Back to home</router-link>
  </div>
</template>
