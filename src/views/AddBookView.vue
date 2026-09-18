<template>
  <!-- This is the page where a user can add a new book to the library system -->
  <!-- The form below collects an isbn number and a book name, then saves them to Firestore -->
  <div class="container mt-5">
    <h1>Add book</h1>

    <form @submit.prevent="addBook">
      <!-- Isbn field, saved as a number and required before the form can be submitted -->
      <p>
        <label for="isbn">ISBN</label>
        <input id="isbn" v-model.number="isbn" type="number" required />
      </p>

      <!-- Name field, saved as text and required before the form can be submitted -->
      <p>
        <label for="name">Name</label>
        <input id="name" v-model="name" type="text" required />
      </p>

      <button type="submit">Add book</button>
    </form>
  </div>
</template>

<script setup>
// Bringing in the tools needed to talk to Firestore and to keep track of the form values
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import db from '../firebase/init'

// These hold the current values typed into the isbn and name fields
const isbn = ref(null)
const name = ref('')

// This runs when the form is submitted
// The submit.prevent on the form already stops the page from reloading
// It takes the isbn and name the user typed in and adds them as a new document
// inside the books collection in Firestore, then clears the form for the next entry
const addBook = async () => {
  await addDoc(collection(db, 'books'), {
    isbn: isbn.value,
    name: name.value
  })

  isbn.value = null
  name.value = ''
}
</script>
