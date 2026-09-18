<template>
  <!-- This shows the list of books that are currently stored in Firestore -->
  <!-- It updates on its own whenever a new book is added -->
  <div class="mt-4">
    <h2>Books in the library</h2>

    <p v-if="books.length === 0">No books have been added yet.</p>

    <ul v-else>
      <li v-for="book in books" :key="book.id">{{ book.name }} (ISBN {{ book.isbn }})</li>
    </ul>
  </div>
</template>

<script setup>
// Bringing in the tools needed to read live data from Firestore
import { ref, onMounted, onUnmounted } from 'vue'
import { collection, onSnapshot } from 'firebase/firestore'
import db from '../firebase/init'

// This holds the current list of books shown on the page
const books = ref([])

// This will store the function that stops listening to Firestore
// once the component is no longer on screen
let unsubscribe = null

// When the page loads, start listening to the books collection
// Every time a book is added, changed or removed, this list updates automatically
onMounted(() => {
  unsubscribe = onSnapshot(collection(db, 'books'), (snapshot) => {
    books.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
  })
})

// When the page is closed, stop listening so it does not keep running in the background
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe()
  }
})
</script>
