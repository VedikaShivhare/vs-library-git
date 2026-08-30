<script setup>
// BR (A.1): Composition API, script setup, plain ref() for state.
import { ref, computed } from 'vue'
import suburbList from '../assets/json/suburbs.json'

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

// Show the "please specify" field only when Other is picked.
const isOtherCategory = computed(() => formData.value.category === 'Other')

// BR (B.2): Dynamic data fetched from an external JSON file.
// suburbNames comes from suburbs.json, not a hardcoded list. Duplicate
// names (same suburb, different postcode) are removed here.
const suburbNames = [...new Set(suburbList.map((entry) => entry.suburb))].sort()

// One error slot per field. Filled in or cleared by that field's own
// validate function.
const errors = ref({
  title: null,
  description: null,
  category: null,
  suburb: null,
  postcode: null,
  collectionDate: null,
})

// BR (B.2): Submitted listings are stored in state and rendered dynamically.
const submittedCards = ref([])

// Build a YYYY-MM-DD string from local time, not UTC.
// toISOString() converts to UTC first, which is a day behind once it's
// already tomorrow in UTC but still today in Melbourne.
function toLocalIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const todayIso = toLocalIsoDate(new Date())
const maxDate = new Date()
maxDate.setDate(maxDate.getDate() + 14)
const maxIso = toLocalIsoDate(maxDate)

// BR (B.1): Title is required and must be at least 3 characters.
function validateTitle(blur) {
  const value = formData.value.title.trim()
  if (value.length < 3) {
    if (blur) errors.value.title = 'Title must be at least 3 characters.'
  } else if (!/[a-zA-Z]/.test(value)) {
    if (blur) errors.value.title = 'Title must contain at least one letter.'
  } else {
    errors.value.title = null
  }
}

// BR (B.1): Description must be at least 10 characters.
function validateDescription(blur) {
  const value = formData.value.description.trim()
  if (value.length < 10) {
    if (blur) errors.value.description = 'Description must be at least 10 characters.'
  } else {
    errors.value.description = null
  }
}

// BR (B.1): Category is required, plus a specify field when Other is picked.
function validateCategory(blur) {
  if (formData.value.category === '') {
    if (blur) errors.value.category = 'Please select a category.'
  } else if (isOtherCategory.value && formData.value.otherCategory.trim() === '') {
    if (blur) errors.value.category = 'Please specify what the item is.'
  } else {
    errors.value.category = null
  }
}

// BR (B.1): Suburb must match the real Victorian suburb list (BR B.2).
function validateSuburb(blur) {
  const value = formData.value.suburb.trim()
  const suburbMatch = suburbNames.some((name) => name.toLowerCase() === value.toLowerCase())
  if (value === '') {
    if (blur) errors.value.suburb = 'Suburb is required.'
  } else if (!suburbMatch) {
    if (blur)
      errors.value.suburb =
        'That suburb was not found in the Victorian suburb list. Please pick one from the suggestions as you type.'
  } else {
    errors.value.suburb = null
  }
}

// BR (B.1): Postcode must be 4 digits within the Victorian range.
function validatePostcode(blur) {
  const value = formData.value.postcode.trim()
  if (!/^\d{4}$/.test(value)) {
    if (blur) errors.value.postcode = 'Postcode must be exactly 4 digits.'
  } else if (Number(value) < 3000 || Number(value) > 3999) {
    if (blur) errors.value.postcode = 'Please enter a Victorian postcode (3000-3999).'
  } else {
    errors.value.postcode = null
  }
}

// BR (B.1): Collection date must fall within the next 14 days.
function validateCollectionDate(blur) {
  const value = formData.value.collectionDate
  if (value === '') {
    if (blur) errors.value.collectionDate = 'Collection date is required.'
  } else if (value < todayIso || value > maxIso) {
    if (blur) errors.value.collectionDate = 'Collection date must be within the next 14 days.'
  } else {
    errors.value.collectionDate = null
  }
}

function submitForm() {
  // Run every validator with blur = true so all errors show at once,
  // even for a field the resident never actually clicked into.
  validateTitle(true)
  validateDescription(true)
  validateCategory(true)
  validateSuburb(true)
  validatePostcode(true)
  validateCollectionDate(true)

  const hasErrors = Object.values(errors.value).some((message) => message !== null)
  if (hasErrors) {
    return
  }

  // Show what the resident typed instead of the word "Other".
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

  clearForm()
}

function clearForm() {
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
  errors.value = {
    title: null,
    description: null,
    category: null,
    suburb: null,
    postcode: null,
    collectionDate: null,
  }
}
</script>

<template>
  <div class="container py-4" style="max-width: 640px">
    <h1 class="h3 mb-4">Post an Item</h1>

    <!-- novalidate: our own validators run instead of the browser's -->
    <!-- native check, which fails silently against the date min/max. -->
    <form novalidate @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="form-control"
          @blur="() => validateTitle(true)"
          @input="() => validateTitle(false)"
        />
        <div v-if="errors.title" class="text-danger">{{ errors.title }}</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="formData.description"
          class="form-control"
          rows="3"
          @blur="() => validateDescription(true)"
          @input="() => validateDescription(false)"
        ></textarea>
        <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
      </div>

      <!-- BR (A.2): Responsive grid, stacks below sm and sits side by side above it. -->
      <div class="row">
        <div class="col-12 col-sm-6 mb-3">
          <label for="category" class="form-label">Category</label>
          <select
            id="category"
            v-model="formData.category"
            class="form-select"
            @blur="() => validateCategory(true)"
            @change="() => validateCategory(false)"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="option in CATEGORIES" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <div v-if="errors.category" class="text-danger">{{ errors.category }}</div>
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

      <div v-if="isOtherCategory" class="mb-3">
        <label for="otherCategory" class="form-label">Please specify</label>
        <input
          id="otherCategory"
          v-model="formData.otherCategory"
          type="text"
          class="form-control"
          placeholder="e.g. Exercise equipment"
          @blur="() => validateCategory(true)"
          @input="() => validateCategory(false)"
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
            @blur="() => validateSuburb(true)"
            @input="() => validateSuburb(false)"
          />
          <datalist id="suburbOptions">
            <option v-for="name in suburbNames" :key="name" :value="name"></option>
          </datalist>
          <div v-if="errors.suburb" class="text-danger">{{ errors.suburb }}</div>
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
            @blur="() => validatePostcode(true)"
            @input="() => validatePostcode(false)"
          />
          <div v-if="errors.postcode" class="text-danger">{{ errors.postcode }}</div>
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
          @blur="() => validateCollectionDate(true)"
          @input="() => validateCollectionDate(false)"
        />
        <div v-if="errors.collectionDate" class="text-danger">{{ errors.collectionDate }}</div>
        <div class="form-text">Must be within the next 14 days.</div>
      </div>

      <div class="mb-4">
        <label for="giverName" class="form-label">Your display name (optional)</label>
        <input id="giverName" v-model="formData.giverName" type="text" class="form-control" />
        <div class="form-text">Shown to residents who view your listing.</div>
      </div>

      <button type="submit" class="btn btn-success">Publish listing</button>
    </form>

    <!-- BR (B.2): Listings rendered dynamically from submittedCards. -->
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
