import * as GMath from '../math/GMath'

describe('DotProduct', function() {

  it('should be 0 with orthogonal vectors', function() {
    let m1 = new GMath.GVector2(1,0)
    let m2 = new GMath.GVector2(0,1)
    let result = m1.dotProduct(m2)
    expect(result).toBe(0)
  })

})



