// Public-site analytics. Off until the owner fills this in AND rewrites the
// privacy page. build-www.mjs refuses to emit a third-party script while the
// privacy page still says third-party analytics is not loaded.
//
// provider: "none" or "plausible" (cookieless counter). No other provider is wired.
// siteId: Plausible data-domain, for example "finanpivot.com".
// respectDoNotTrack: when true, the local hook records nothing if the browser
// sends Do Not Track.
//
// The local hook always exists so clicks on inquiry actions can be counted
// later. It keeps an in-memory queue of { name, path }. It does not read the
// inquiry text, does not set a cookie, and does not send anything while
// enabled is false.

export const analytics = {
  enabled: false,
  provider: "none",
  siteId: "",
  respectDoNotTrack: true,
};
