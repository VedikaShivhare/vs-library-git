<template>
  <div id="app">
    <h1>Book Counter</h1>
    <button @click="getBookCount">Get Book Count</button>
    <p v-if="count !== null">Total number of books: {{ count }}</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const count = ref(null)
const error = ref(null)

/**
 * Calls the countBooks cloud function and shows the number of books in Firestore.
 * The URL is replaced with the deployed function URL in step 9.4.
 */
const getBookCount = async () => {
  try {
    const response = await axios.get('https://us-central1-fit5032-6e8e6.cloudfunctions.net/countBooks')
    count.value = response.data.count
    error.value = null
  } catch (err) {
    error.value = 'Error fetching book count'
    count.value = null
  }
}
</script>
