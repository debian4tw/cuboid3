import { SpawnLocationManager} from '../scenario/SpawnLocation.manager'
import { ISpawnLocationDef } from '../scenario/ISpawnLocationManager'
import { Axis } from '@cuboid3/g-physics'

import {spawnLocations} from '../scenario/SpawnLocations'

describe('SpawnLocationManager test', function() {

  const manager = new SpawnLocationManager(spawnLocations)
  const slotsAmount = spawnLocations.length


  it('all slots should be free', function() {
    const freeSlots = manager.getSlots().filter(slot => slot.busy === false)
    expect(freeSlots.length).toBe(slotsAmount)
  })

  it('one slot should be busy', function() {
    manager.getNextAvailable()
    const freeSlots = manager.getSlots().filter(slot => slot.busy === false)
    expect(freeSlots.length).toBe(slotsAmount-1)
  })

  it('two slots should be busy', function() {
    manager.getNextAvailable()
    const freeSlots = manager.getSlots().filter(slot => slot.busy === false)
    expect(freeSlots.length).toBe(slotsAmount-2)
  })
})


describe('SpawnLocationManager test with all busy slots', function() {

  const manager = new SpawnLocationManager(spawnLocations)
  const slotsAmount = spawnLocations.length
  manager.getNextAvailable()
  manager.getNextAvailable()
  manager.getNextAvailable()
  manager.getNextAvailable()
  manager.getNextAvailable()
  manager.getNextAvailable()
  manager.getNextAvailable()

  it('all slots should be busy', function() {
    const freeSlots = manager.getSlots().filter(slot => slot.busy === false)
    expect(freeSlots.length).toBe(0)
  })

  it('should return a slot, even all are busy', function() {
    const location = manager.getNextAvailable()
    expect(location).toHaveProperty("loc")
    expect(location).toHaveProperty("rot")
  })


  it('slots should be busy after 3s', async () => {
    await new Promise(res => setTimeout(() => {
      const freeSlots = manager.getSlots().filter(slot => slot.busy === false)
      console.log("freeSlots 3s", freeSlots)
      expect(freeSlots.length).toBe(0)
      res()
    }, 3 * 1000))
  },3 * 1000)


  it('slots should stop being busy after 8s', async () => {
    await new Promise(res => setTimeout(() => {
      const freeSlots = manager.getSlots().filter(slot => slot.busy === false)
      console.log("freeSlots 8s", freeSlots)
      expect(freeSlots.length).toBe(slotsAmount)
      res()
    }, 10 * 1000))
  },10 * 1000)
})