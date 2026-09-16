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
