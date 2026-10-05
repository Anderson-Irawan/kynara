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

  /* Contact form: name, company, email, message (no file upload). Leave endpoint empty to
     fall back to opening the visitor's email app; set it to a form service URL (e.g.
     Formspree / Netlify Forms / your own PHP) to post the form directly. */
  contact: {
    /* EmailJS (emailjs.com): paste the three IDs from your EmailJS dashboard and the form
       sends through it - see "Forms" in CLAUDE.md for the setup steps. Leave them empty to
       use endpoint below instead, or, with both empty, the visitor's email app. */
    emailjs: {
      serviceId: 'service_kynara',    // Email Services -> your service, e.g. 'service_ab12cd3'
      templateId: 'template_kynara-enquire',   // Email Templates -> your template, e.g. 'template_xy98zw7'
      publicKey: 'xTCYns-tkTwus0yWX'     // Account -> General -> Public Key
    },
    endpoint: '',
    email: 'enquiries@kynara.id'
  },

  /* Newsletter form. Same idea as above: set an endpoint (e.g. Mailchimp / Brevo embed URL). */
  subscribe: {
    endpoint: ''
  }
};
