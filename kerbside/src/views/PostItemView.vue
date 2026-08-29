<script setup>
import { ref, computed } from 'vue'
import suburbList from '../assets/json/suburbs.json'

// Same pattern as the LibraryRegistrationForm activity: one ref() holding
// a plain object for all the form fields, used directly with v-model.
const formData = ref({
  title: '',
  description: '',
  category: '',
  otherCategory: '',
  condition: 'Good',
  suburb: '',
  postcode: '',
  collectionDate: '',
  giverName: '',
})

const CATEGORIES = ['Furniture', 'Appliances', 'Bikes & Sports', 'Electronics', 'Garden', 'Other']
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Needs repair']

// Shows the "please specify" box only once the resident has picked
// "Other" from the category dropdown.
const isOtherCategory = computed(() => formData.value.category === 'Other')

// List of real Victorian suburb names, used both for the search
// suggestions and to check the suburb the resident types against an
// actual place. Some suburb names appear more than once in the source
// data under different postcodes, so duplicates are removed here.
const suburbNames = [...new Set(suburbList.map((entry) => entry.suburb))].sort()

// Error messages, one per field that needs checking. Plain strings, empty
// when there is no error - checked with v-if in the template the same way
// as the rest of the form.
const errorMessage = ref('')

// Submitted listings are pushed into this array and shown as cards below
// the form, the same way the library registrations were shown as cards
// after submission.
const submittedCards = ref([])

// Builds a YYYY-MM-DD string from the LOCAL date, not UTC. Date's own
// toISOString() converts to UTC first, which is a day behind whenever it
// is already tomorrow in UTC but still today here in Melbourne - that
// would let residents pick a collection date that has already passed.
function toLocalIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Collection date can't be before today or more than 14 days out, so the
// date input itself is restricted using min/max.
const todayIso = toLocalIsoDate(new Date())
const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 14)
const maxIso = toLocalIsoDate(maxDate)

function handleSubmit() {
  // Check the required fields are filled in before accepting the listing.
  if (
    formData.value.title.trim() === '' ||
    formData.value.description.trim() === '' ||
    formData.value.category === '' ||
    formData.value.suburb.trim() === '' ||
    formData.value.postcode.trim() === '' ||
    formData.value.collectionDate === ''
  ) {
    errorMessage.value = 'Please fill in all the required fields before publishing.'
    return
  }

  // If "Other" was picked as the category, the resident has to say what
  // the item actually is in the extra field that appears.
  if (isOtherCategory.value && formData.value.otherCategory.trim() === '') {
    errorMessage.value = 'Please specify what the item is.'
    return
  }

  // Title and description need to actually describe the item, not just
  // be a single character, a number, or a random word, so a minimum
  // length is checked, plus the title has to contain at least one letter.
  if (formData.value.title.trim().length < 3) {
    errorMessage.value = 'Title must be at least 3 characters.'
    return
  }
  if (!/[a-zA-Z]/.test(formData.value.title)) {
    errorMessage.value = 'Title must contain at least one letter.'
    return
  }
  if (formData.value.description.trim().length < 10) {
    errorMessage.value = 'Description must be at least 10 characters.'
    return
  }

  // Suburb has to be one of the real Victorian suburbs in the dropdown
  // list, not free text - checked case-insensitively so picking or
  // typing "clayton" still matches "Clayton" in the list.
  const suburbMatch = suburbNames.some(
    (name) => name.toLowerCase() === formData.value.suburb.trim().toLowerCase(),
  )
  if (!suburbMatch) {
    errorMessage.value =
      'That suburb was not found in the Victorian suburb list. Please pick one from the suggestions as you type.'
    return
  }

  // Postcode has to be a 4 digit Victorian postcode (3000-3999).
  const postcodeTrimmed = formData.value.postcode.trim()
  if (!/^\d{4}$/.test(postcodeTrimmed)) {
    errorMessage.value = 'Postcode must be exactly 4 digits.'
    return
  }
  const postcodeNumber = Number(postcodeTrimmed)
  if (postcodeNumber < 3000 || postcodeNumber > 3999) {
    errorMessage.value = 'Please enter a Victorian postcode (3000-3999).'
    return
  }

  // Collection date has to be within the next 14 days, matching the
  // min/max already set on the input.
  if (formData.value.collectionDate < todayIso || formData.value.collectionDate > maxIso) {
    errorMessage.value = 'Collection date must be within the next 14 days.'
    return
  }

  errorMessage.value = ''

  // Add this listing to the list of cards, same as pushing a new
  // registration into submittedCards in the lecture example. When the
  // category is "Other", the card shows what the resident typed instead
  // of the plain word "Other".
  submittedCards.value.push({
    title: formData.value.title,
    description: formData.value.description,
    category: isOtherCategory.value ? formData.value.otherCategory : formData.value.category,
    condition: formData.value.condition,
    suburb: formData.value.suburb,
    postcode: formData.value.postcode,
    collectionDate: formData.value.collectionDate,
    giverName: formData.value.giverName === '' ? 'Anonymous resident' : formData.value.giverName,
  })

  // Reset the form for the next listing.
  formData.value = {
    title: '',
    description: '',
    category: '',
    otherCategory: '',
    condition: 'Good',
    suburb: '',
    postcode: '',
    collectionDate: '',
    giverName: '',
  }
}
</script>

<template>
  <div class="container py-4" style="max-width: 640px">
    <h1 class="h3 mb-4">Post an Item</h1>

    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>

    <form novalidate @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input id="title" v-model="formData.title" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="form-control"
          rows="3"
        ></textarea>
      </div>

      <div class="row">
        <div class="col-12 col-sm-6 mb-3">
          <label for="category" class="form-label">Category</label>
          <select id="category" v-model="formData.category" class="form-select">
            <option value="" disabled>Select a category</option>
            <option v-for="option in CATEGORIES" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>

        <div class="col-12 col-sm-6 mb-3">
          <label for="condition" class="form-label">Condition</label>
          <select id="condition" v-model="formData.condition" class="form-select">
            <option v-for="option in CONDITIONS" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <!-- Only shown once "Other" is picked above, so the resident can say
           what the item actually is. -->
      <div v-if="isOtherCategory" class="mb-3">
        <label for="otherCategory" class="form-label">Please specify</label>
        <input
          id="otherCategory"
          v-model="formData.otherCategory"
          type="text"
          class="form-control"
          placeholder="e.g. Exercise equipment"
        />
      </div>

      <div class="row">
        <div class="col-12 col-sm-6 mb-3">
          <label for="suburb" class="form-label">Suburb</label>
          <input
            id="suburb"
            v-model="formData.suburb"
            type="text"
            class="form-control"
            list="suburbOptions"
          />
          <datalist id="suburbOptions">
            <option v-for="name in suburbNames" :key="name" :value="name"></option>
          </datalist>
          <div class="form-text">Start typing to search all Victorian suburbs, e.g. Clayton.</div>
        </div>

        <div class="col-12 col-sm-6 mb-3">
          <label for="postcode" class="form-label">Postcode</label>
          <input
            id="postcode"
            v-model="formData.postcode"
            type="text"
            inputmode="numeric"
            class="form-control"
          />
          <div class="form-text">4-digit Victorian postcode, e.g. 3168.</div>
        </div>
      </div>

      <div class="mb-3">
        <label for="collectionDate" class="form-label">Council collection date</label>
        <input
          id="collectionDate"
          v-model="formData.collectionDate"
          type="date"
          class="form-control"
          :min="todayIso"
          :max="maxIso"
        />
        <div class="form-text">Must be within the next 14 days.</div>
      </div>

      <div class="mb-4">
        <label for="giverName" class="form-label">Your display name (optional)</label>
        <input id="giverName" v-model="formData.giverName" type="text" class="form-control" />
        <div class="form-text">Shown to residents who view your listing.</div>
      </div>

      <button type="submit" class="btn btn-success">Publish listing</button>
    </form>

    <!-- Submitted listings, shown as cards underneath the form. Each fact
         is on its own line with a label, instead of one dash-separated
         line, so the card is easy to read at a glance. -->
    <div v-if="submittedCards.length > 0" class="mt-5">
      <h2 class="h5 mb-3">Your listings this session</h2>
      <div class="card mb-3" v-for="(card, index) in submittedCards" :key="index">
        <div class="card-body">
          <h3 class="card-title h6">{{ card.title }}</h3>
          <p class="card-text mb-1"><strong>Description:</strong> {{ card.description }}</p>
          <p class="card-text mb-1"><strong>Category:</strong> {{ card.category }}</p>
          <p class="card-text mb-1"><strong>Condition:</strong> {{ card.condition }}</p>
          <p class="card-text mb-1"><strong>Suburb:</strong> {{ card.suburb }}</p>
          <p class="card-text mb-1"><strong>Postcode:</strong> {{ card.postcode }}</p>
          <p class="card-text mb-1"><strong>Collection date:</strong> {{ card.collectionDate }}</p>
          <p class="card-text mb-0"><strong>Posted by:</strong> {{ card.giverName }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
