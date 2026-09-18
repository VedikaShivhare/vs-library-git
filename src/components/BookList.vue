<template>
  <!-- This shows only the books whose isbn is greater than 1000 -->
  <!-- The list is fetched once from Firestore using a query with a where statement -->
  <!-- Each book can also be updated or deleted straight from this list -->
  <div>
    <h1>Books with ISBN &gt; 1000</h1>
    <ul>
      <li v-for="book in books" :key="book.id">
        <!-- Typing a new name here and pressing update saves it straight to Firestore -->
        <input v-model="book.name" type="text" />
        <span>(ISBN: {{ book.isbn }})</span>
        <button type="button" @click="updateBook(book)">Update</button>
        <button type="button" @click="deleteBook(book.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
// Bringing in the tools needed to query, update and delete data in Firestore
import { ref, onMounted } from 'vue'
import db from '../firebase/init.js'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'

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

// Saves the current name typed into the input back to that book's document in Firestore
const updateBook = async (book) => {
  try {
    const bookRef = doc(db, 'books', book.id)
    await updateDoc(bookRef, { name: book.name })
    alert('Book updated successfully!')
  } catch (error) {
    console.error('Error updating book: ', error)
  }
}

// Removes a book's document from Firestore, then removes it from the list on screen
const deleteBook = async (id) => {
  try {
    const bookRef = doc(db, 'books', id)
    await deleteDoc(bookRef)
    books.value = books.value.filter((book) => book.id !== id)
    alert('Book deleted successfully!')
  } catch (error) {
    console.error('Error deleting book: ', error)
  }
}

// Runs the query as soon as the component is loaded onto the page
onMounted(() => {
  fetchBooks()
})
</script>
