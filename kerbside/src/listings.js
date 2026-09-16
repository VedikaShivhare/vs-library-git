// BR (C.2): Shared in-memory list of posted items.
//
// This ref() used to live only inside PostItemView.vue. It has been
// moved here, unchanged, so that the new Council Officer dashboard can
// read the same list. This is a structural move only, not a change in
// behaviour - the list still lives purely in memory and is not saved to
// localStorage, so it still empties on a page refresh exactly as it did
// before (matching BR B.2 as originally built).
//
// Because this ref() is created once here and imported by both
// PostItemView.vue and CouncilDashboardView.vue, both pages see the
// exact same reactive array - the same sharing pattern already used for
// currentUser in auth.js.
import { ref } from 'vue'

export const submittedCards = ref([])

// BR (C.3): Aggregated rating score.
//
// The five possible star values a resident can give an item. Written as
// a named array (rather than looping 1 to 5 inline wherever stars are
// drawn) so the star widget in BrowseItemsView.vue can just v-for over
// this list, the same v-for-over-an-array approach taught in Week 2
// (Step 3, "v-for directive") for rendering a row per array element.
export const RATING_STARS = [1, 2, 3, 4, 5]

// Adds one rating to a card. Each card holds its own ratings array (set
// up as an empty array when the card is created in PostItemView.vue),
// and rating an item just pushes the chosen star value into that array
// - the same array.push() pattern already used to add a whole card to
// submittedCards, just pushing a single number instead of an object.
//
// Every resident's rating is kept, not just the latest one, because the
// BR asks for an aggregated score "from all users" - averaging the
// whole array is what makes the score reflect every resident who rated
// the item, not only whoever clicked most recently.
export function addRating(card, stars) {
  card.ratings.push(stars)
}
