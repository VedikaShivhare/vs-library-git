<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const auth = getAuth()
const router = useRouter()
const currentUser = ref(auth.currentUser)
const roles = {
  'vedika@gmail.com': 'Admin',
  'admin.fit5032@example.com': 'Admin',
  'member.fit5032@example.com': 'Member'
}
const userRole = computed(() => roles[currentUser.value?.email] || 'Member')
const unsubscribe = onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

onUnmounted(unsubscribe)

const logout = () => {
  signOut(auth)
    .then(() => {
      console.log('Firebase Sign out Successful!')
      console.log(auth.currentUser) // To check the current user after logout
      router.push('/FireLogin')
    })
    .catch((error) => {
      console.log(error.code)
    })
}

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton'
})

const submittedCards = ref([])
const errors = ref({
  username: null,
  password: null,
  confirmPassword: null
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialCharacter) {
    if (blur) errors.value.password = 'Password must contain uppercase, lowercase, number and special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton'
  }
  errors.value = { username: null, password: null, confirmPassword: null }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)

  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword) {
    submittedCards.value.push({ ...formData.value })
    clearForm()
  }
}
</script>

<template>
  <div class="container mt-5">
    <div v-if="currentUser" class="text-center mb-4">
      <h2>{{ userRole }} account</h2>
      <p>Signed in as {{ currentUser.email }}</p>
      <button class="btn btn-danger" @click="logout">Log out</button>
    </div>

    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1>🗄️ W5. Library Registration Form</h1>
        <p class="text-center">Let's build some more advanced features into our form.</p>

        <form @submit.prevent="submitForm">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select id="gender" v-model="formData.gender" class="form-select" required>
                <option value="">Select a gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-control"
                @blur="() => validatePassword(true)"
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
            <div class="col-md-6 col-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                id="confirm-password"
                v-model="formData.confirmPassword"
                type="password"
                class="form-control"
                @blur="() => validateConfirmPassword(true)"
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <div class="mb-3 form-check">
            <input id="isAustralian" v-model="formData.isAustralian" type="checkbox" class="form-check-input" />
            <label for="isAustralian" class="form-check-label">Australian Resident?</label>
          </div>

          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea id="reason" v-model="formData.reason" class="form-control" rows="3"></textarea>
          </div>

          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>
            <input id="suburb" :value="formData.suburb" type="text" class="form-control" />
          </div>

          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>

    <div class="row mt-5">
      <h4>This is a PrimeVue Datatable.</h4>
      <DataTable :value="submittedCards" table-style="min-width: 50rem">
        <Column field="username" header="Username" />
        <Column field="password" header="Password" />
        <Column field="isAustralian" header="Australian Resident" />
        <Column field="gender" header="Gender" />
        <Column field="reason" header="Reason" />
      </DataTable>
    </div>
  </div>
</template>
