<script setup>
// BR (C.3): Aggregated rating score.
//
// This page is open to every visitor, logged in or not (it carries no
// allowedRoles meta in router/index.js), so any resident can rate a
// posted item and see what everyone else thought of it, not just
// Council Officer and Admin accounts on the restricted dashboard.
//
// Two pieces of Week 2 Applied are used here:
//   - Step 2 ("Understand and Practice with Computed Properties"): a
//     computed() property recalculates itself whenever the data it
//     depends on changes, and is cached in between. averageRating(card)
//     below follows that same idea - it works out a card's average
//     straight from card.ratings, so as soon as addRating() pushes a
//     new star value into that array, the average shown on screen
//     updates on its own.
//   - Step 5 ("Attribute, Class and Style Bindings"): :class bound to
//     an object, e.g. :class="{ active: isActive }", toggles a CSS
//     class on or off based on a condition. Each star below uses this
//     same pattern to light itself up (class "star-filled") only when
//     its position is within the card's current average.
import { submittedCards, RATING_STARS, addRating } from '../listings.js'

// BR (C.3): Works out one card's average rating from its ratings array.
// Returns null when nobody has rated the item yet, so the template can
// show "No ratings yet" instead of a misleading 0-star average.
//
// This is a plain function rather than a Vue computed() property,
// because a computed() only tracks one value - here every card in
// submittedCards needs its own average, so this function is called once
// per card inside the v-for loop in the template instead. The maths
// itself (summing the array with reduce, then dividing by its length)
// is the same "derive one value from an array" idea Week 2 teaches
// through computed(), just applied per card rather than once globally.
function averageRating(card) {
  if (card.ratings.length === 0) {
    return null
  }
  const total = card.ratings.reduce((sum, stars) => sum + stars, 0)
  return total / card.ratings.length
}

// Rounds an average down to the nearest whole star so the template can
// decide which stars to draw filled in. Math.floor rather than
// Math.round, so a 3.9 average shows as 3 filled stars plus the exact
// figure written out next to it, rather than rounding up to a full 4
// stars that would overstate the score.
function filledStars(card) {
  const average = averageRating(card)
  return average === null ? 0 : Math.floor(average)
}
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-1">Browse items</h1>
    <p class="text-muted mb-4">
      Rate an item to help other residents know what to expect before they claim it.
    </p>

    <p v-if="submittedCards.length === 0" class="text-muted">
      No items have been posted yet this session.
    </p>

    <div v-else class="row g-3">
      <div v-for="(card, index) in submittedCards" :key="index" class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
          <div class="card-body">
            <h2 class="h5 card-title">{{ card.title }}</h2>
            <p class="card-text">{{ card.description }}</p>
            <p class="card-text text-muted mb-2">
              {{ card.category }} &middot; {{ card.suburb }} {{ card.postcode }}
            </p>

            <!-- BR (C.3): Star widget. Clicking a star rates the item; -->
            <!-- :class lights up every star up to the card's current -->
            <!-- average, same :class-object pattern as Week 2, Step 5. -->
            <div class="star-rating mb-1">
              <span
                v-for="star in RATING_STARS"
                :key="star"
                class="star"
                :class="{ 'star-filled': star <= filledStars(card) }"
                role="button"
                :aria-label="`Rate ${star} out of 5 stars`"
                @click="addRating(card, star)"
              >
                &#9733;
              </span>
            </div>

            <p class="card-text small text-muted">
              <span v-if="averageRating(card) === null">No ratings yet.</span>
              <span v-else>
                {{ averageRating(card).toFixed(1) }} out of 5
                ({{ card.ratings.length }} rating{{ card.ratings.length === 1 ? '' : 's' }})
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* BR (C.3): Plain CSS for the star widget - Bootstrap has no star-rating
component of its own, so this follows the same "write the small bit of
custom CSS Bootstrap doesn't cover" approach already used elsewhere in
this app (e.g. the hero section on HomeView.vue). */
.star-rating {
  font-size: 1.5rem;
}

.star {
  cursor: pointer;
  color: #ccc;
}

.star-filled {
  color: #f5a623;
}
</style>
