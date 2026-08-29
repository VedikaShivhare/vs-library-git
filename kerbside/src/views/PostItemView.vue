<script setup>
import { reactive, ref } from 'vue'
import {
  validateRequired,
  validateMinLength,
  validatePostcode,
  validateCollectionDate,
  validateCategory,
} from '../utils/validators.js'

const CATEGORIES = ['Furniture', 'Appliances', 'Bikes & Sports', 'Electronics', 'Garden', 'Other']
const CONDITIONS = ['Excellent', 'Good', 'Fair', 'Needs repair']

const form = reactive({
  title: '',
  description: '',
  category: '',
  condition: 'Good',
  suburb: '',
  postcode: '',
  collectionDate: '',
  giverName: '',
})

// One error per field, keyed the same as the form object. Each field is
// validated on blur (so the user isn't scolded while still typing) and the
// whole form is re-validated on submit, satisfying BR B.1's requirement
// for validations that "provide clear feedback to the user" rather than a
// single generic "invalid form" message.
const errors = reactive({
  title: null,
  description: null,
  category: null,
  suburb: null,
  postcode: null,
  collectionDate: null,
})

const successMessage = ref('')

function validateField(field) {
  switch (field) {
    case 'title':
      errors.title = validateRequired(form.title, 'Title')
      break
    case 'description':
      errors.description = validateMinLength(form.description, 10, 'Description')
      break
    case 'category':
      errors.category = validateCategory(form.category, CATEGORIES)
      break
    case 'suburb':
      errors.suburb = validateRequired(form.suburb, 'Suburb')
      break
    case 'postcode':
      errors.postcode = validatePostcode(form.postcode)
      break
    case 'collectionDate':
      errors.collectionDate = validateCollectionDate(form.collectionDate)
      break
  }
}

function validateAll() {
  ;['title', 'description', 'category', 'suburb', 'postcode', 'collectionDate'].forEach(
    validateField,
  )
  return Object.values(errors).every((error) => error === null)
}

// Basic client-side sanitisation: strip anything that looks like an HTML
// tag before it's used anywhere, since listing text will later be
// displayed with plain text interpolation (never v-html) once the
// listings store exists — a first, simple line of defence, reinforced
// properly under BR C.4.
function sanitise(text) {
  return text.replace(/<[^>]*>/g, '').trim()
}

function handleSubmit() {
  if (!validateAll()) {
    successMessage.value = ''
    return
  }

  // Storing this listing (and rendering it dynamically elsewhere in the
  // app) is BR B.2 work, added in the next commit alongside the Browse
  // Map view. For now, a valid submission is confirmed to the user and
  // the form resets — proving the validation and sanitisation logic
  // works end-to-end.
  const cleaned = {
    title: sanitise(form.title),
    description: sanitise(form.description),
    category: form.category,
    condition: form.condition,
    suburb: sanitise(form.suburb),
    postcode: form.postcode.trim(),
    collectionDate: form.collectionDate,
    giverName: sanitise(form.giverName) || 'Anonymous resident',
  }

  successMessage.value = `"${cleaned.title}" passed validation and is ready to be listed.`

  Object.keys(form).forEach((key) => {
    form[key] = key === 'condition' ? 'Good' : ''
  })
  Object.keys(errors).forEach((key) => (errors[key] = null))
}

// Collection date input should not let the resident pick a date before
// today at all, as a first-line (HTML-level) constraint, backed up by the
// real validateCollectionDate business rule above.
const todayIso = new Date().toISOString().slice(0, 10)
const maxIso = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
</script>

<template>
  <div class="container py-4" style="max-width: 640px">
    <h1 class="h3 mb-4">Post an Item</h1>

    <div v-if="successMessage" class="alert alert-success" role="alert">
      {{ successMessage }}
    </div>

    <form novalidate @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': errors.title }"
          @blur="validateField('title')"
        />
        <div v-if="errors.title" class="invalid-feedback">{{ errors.title }}</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-control"
          :class="{ 'is-invalid': errors.description }"
          rows="3"
          @blur="validateField('description')"
        ></textarea>
        <div v-if="errors.description" class="invalid-feedback">{{ errors.description }}</div>
      </div>

      <div class="row">
        <div class="col-12 col-sm-6 mb-3">
          <label for="category" class="form-label">Category</label>
          <select
            id="category"
            v-model="form.category"
            class="form-select"
            :class="{ 'is-invalid': errors.category }"
            @blur="validateField('category')"
          >
            <option value="" disabled>Select a category</option>
            <option v-for="option in CATEGORIES" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <div v-if="errors.category" class="invalid-feedback">{{ errors.category }}</div>
        </div>

        <div class="col-12 col-sm-6 mb-3">
          <label for="condition" class="form-label">Condition</label>
          <select id="condition" v-model="form.condition" class="form-select">
            <option v-for="option in CONDITIONS" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-sm-6 mb-3">
          <label for="suburb" class="form-label">Suburb</label>
          <input
            id="suburb"
            v-model="form.suburb"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.suburb }"
            @blur="validateField('suburb')"
          />
          <div v-if="errors.suburb" class="invalid-feedback">{{ errors.suburb }}</div>
        </div>

        <div class="col-12 col-sm-6 mb-3">
          <label for="postcode" class="form-label">Postcode</label>
          <input
            id="postcode"
            v-model="form.postcode"
            type="text"
            inputmode="numeric"
            class="form-control"
            :class="{ 'is-invalid': errors.postcode }"
            @blur="validateField('postcode')"
          />
          <div v-if="errors.postcode" class="invalid-feedback">{{ errors.postcode }}</div>
          <div class="form-text">4-digit Victorian postcode, e.g. 3168.</div>
        </div>
      </div>

      <div class="mb-3">
        <label for="collectionDate" class="form-label">Council collection date</label>
        <input
          id="collectionDate"
          v-model="form.collectionDate"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': errors.collectionDate }"
          :min="todayIso"
          :max="maxIso"
          @blur="validateField('collectionDate')"
        />
        <div v-if="errors.collectionDate" class="invalid-feedback">
          {{ errors.collectionDate }}
        </div>
        <div class="form-text">Must be within the next 14 days.</div>
      </div>

      <div class="mb-4">
        <label for="giverName" class="form-label">Your display name (optional)</label>
        <input id="giverName" v-model="form.giverName" type="text" class="form-control" />
        <div class="form-text">Shown to residents who view your listing.</div>
      </div>

      <button type="submit" class="btn btn-success">Publish listing</button>
    </form>
  </div>
</template>
