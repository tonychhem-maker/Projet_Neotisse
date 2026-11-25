import assert from 'node:assert/strict'
import { test } from 'node:test'
import { actionLabel } from './actionLabel.js'

test('les libellés commencent par une majuscule sans perdre leur casse interne', () => {
  assert.equal(actionLabel('organiser votre atelier'), 'Organiser votre atelier')
  assert.equal(actionLabel('CONTACTEZ-NOUS'), 'Contactez-nous')
  assert.equal(actionLabel('découvrir Neotisse'), 'Découvrir Neotisse')
  assert.equal(actionLabel('ÉCRIRE UN MOT'), 'Écrire un mot')
  assert.equal(actionLabel(''), '')
})
