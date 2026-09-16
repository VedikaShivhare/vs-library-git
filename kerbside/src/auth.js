// BR (C.1): Shared authentication state.
// BR (C.2): Role-based authentication - the ROLES constant and each
// user's role field, checked against every restricted route.
//
// This follows the same idea taught in Week 5 (Step 6, "Creating a
// Secure Members Area") - the tutorial suggests keeping a global
// isAuthenticated value using Vue's ref() so that every component in
// the app can check whether someone is logged in, instead of each page
// tracking its own separate copy of that state. Here that same shared
// ref() also carries the account's role, so a route guard can check
// both "is this person logged in" and "which pages are they allowed to
// see" from one place.
//
// Because this ref() is created once here and imported everywhere else,
// every component that imports it shares the exact same reactive value.
// If LoginView.vue sets currentUser, NavBar.vue sees the change straight
// away without any extra wiring.
import { ref } from 'vue'

// BR (C.2): The three roles Kerbside supports. Written as named
// constants (rather than typing the strings 'resident', 'councilOfficer'
// and 'admin' directly wherever a role is checked) so a typo like
// 'residnet' becomes an error VS Code catches immediately, instead of a
// silent bug where a role check never matches.
export const ROLES = {
  RESIDENT: 'resident',
  COUNCIL_OFFICER: 'councilOfficer',
  ADMIN: 'admin',
}

// Holds the logged-in user's name, email and role, or null when nobody
// is logged in. Kept as a single object (rather than separate refs) so
// a component only needs to check one thing to know who is logged in
// and what they are allowed to see.
export const currentUser = ref(null)

// Reads the saved session back out of localStorage. This runs once,
// straight away, so that refreshing the page does not log the resident
// out - without this, closing and reopening the tab would lose the
// login even though the account itself is still saved.
const savedSession = localStorage.getItem('kerbsideSession')
if (savedSession) {
  currentUser.value = JSON.parse(savedSession)
}

// Called after a successful login or registration. Stores the user in
// both the shared ref (for the current page) and localStorage (so the
// session survives a page refresh).
export function logIn(user) {
  currentUser.value = user
  localStorage.setItem('kerbsideSession', JSON.stringify(user))
}

// Clears the session from both the shared ref and localStorage.
export function logOut() {
  currentUser.value = null
  localStorage.removeItem('kerbsideSession')
}

// Reads every registered account out of localStorage. Returns an empty
// array the first time the app runs, before anyone has registered yet.
// This is the same array-of-objects data structure used in the Week 4
// user information form (submittedCards), just persisted so it survives
// a page refresh instead of only living in memory.
export function loadUsers() {
  const stored = localStorage.getItem('kerbsideUsers')
  return stored ? JSON.parse(stored) : []
}

// Adds a new account to that same array and saves it back.
export function saveUser(user) {
  const users = loadUsers()
  users.push(user)
  localStorage.setItem('kerbsideUsers', JSON.stringify(users))
}
