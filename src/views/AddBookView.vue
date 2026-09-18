<template>
  <!-- This is the page where a user can add a new book to the library system -->
  <!-- The form below collects an isbn number and a book name, then saves them to Firestore -->
  <div class="container mt-5">
    <h1>Add book</h1>

    <form @submit.prevent="addBook">
      <!-- Isbn field, required before the form can be submitted -->
      <p>
        <label for="isbn">ISBN</label>
        <input id="isbn" v-model="isbn" type="number" required />
      </p>

      <!-- Name field, required before the form can be submitted -->
      <p>
        <label for="name">Name</label>
        <input id="name" v-model="name" type="text" required />
      </p>

      <button type="submit">Add book</button>
    </form>

    <!-- Shows the books already saved in Firestore, right below the form -->
    <BookList />
  </div>
</template>

<script setup>
// Bringing in the tools needed to talk to Firestore and to keep track of the form values
import { ref } from 'vue'
import db from '../firebase/init.js'
import { collection, addDoc } from 'firebase/firestore'

// Brings in the component that lists out the books already saved
import BookList from '../components/BookList.vue'

// These hold the current values typed into the isbn and name fields
const isbn = ref('')
const name = ref('')

// This runs when the form is submitted
// The submit.prevent on the form already stops the page from reloading
const addBook = async () => {
  try {
    // The isbn field comes in as text, so it is turned into a proper number here
    const isbnNumber = Number(isbn.value)
    if (isNaN(isbnNumber)) {
      alert('Please enter a valid ISBN number.')
      return
    }

    // Adds a new document to the books collection with the isbn and name typed in
    await addDoc(collection(db, 'books'), {
      isbn: isbnNumber,
      name: name.value
    })

    // Clears the form and lets the user know it worked
    isbn.value = ''
    name.value = ''
    alert('Book added successfully!')
  } catch (error) {
    console.error('Error adding book: ', error)
  }
}
</script>
