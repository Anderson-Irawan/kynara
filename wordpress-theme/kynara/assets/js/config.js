/* ==========================================================================
   KYNARA site config: the easy-to-edit bits live here.
   ========================================================================== */
window.KYNARA_CONFIG = {
  /* Hero headline on Home + The Brand.
     "Crafted for Harmonious ___": the prefix/suffix stay static, the word list rolls up.
     Add, remove or reorder words freely. The first word is the one shown on load.
     This headline is a brand line: it stays English in BOTH languages, so there is
     one list and the hero does not reflow when the language changes. */
  heroRoller: {
    interval: 2600,   // ms each word stays on screen
    duration: 490,    // ms the roll-up movement takes
    prefix: 'Crafted for <em>Harmonious</em>',
    suffix: '',
    words: ['Living', 'Working', 'Dining', 'Playing', 'Meetings', 'Sleeping']
  },

  /* Contact form. Leave endpoint empty to fall back to opening the visitor's email app
     (note: attachments cannot be carried over by the email-app fallback).
     Set endpoint to a form service URL (e.g. Formspree / Netlify Forms / your own PHP)
     to post the form, including the attached file, directly. */
  contact: {
    endpoint: '',
    email: 'enquiries@kynara.co.id'
  },

  /* Newsletter form. Same idea as above: set an endpoint (e.g. Mailchimp / Brevo embed URL). */
  subscribe: {
    endpoint: ''
  }
};
