<script setup>
// BR (C.1): Basic authentication - registration half.
//
// This page follows the same form-plus-validation pattern taught in
// Week 4 (Activity 3, "Add Form Validation using Vue"): a formData ref
// holding the field values, an errors ref holding one error slot per
// field, and a validateX(blur) function per field that either sets or
// clears that field's error message.
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadUsers, saveUser, logIn } from '../auth.js'

const router = useRouter()

// formData holds what the resident has typed so far. Matches the
// object-of-fields shape used for formData in the Week 4 user
// information form.
const formData = ref({
  name: '',
  email: '',
  password: '',
})

// errors holds one message per field, starting at null (meaning "no
// error yet"), exactly like the errors ref in Week 4.
const errors = ref({
  name: null,
  email: null,
  password: null,
})

// Set to true once registration succeeds, so the template can swap the
// form out for a short confirmation message instead of just vanishing.
const justRegistered = ref(false)

// BR (C.1): Name must be at least 2 characters. Same shape as the
// validateName function from Week 4, just with a different minimum
// length since a real name is usually shorter than an item title.
function validateName(blur) {
  const value = formData.value.name.trim()
  if (value.length < 2) {
    if (blur) errors.value.name = 'Name must be at least 2 characters.'
  } else {
    errors.value.name = null
  }
}

// BR (C.1): Email is required and must contain an @ symbol followed by
// a domain. It also has to be unique, since two accounts sharing one
// email would make it impossible to tell which account belongs to
// which resident when logging in.
function validateEmail(blur) {
  const value = formData.value.email.trim()
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const alreadyRegistered = loadUsers().some(
    (user) => user.email.toLowerCase() === value.toLowerCase(),
  )
  if (value === '') {
    if (blur) errors.value.email = 'Email is required.'
  } else if (!looksLikeEmail) {
    if (blur) errors.value.email = 'Please enter a valid email address.'
  } else if (alreadyRegistered) {
    if (blur) errors.value.email = 'An account with this email already exists.'
  } else {
    errors.value.email = null
  }
}

// BR (C.1): Password must be at least 8 characters, contain an
// uppercase letter, a lowercase letter and a number. This follows the
// same set of checks as the validatePassword function in Week 4
// (Activity 3.7), minus the special-character rule, since that rule
// tends to frustrate residents on what is meant to be a simple
// community listing app rather than a banking system.
function validatePassword(blur) {
  const value = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(value)
  const hasLowercase = /[a-z]/.test(value)
  const hasNumber = /\d/.test(value)

  if (value.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else {
    errors.value.password = null
  }
}

function submitForm() {
  // Run every validator with blur = true so all errors show at once,
  // the same approach used in the Week 4 submitForm function.
  validateName(true)
  validateEmail(true)
  validatePassword(true)

  const hasErrors = Object.values(errors.value).some((message) => message !== null)
  if (hasErrors) {
    return
  }

  // BR (C.1): Save the new account into the users array in localStorage
  // so it is still there the next time the resident visits. Storing the
  // password as plain text is a known limitation of a client-side-only
  // app with no server to hash it against - there is no database here,
  // just the browser's own storage.
  const newUser = {
    name: formData.value.name.trim(),
    email: formData.value.email.trim(),
    password: formData.value.password,
  }
  saveUser(newUser)

  // Log the resident straight in after registering, rather than making
  // them fill out the login form again with the details they only just
  // typed. This is what keeps the experience seamless.
  logIn(newUser)
  justRegistered.value = true

  setTimeout(() => {
    router.push('/')
  }, 1500)
}
</script>

<template>
  <div class="container py-4" style="max-width: 480px">
    <h1 class="h3 mb-4">Create an account</h1>

    <div v-if="justRegistered" class="alert alert-success" role="alert">
      Account created for {{ formData.name }}. Taking you to the home page&hellip;
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

      <p class="mt-3 mb-0">
        Already have an account?
        <router-link to="/login">Log in</router-link>
      </p>
    </form>
  </div>
</template>
