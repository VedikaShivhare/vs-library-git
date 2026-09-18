<template>
  <!-- This shows only the books whose isbn is greater than 1000 -->
  <!-- The list is fetched once from Firestore using a query with a where statement -->
  <div>
    <h1>Books with ISBN &gt; 1000</h1>
    <ul>
      <li v-for="book in books" :key="book.id">{{ book.name }} (ISBN: {{ book.isbn }})</li>
    </ul>
  </div>
</template>

<script setup>
// Bringing in the tools needed to query Firestore and to keep track of the results
import { ref, onMounted } from 'vue'
import db from '../firebase/init.js'
import { collection, query, where, getDocs } from 'firebase/firestore'

// This holds the books that come back from the query
const books = ref([])

// This looks through the books collection and only keeps the ones
// where the isbn field is greater than 1000
const fetchBooks = async () => {
  try {
    const q = query(collection(db, 'books'), where('isbn', '>', 1000))
    const querySnapshot = await getDocs(q)
    const booksArray = []
    querySnapshot.forEach((doc) => {
      booksArray.push({ id: doc.id, ...doc.data() })
    })
    books.value = booksArray
  } catch (error) {
    console.error('Error fetching books: ', error)
  }
}

// Runs the query as soon as the component is loaded onto the page
onMounted(() => {
  fetchBooks()
})
</script>
