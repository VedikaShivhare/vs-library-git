<template>
  <!-- This shows the books sorted by isbn, with only the first few results kept -->
  <!-- It uses a query with an orderBy statement and a limit statement together -->
  <div>
    <h1>Top 5 books by ISBN</h1>
    <ul>
      <li v-for="book in books" :key="book.id">{{ book.name }} (ISBN: {{ book.isbn }})</li>
    </ul>
  </div>
</template>

<script setup>
// Bringing in the tools needed to query Firestore and to keep track of the results
import { ref, onMounted } from 'vue'
import db from '../firebase/init.js'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'

// This holds the books that come back from the query
const books = ref([])

// This sorts every book by isbn from smallest to largest, then keeps only the first five
const fetchSortedBooks = async () => {
  try {
    const q = query(collection(db, 'books'), orderBy('isbn'), limit(5))
    const querySnapshot = await getDocs(q)
    const booksArray = []
    querySnapshot.forEach((doc) => {
      booksArray.push({ id: doc.id, ...doc.data() })
    })
    books.value = booksArray
  } catch (error) {
    console.error('Error fetching sorted books: ', error)
  }
}

// Runs the query as soon as the component is loaded onto the page
onMounted(() => {
  fetchSortedBooks()
})
</script>
