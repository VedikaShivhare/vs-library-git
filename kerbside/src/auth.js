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

// BR (C.4): Client-side security.
//
// Lecture 4 ("Vulnerable Web") lists Data Accuracy, Security and User
// Experience as the reasons a web app needs validation, and separately
// covers the common weaknesses a web app should defend against,
// including attacks that rely on a site storing readable secrets. A
// password sitting in localStorage as plain text is exactly that kind
// of readable secret - anyone with access to the browser's storage
// (e.g. through the DevTools Application tab) could read every
// resident's actual password straight off the page.
//
// Kerbside has no backend server to hash passwords against, so this
// hashes them on the client instead, using the Web Crypto API that
// every modern browser already provides built in (no extra package to
// install). SHA-256 turns a password into a fixed-length string of
// letters and numbers that cannot practically be reversed back into the
// original password. A short, fixed "pepper" string is mixed in before
// hashing (the same salting idea recommended for this assignment) so
// that even two residents who pick the exact same password end up with
// different-looking stored values.
//
// This is still a client-side-only app - a real production system would
// also need a server doing this hashing with a unique salt per user,
// which is why the assignment treats server-side hashing as optional
// here. What this function adds is the client-side half of that same
// best practice: Kerbside never writes a resident's actual password
// into localStorage, only this hash of it.
const PASSWORD_PEPPER = 'kerbside-fit5032-a1.3'

export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(PASSWORD_PEPPER + password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashBytes = Array.from(new Uint8Array(hashBuffer))
  return hashBytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

// BR (C.4): Reads the saved session back out of localStorage, the same
// way loadUsers() below reads the accounts array. Wrapped in try/catch
// so that if this value is ever missing, corrupted, or edited by hand
// into something that is not valid JSON, JSON.parse's error is caught
// here instead of stopping the whole app from loading. Treating that
// case the same as "nobody is logged in" is the safe default - a
// resident who hits this is simply asked to log in again, rather than
// seeing a blank broken page.
try {
  const savedSession = localStorage.getItem('kerbsideSession')
  if (savedSession) {
    currentUser.value = JSON.parse(savedSession)
  }
} catch {
  currentUser.value = null
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
//
// BR (C.4): Wrapped in try/catch for the same reason as the session
// read above - if kerbsideUsers is ever corrupted, this falls back to
// an empty array instead of crashing every page that calls loadUsers()
// (Login, Register, and the Admin Manage Users page all depend on it).
export function loadUsers() {
  try {
    const stored = localStorage.getItem('kerbsideUsers')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

// Adds a new account to that same array and saves it back.
export function saveUser(user) {
  const users = loadUsers()
  users.push(user)
  localStorage.setItem('kerbsideUsers', JSON.stringify(users))
}
