<template>
  <pre>{{ jsondata }}</pre>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const jsondata = ref(null)
const error = ref(null)

/**
 * Calls the getAllBooks cloud function and keeps only response.data,
 * formatted as JSON so the page shows every book like an API.
 */
const getAllBookAPI = async () => {
  try {
    const response = await axios.get('https://us-central1-fit5032-6e8e6.cloudfunctions.net/getAllBooks')
    jsondata.value = JSON.stringify(response.data, null, 2)
    error.value = null
  } catch (err) {
    error.value = 'Error fetching all books'
    jsondata.value = null
  }
}

// Requests the data straight away when the page opens, no button needed
onMounted(() => {
  getAllBookAPI()
})
</script>
