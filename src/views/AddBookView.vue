<template>
  <div class="container mt-5">
    <h1>Add book</h1>

    <form @submit.prevent="addBook">
      <p>
        <label for="isbn">ISBN</label>
        <input id="isbn" v-model.number="isbn" type="number" required />
      </p>

      <p>
        <label for="name">Name</label>
        <input id="name" v-model="name" type="text" required />
      </p>

      <button type="submit">Add book</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import db from '../firebase/init'

const isbn = ref(null)
const name = ref('')

const addBook = async () => {
  await addDoc(collection(db, 'books'), {
    isbn: isbn.value,
    name: name.value
  })

  isbn.value = null
  name.value = ''
}
</script>
