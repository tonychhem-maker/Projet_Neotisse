import test from 'node:test'
import assert from 'node:assert/strict'
import { orderWorkshopFormats } from './workshopFormats.js'

test('formats sélectionnés en premier, nouveaux formats visibles ensuite, sans doublon', () => {
  const featured = [{ id: 'b', title: 'B' }, { id: 'hidden', title: 'Masqué', visible: false }]
  const all = [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }, { id: 'c', title: 'C' }, { id: 'hidden', title: 'Masqué', visible: false }]
  assert.deepEqual(orderWorkshopFormats(featured, all).map(item => item.id), ['b', 'a', 'c'])
  assert.deepEqual(orderWorkshopFormats([], all).map(item => item.id), ['a', 'b', 'c'])
})
