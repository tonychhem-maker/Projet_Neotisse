import test from 'node:test'
import assert from 'node:assert/strict'
import { googlePageLocation, startGoogleAnalytics, stopGoogleAnalytics, trackGoogleAction, trackGooglePage } from './googleAnalytics.js'

test('les pages Google ne contiennent ni paramètres ni fragments', () => {
  assert.equal(googlePageLocation('/contact?email=secret#fragment', 'https://neotisse.fr'), 'https://neotisse.fr/contact')
  assert.equal(googlePageLocation('//external.test/path', 'https://neotisse.fr'), 'https://neotisse.fr/')
  assert.equal(googlePageLocation('/actualites/atelier', 'https://neotisse.fr'), 'https://neotisse.fr/actualites/atelier')
})

test('chargement unique, pages nettoyées et désactivation au retrait', () => {
  const scripts = []
  globalThis.window = { location: { origin: 'https://neotisse.fr' } }
  globalThis.document = { createElement: () => ({}), head: { appendChild: script => scripts.push(script) } }
  try {
    trackGooglePage('/contact')
    assert.equal(scripts.length, 0)
    startGoogleAnalytics('/contact?secret=1')
    startGoogleAnalytics('/contact')
    trackGooglePage('/contact?secret=1#fragment')
    assert.equal(scripts.length, 1)
    assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtm.js?id=GTM-5JC3FM5R')
    assert.equal(scripts[0].referrerPolicy, 'no-referrer')
    assert.equal(Object.prototype.toString.call(window.dataLayer.at(-1)), '[object Arguments]')
    assert.ok(!JSON.stringify(window.dataLayer).includes('secret'))
    assert.equal(window.dataLayer.at(-1)[2].page_location, 'https://neotisse.fr/contact')
    for (const kind of ['contact_click', 'contact_submit', 'testimonial_open', 'testimonial_submit', 'workshop_open', 'article_open']) {
      trackGoogleAction(kind, '/contact?secret=1#fragment')
      const event = window.dataLayer.at(-1)
      assert.equal(event[1], kind)
      assert.deepEqual(event[2], { send_to: 'G-4RSN12HQ8K', page_location: 'https://neotisse.fr/contact', page_referrer: '', page_title: 'Neotisse' })
    }
    const count = window.dataLayer.length
    trackGoogleAction('form_content', '/contact')
    assert.equal(window.dataLayer.length, count)
    assert.equal(stopGoogleAnalytics(), true)
    assert.equal(window['ga-disable-G-4RSN12HQ8K'], true)
    trackGoogleAction('contact_click', '/contact')
    assert.equal(window.dataLayer.length, count)
    assert.equal(stopGoogleAnalytics(), false)
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})
