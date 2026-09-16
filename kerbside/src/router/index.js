import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostItemView from '../views/PostItemView.vue'
import RegisterView from '../views/RegisterView.vue'
import LoginView from '../views/LoginView.vue'
import AccessDeniedView from '../views/AccessDeniedView.vue'
import CouncilDashboardView from '../views/CouncilDashboardView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'
import { currentUser, ROLES } from '../auth.js'

// Only routes with a built page are listed here.
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/post',
      name: 'post',
      component: PostItemView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/access-denied',
      name: 'access-denied',
      component: AccessDeniedView,
    },
    // BR (C.2): Restricted routes carry an allowedRoles list on their meta
    // field. meta is exactly what Week 5 Applied's Navigation Guards
    // section (Step 6) uses to attach extra information to a route so a
    // guard can read it back on to.meta - the tutorial's own example
    // attaches a requiresAuth flag the same way, this just attaches a
    // list of roles instead of a single true/false flag.
    {
      path: '/council-dashboard',
      name: 'council-dashboard',
      component: CouncilDashboardView,
      meta: { allowedRoles: [ROLES.COUNCIL_OFFICER, ROLES.ADMIN] },
    },
    {
      path: '/admin/users',
      name: 'admin-users',
      component: AdminUsersView,
      meta: { allowedRoles: [ROLES.ADMIN] },
    },
  ],
})

// BR (C.2): Global navigation guard - runs before every route change.
// This is the "Global Guards" pattern from Week 5 Applied's Navigation
// Guards documentation (Step 6): router.beforeEach((to, from, next) => {...})
// runs before Vue Router actually switches the page, and next() decides
// whether that switch is allowed to happen, blocked, or redirected
// somewhere else instead.
//
// The tutorial's own Activity 6.1 ("Creating a Secure Members Area")
// guards a page using only to.meta.requiresAuth against a single
// isAuthenticated flag - logged in or not logged in, nothing in between.
// This app needs more than that: three different roles that each unlock
// different pages, not just one members-only area. So this guard reads a
// list of allowed roles off to.meta.allowedRoles (set per-route above)
// and checks it against the signed-in account's own role from auth.js,
// rather than only checking whether someone is logged in at all. The
// beforeEach mechanism itself - reading to.meta and calling next() - is
// exactly what Week 5 teaches; checking a specific role against a list
// of allowed roles is this app's own extension of that same mechanism,
// built to fit a three-role app instead of a single members-only area.
router.beforeEach((to, from, next) => {
  const allowedRoles = to.meta.allowedRoles

  // Routes with no allowedRoles list (Home, Post an Item, Login,
  // Register, Access Denied) are open to everyone, logged in or not.
  if (!allowedRoles) {
    next()
    return
  }

  const role = currentUser.value?.role

  if (role && allowedRoles.includes(role)) {
    // Logged in, and their role is on the list for this page.
    next()
  } else {
    // Either not logged in, or logged in with a role that is not allowed
    // on this page - send them to the Access Denied page instead of
    // letting the restricted page load.
    next('/access-denied')
  }
})

export default router
