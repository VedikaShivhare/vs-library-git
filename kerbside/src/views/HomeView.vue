<script setup>
// Static home page with a hero section plus a three-step explainer.
// No dynamic content here yet, that comes with the Browse Map page.
</script>

<template>
  <section class="kerb-hero text-center">
    <div class="container">
      <h1 class="display-5 fw-bold">Give it away before the truck does.</h1>
      <p class="lead mb-4">
        Kerbside is a time-limited map of hard rubbish. Post what you're putting out, and
        neighbours can claim it before council collects it for landfill.
      </p>
    </div>
  </section>

  <!-- BR (A.2): Responsive grid, one column on mobile and three columns on md+. -->
  <section class="container py-5">
    <div class="row g-4 text-center">
      <div class="col-12 col-md-4">
        <h2 class="h4">1. Post it</h2>
        <p>Add a photo, category and your council collection date before you put it on the kerb.</p>
      </div>
      <div class="col-12 col-md-4">
        <h2 class="h4">2. It goes live</h2>
        <p>Nearby residents see it on the map, with a live countdown to your collection date.</p>
      </div>
      <div class="col-12 col-md-4">
        <h2 class="h4">3. Someone claims it</h2>
        <p>They collect it before the truck does &mdash; one less thing headed for landfill.</p>
      </div>
    </div>
  </section>
</template>
