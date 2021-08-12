import {EventHandler} from '@cuboid3/core'

describe('only one instance', function() {
  let handler1 = EventHandler
  let handler2 = EventHandler
  it('handlers should match', function() {
    expect(handler1).toEqual(handler2)
  });
});

describe('pub-sub', function() {
  let b = 2
  let c = 10
  let d = 3
  let f = {num: 3}
  let h = 0;
  EventHandler.subscribe('sum', (c: any, d: any, f: any) => {
    f.num =  c * d
  })
  EventHandler.publish('sum', c, d, f);

  it('number should be added by event', function() {
    let h = f.num
    expect(h).toEqual(30)
  });
});

