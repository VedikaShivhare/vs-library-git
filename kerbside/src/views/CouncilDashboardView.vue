<script setup>
// BR (C.2): Council Officer dashboard - a page restricted to the
// Council Officer and Admin roles by the route guard in
// router/index.js. This page reads submittedCards from the shared
// listings.js module (see that file's comment for why it was moved
// there) and simply lists every item currently posted, rather than
// residents having to browse the Post an Item page's own list.
import { submittedCards } from '../listings.js'
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-1">Council dashboard</h1>
    <p class="text-muted mb-4">Items currently posted for collection, across all suburbs.</p>

    <p v-if="submittedCards.length === 0" class="text-muted">
      No items have been posted yet this session.
    </p>

    <table v-else class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Category</th>
          <th scope="col">Suburb</th>
          <th scope="col">Postcode</th>
          <th scope="col">Collection date</th>
          <th scope="col">Posted by</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(card, index) in submittedCards" :key="index">
          <td>{{ card.title }}</td>
          <td>{{ card.category }}</td>
          <td>{{ card.suburb }}</td>
          <td>{{ card.postcode }}</td>
          <td>{{ card.collectionDate }}</td>
          <td>{{ card.giverName }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
