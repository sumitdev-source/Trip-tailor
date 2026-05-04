// "export" → makes this variable available to use in other files
// "const" → value cannot be reassigned
export const SelectTravelesList = [

  // This is an ARRAY (list) of OBJECTS
  // Each object represents one option (UI card / selection item)

  {
    id: 1, // Unique identifier (used for keys in React, selection logic, etc.)

    title: 'Just me', // Title shown in UI

    desc: 'A sole traveles in exploration', 
    // Description text (small subtitle in UI)

    icon: '✈️', 
    // Emoji icon (UI display, not logic)

    people: '1 People' 
    // Extra label (can be shown or used in logic later)
  },

  {
    id: 2,
    title: 'A couple',
    desc: 'Two traveles in tandem',
    icon: '🥂',
    people: '2 People'
  },

  {
    id: 3,
    title: 'Family',
    desc: 'A group of fun loving adventure',
    icon: '🏡',
    people: '3 to 5 People'
  },

  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekes',
    icon: '⛵',
    people: '5 to 10 People'
  }

];
// So overall → this is just a LIST of travel types
// Used to render options dynamically instead of hardcoding UI

// Another exported constant
export const SelectBudgetOptions = [

  // Same concept → array of objects

  {
    id: 1,
    title: 'Cheap', // Budget category name

    desc: 'Stay conscious of costs', 
    // Description for user understanding

    icon: '💵', // Emoji for UI
  },

  {
    id: 2,
    title: 'Moderate',
    desc: 'Keep cost on the average side',
    icon: '💰',
  },

  {
    id: 3,
    title: 'Luxury',
    desc: 'Don\'t worry about cost',
    // Escape character (\') used because of apostrophe

    icon: '💸',
  }

];
// This is used to show budget selection options in UI

// This is NOT AI yet — it's just a TEMPLATE STRING
export const AI_PROMPT = 'Generate Travel Plan for Location : {location}';

// {location} → placeholder
// Later your code will REPLACE this with actual value