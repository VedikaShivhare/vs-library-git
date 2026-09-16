<script setup>
// BR (A.1): Composition API, script setup, plain ref() for state.
import { ref, computed } from 'vue'
import suburbList from '../assets/json/suburbs.json'
import { submittedCards } from '../listings.js'

const formData = ref({
  title: '',
  description: '',
  category: '',
  otherCategory: '',
  condition: '',
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

// The datalist normally offers every suburb. Once a valid postcode is
// entered, this narrows to just the suburbs that postcode actually
// covers (a Victorian postcode is shared by several suburbs, e.g. 3168
// covers both Clayton and Notting Hill, so there usually isn't one
// "correct" answer to auto-fill).
const suburbSuggestions = ref(suburbNames)

// One error slot per field. Filled in or cleared by that field's own
// validate function.
const errors = ref({
  title: null,
  description: null,
  category: null,
  condition: null,
  suburb: null,
  postcode: null,
  collectionDate: null,
})

// BR (B.2): Submitted listings are stored in state and rendered dynamically.
// BR (C.2): This now comes from the shared listings.js module (moved out
// of this file) so the Council Officer dashboard can read the same list.
// It is still an in-memory ref() only, same as before this move.

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

// A "real" word needs more than one distinct character repeated, e.g.
// "aaaa" or "----" should not pass just because they clear the length
// check. This does not ban numbers or symbols. e.g. "IKEA MALM desk (2
// drawers)" is a perfectly normal real-world listing title.
function isJunkText(value) {
  const cleaned = value.replace(/\s+/g, '')
  if (cleaned.length === 0) return true
  return new Set(cleaned.toLowerCase()).size === 1
}

// BR (B.1): Title is required, must be at least 3 characters, and can't
// be junk (e.g. all the same character repeated).
function validateTitle(blur) {
  const value = formData.value.title.trim()
  if (value.length < 3) {
    if (blur) errors.value.title = 'Title must be at least 3 characters.'
  } else if (isJunkText(value)) {
    if (blur) errors.value.title = 'Please enter a real title for the item.'
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

// BR (B.1): Category is required, plus a specify field when Other is
// picked. The specify field needs a real word, not just any keystroke,
// same "not junk" rule as the title.
function validateCategory(blur) {
  const otherValue = formData.value.otherCategory.trim()
  if (formData.value.category === '') {
    if (blur) errors.value.category = 'Please select a category.'
  } else if (isOtherCategory.value && otherValue.length < 2) {
    if (blur) errors.value.category = 'Please specify what the item is (at least 2 characters).'
  } else if (isOtherCategory.value && isJunkText(otherValue)) {
    if (blur) errors.value.category = 'Please describe the item, not just repeated characters.'
  } else {
    errors.value.category = null
  }
}

// BR (B.1): Condition is required, same as Category, instead of quietly
// defaulting to "Good" without the resident choosing it.
function validateCondition(blur) {
  if (formData.value.condition === '') {
    if (blur) errors.value.condition = 'Please select a condition.'
  } else {
    errors.value.condition = null
  }
}

// BR (B.1): Suburb must match the real Victorian suburb list (BR B.2).
function validateSuburb(blur) {
  const value = formData.value.suburb.trim()
  const suburbMatch = suburbNames.some((name) => name.toLowerCase() === value.toLowerCase())
  if (value === '') {
    if (blur) errors.value.suburb = 'Suburb is required.'
  } else if (!suburbMatch) {
    if (blur) errors.value.suburb = 'Choose a suburb from the list.'
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

// Convenience only, not a validation rule. A Victorian postcode almost
// always covers more than one suburb (3168 = Clayton + Notting Hill),
// so this can't just guess. Instead: if the postcode covers exactly one
// suburb, fill it in; if it covers several, narrow the suburb
// suggestions down to just those so the resident picks from a short,
// correct list instead of all ~3,300 Victorian suburbs. Never overwrites
// a suburb the resident already typed.
function autoFillSuburbFromPostcode() {
  const value = formData.value.postcode.trim()
  if (!/^\d{4}$/.test(value)) {
    suburbSuggestions.value = suburbNames
    return
  }
  const matches = [...new Set(suburbList.filter((entry) => entry.postcode === value).map((entry) => entry.suburb))]
  if (matches.length === 0) {
    suburbSuggestions.value = suburbNames
    return
  }
  suburbSuggestions.value = matches.sort()
  if (matches.length === 1 && formData.value.suburb.trim() === '') {
    formData.value.suburb = matches[0]
    validateSuburb(false)
  }
}

// Same idea in the other direction. Most suburbs sit in exactly one
// postcode, so this one can auto-fill more often, but a handful of large
// suburbs span more than one postcode, so it only fills when the match
// is unique, and never overwrites a postcode the resident already typed.
function autoFillPostcodeFromSuburb() {
  const value = formData.value.suburb.trim()
  const matches = [
    ...new Set(
      suburbList.filter((entry) => entry.suburb.toLowerCase() === value.toLowerCase()).map((entry) => entry.postcode),
    ),
  ]
  if (matches.length === 1 && formData.value.postcode.trim() === '') {
    formData.value.postcode = matches[0]
    validatePostcode(false)
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
  validateCondition(true)
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
    condition: '',
    suburb: '',
    postcode: '',
    collectionDate: '',
    giverName: '',
  }
  errors.value = {
    title: null,
    description: null,
    category: null,
    condition: null,
    suburb: null,
    postcode: null,
    collectionDate: null,
  }
  suburbSuggestions.value = suburbNames
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
        <div v-if="errors.title" class="text-danger form-error">
          <span aria-hidden="true">&#9888;</span> {{ errors.title }}
        </div>
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
        <div v-if="errors.description" class="text-danger form-error">
          <span aria-hidden="true">&#9888;</span> {{ errors.description }}
        </div>
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
          <div v-if="errors.category" class="text-danger form-error">
            <span aria-hidden="true">&#9888;</span> {{ errors.category }}
          </div>
        </div>

        <div class="col-12 col-sm-6 mb-3">
          <label for="condition" class="form-label">Condition</label>
          <select
            id="condition"
            v-model="formData.condition"
            class="form-select"
            @blur="() => validateCondition(true)"
            @change="() => validateCondition(false)"
          >
            <option value="" disabled>Select condition</option>
            <option v-for="option in CONDITIONS" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
          <div v-if="errors.condition" class="text-danger form-error">
            <span aria-hidden="true">&#9888;</span> {{ errors.condition }}
          </div>
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
            autocomplete="off"
            @blur="
              () => {
                validateSuburb(true)
                autoFillPostcodeFromSuburb()
              }
            "
            @input="() => validateSuburb(false)"
          />
          <datalist id="suburbOptions">
            <option v-for="name in suburbSuggestions" :key="name" :value="name"></option>
          </datalist>
          <div v-if="errors.suburb" class="text-danger form-error">
            <span aria-hidden="true">&#9888;</span> {{ errors.suburb }}
          </div>
          <div class="form-text">Enter a valid Victorian suburb.</div>
        </div>

        <div class="col-12 col-sm-6 mb-3">
          <label for="postcode" class="form-label">Postcode</label>
          <input
            id="postcode"
            v-model="formData.postcode"
            type="text"
            inputmode="numeric"
            class="form-control"
            @blur="
              () => {
                validatePostcode(true)
                autoFillSuburbFromPostcode()
              }
            "
            @input="
              () => {
                validatePostcode(false)
                autoFillSuburbFromPostcode()
              }
            "
          />
          <div v-if="errors.postcode" class="text-danger form-error">
            <span aria-hidden="true">&#9888;</span> {{ errors.postcode }}
          </div>
          <div class="form-text">Enter a valid 4-digit postcode.</div>
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
        <div v-if="errors.collectionDate" class="text-danger form-error">
          <span aria-hidden="true">&#9888;</span> {{ errors.collectionDate }}
        </div>
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
