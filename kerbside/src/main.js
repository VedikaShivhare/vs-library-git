// BR (C.4): Security - Cross-site Scripting (XSS) protection.
//
// Lecture 4 ("Vulnerable Web") lists Cross-site Scripting (XSS) as one
// of the common weaknesses a web app needs to defend against, and
// specifically names how Vue prevents script injection: through how it
// renders HTML Content and Dynamic Attribute Binding.
//
// Kerbside collects free-text input from residents in several places -
// item titles and descriptions on Post an Item, a resident's own name
// on Register, and star ratings on Browse Items. If any of that text
// were ever rendered as raw HTML, a resident could type something like
// <script>...</script> into a title and have it run in every other
// resident's browser when they viewed that listing. Kerbside avoids
// this everywhere, in two ways that match what Lecture 4 covers:
//
//   1. HTML Content: every place user-submitted text is shown on
//      screen (item titles and descriptions on BrowseItemsView.vue and
//      CouncilDashboardView.vue, resident names on AdminUsersView.vue
//      and in the navbar's "Hi, {{ currentUser.name }}") uses Vue's
//      standard {{ }} text interpolation. Vue escapes this
//      automatically - a title containing <script> is displayed as the
//      literal text "<script>", not executed as a tag. This app never
//      uses Vue's v-html directive anywhere, which is the one feature
//      that would render raw HTML and switch this protection off.
//   2. Dynamic Attribute Binding: this app does not build any HTML
//      attribute (such as a link's href or an image's src) out of
//      resident-typed text, so there is no dynamic attribute for a
//      resident to inject a javascript: URL or similar into.
import { createApp } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

const app = createApp(App)
app.use(router)
app.mount('#app')
