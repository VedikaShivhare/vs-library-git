<script setup>
// BR (C.1): Basic authentication - login half.
//
// This follows the login page described in Week 5 (Step 6, Activity
// 6.1, "Creating a Secure Members Area in Your Library App"): a
// username/password form using v-model, and a method that checks those
// details and stores whether the resident is logged in. The tutorial's
// version checks against one hardcoded username and password - this
// version checks against every account created through the Register
// page, using the same users array from localStorage.
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadUsers, logIn, hashPassword } from '../auth.js'

const router = useRouter()

const formData = ref({
  email: '',
  password: '',
})

// One error slot per field, plus a formError slot for a problem that is
// not tied to a single field (wrong email/password combination).
const errors = ref({
  email: null,
  password: null,
})
const formError = ref(null)

function validateEmail(blur) {
  const value = formData.value.email.trim()
  if (value === '') {
    if (blur) errors.value.email = 'Email is required.'
  } else {
    errors.value.email = null
  }
}

function validatePassword(blur) {
  const value = formData.value.password
  if (value === '') {
    if (blur) errors.value.password = 'Password is required.'
  } else {
    errors.value.password = null
  }
}

async function submitForm() {
  validateEmail(true)
  validatePassword(true)
  formError.value = null

  const hasErrors = Object.values(errors.value).some((message) => message !== null)
  if (hasErrors) {
    return
  }

  // BR (C.1): Check the entered details against every account in the
  // users array. find() looks through the array (the same underlying
  // data structure the registration form writes into) and returns the
  // first matching account, or undefined if nothing matches.
  // BR (C.4): The entered password is hashed with the same
  // hashPassword() function Register uses, and the comparison below
  // checks that hash against the stored passwordHash - the account's
  // actual password is never held in a variable here for longer than
  // it takes to hash it.
  const email = formData.value.email.trim()
  const passwordHash = await hashPassword(formData.value.password)
  const matchedUser = loadUsers().find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.passwordHash === passwordHash,
  )

  if (!matchedUser) {
    // One shared message rather than saying which field was wrong, so a
    // guess at someone else's email can't be used to check whether that
    // email is registered.
    formError.value = 'Email or password is incorrect.'
    return
  }

  logIn(matchedUser)
  router.push('/')
}
</script>

<template>
  <div class="container py-4" style="max-width: 480px">
    <h1 class="h3 mb-4">Log in</h1>

    <div v-if="formError" class="alert alert-danger" role="alert">
      {{ formError }}
    </div>

    <form novalidate @submit.prevent="submitForm">
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

      <button type="submit" class="btn btn-success">Log in</button>

      <p class="mt-3 mb-0">
        Don't have an account?
        <router-link to="/register">Register</router-link>
      </p>
    </form>
  </div>
</template>
