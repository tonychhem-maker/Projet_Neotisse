import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestimonialHandler } from '../api/submit-testimonial.js'

function response() {
  return {
    statusCode: 200,
    headers: {},
    setHeader(name, value) { this.headers[name] = value },
    end(body) { this.body = body ? JSON.parse(body) : null },
  }
}

test('le serveur utilise son token et crée un avis en attente de modération', async () => {
  const previous = process.env.SANITY_WRITE_TOKEN
  process.env.SANITY_WRITE_TOKEN = 'token-test-prive'
  try {
    let config, document
    const handler = createTestimonialHandler(options => {
      config = options
      return { async create(value) { document = value } }
    })
    const res = response()
    await handler({ method: 'POST', headers: { origin: 'https://neotisse.vercel.app' }, body: { author: 'Test', message: 'Un message de test.' } }, res)
    assert.equal(res.statusCode, 200)
    assert.equal(config.token, 'token-test-prive')
    assert.equal(config.useCdn, false)
    assert.equal(document.status, 'pending')
    assert.equal(document._type, 'testimonial')
    assert.equal(res.headers['Access-Control-Allow-Origin'], 'https://neotisse.vercel.app')
    assert.deepEqual(res.body, { ok: true })
  } finally {
    if (previous === undefined) delete process.env.SANITY_WRITE_TOKEN
    else process.env.SANITY_WRITE_TOKEN = previous
  }
})

test('les entrées invalides ne créent pas de document', async () => {
  const previous = process.env.SANITY_WRITE_TOKEN
  process.env.SANITY_WRITE_TOKEN = 'token-test-prive'
  try {
    const handler = createTestimonialHandler(() => { throw new Error('ne doit pas être appelé') })
    for (const body of [null, [], { author: 'Test', message: 'court' }]) {
      const res = response()
      await handler({ method: 'POST', headers: {}, body }, res)
      assert.ok([400, 422].includes(res.statusCode))
    }
  } finally {
    if (previous === undefined) delete process.env.SANITY_WRITE_TOKEN
    else process.env.SANITY_WRITE_TOKEN = previous
  }
})

test('les erreurs Sanity ne sont pas exposées aux visiteurs', async () => {
  const previous = process.env.SANITY_WRITE_TOKEN
  process.env.SANITY_WRITE_TOKEN = 'token-test-prive'
  try {
    const handler = createTestimonialHandler(() => ({ create: async () => { throw Object.assign(new Error('détail privé'), { statusCode: 403 }) } }))
    const res = response()
    await handler({ method: 'POST', headers: {}, body: { author: 'Test', message: 'Un message de test.' } }, res)
    assert.equal(res.statusCode, 502)
    assert.deepEqual(res.body, { error: 'Écriture Sanity impossible' })
  } finally {
    if (previous === undefined) delete process.env.SANITY_WRITE_TOKEN
    else process.env.SANITY_WRITE_TOKEN = previous
  }
})
