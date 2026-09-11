<script setup>
// BR (C.1): Basic authentication - registration half. Creates a user
// account and stores it client-side (no Firebase, no backend, matches
// the "basic app" allowance for this assignment).
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  name: '',
  email: '',
  password: '',
})

// One error slot per field, same pattern as PostItemView.
const errors = ref({
  name: null,
  email: null,
  password: null,
})

// Set after a successful registration so the form can show a short
// confirmation before sending the resident on to log in.
const registeredName = ref(null)

// BR (C.1): Name is required, same "must be at least a couple of
// characters" rule as the item title on the Post an Item page.
function validateName(blur) {
  const value = formData.value.name.trim()
  if (value.length < 2) {
    if (blur) errors.value.name = 'Name must be at least 2 characters.'
  } else {
    errors.value.name = null
  }
}

// BR (C.1): Email is required and must look like a real email address.
// This is a basic shape check, not full RFC validation - good enough for
// a client-side-only account system.
function validateEmail(blur) {
  const value = formData.value.email.trim()
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  if (value === '') {
    if (blur) errors.value.email = 'Email is required.'
  } else if (!looksLikeEmail) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else if (blur && emailAlreadyUsed(value)) {
    errors.value.email = 'An account with this email already exists.'
  } else {
    errors.value.email = null
  }
}

// BR (C.1): Password must be at least 8 characters. Kept to length only
// for now - this is the first, basic version of authentication.
function validatePassword(blur) {
  const value = formData.value.password
  if (value.length < 8) {
    if (blur) errors.value.password = 'Password must be at least 8 characters.'
  } else {
    errors.value.password = null
  }
}

// Reads existing accounts out of localStorage. Returns an empty array
// the first time the app runs, before any account exists yet.
function loadUsers() {
  const stored = localStorage.getItem('kerbsideUsers')
  return stored ? JSON.parse(stored) : []
}

function emailAlreadyUsed(email) {
  return loadUsers().some((user) => user.email.toLowerCase() === email.trim().toLowerCase())
}

function submitForm() {
  // Run every validator with blur = true so all errors show at once,
  // same approach as the Post an Item form.
  validateName(true)
  validateEmail(true)
  validatePassword(true)

  const hasErrors = Object.values(errors.value).some((message) => message !== null)
  if (hasErrors) {
    return
  }

  // BR (C.1): Save the new account. Storing the password in plain text
  // in localStorage is not real-world secure, but there is no backend in
  // this basic version of the app to hash it against - this is flagged
  // as a known limitation, not a claim of production-grade security.
  const users = loadUsers()
  users.push({
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    password: formData.value.password,
  })
  localStorage.setItem('kerbsideUsers', JSON.stringify(users))

  registeredName.value = formData.value.name.trim()

  setTimeout(() => {
    router.push('/')
  }, 1500)
}
</script>

<template>
  <div class="container py-4" style="max-width: 480px">
    <h1 class="h3 mb-4">Create an account</h1>

    <div v-if="registeredName" class="alert alert-success" role="alert">
      Account created for {{ registeredName }}. Taking you to the home page&hellip;
    </div>

    <!-- novalidate: our own validators run instead of the browser's native check. -->
    <form v-else novalidate @submit.prevent="submitForm">
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-control"
          @blur="() => validateName(true)"
          @input="() => validateName(false)"
        />
        <div v-if="errors.name" class="text-danger form-error">
          <span aria-hidden="true">&#9888;</span> {{ errors.name }}
        </div>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-control"
          @blur="() => validateEmail(true)"
          @input="() => validateEmail(false)"
        />
        <div v-if="errors.email" class="text-danger form-error">
          <span aria-hidden="true">&#9888;</span> {{ errors.email }}
        </div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          class="form-control"
          @blur="() => validatePassword(true)"
          @input="() => validatePassword(false)"
        />
        <div v-if="errors.password" class="text-danger form-error">
          <span aria-hidden="true">&#9888;</span> {{ errors.password }}
        </div>
      </div>

      <button type="submit" class="btn btn-success">Create account</button>
    </form>
  </div>
</template>
