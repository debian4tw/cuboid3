export class GMatrix3 {

  data: Array<number>

  constructor() {

  }

  multiplyMatrix(m: GMatrix3) {
    return [
      this.data[0] * m.data[0] + this.data[1] * m.data[3] + this.data[2] * m.data[6], 
      this.data[0] * m.data[1] + this.data[1] * m.data[4] + this.data[2] * m.data[7], 
      this.data[0] * m.data[2] + this.data[1] * m.data[5] + this.data[2] * m.data[8],
      this.data[3] * m.data[0] + this.data[4] * m.data[3] + this.data[5] * m.data[6], 
      this.data[3] * m.data[1] + this.data[4] * m.data[4] + this.data[5] * m.data[7],
      this.data[3] * m.data[2] + this.data[4] * m.data[5] + this.data[5] * m.data[8],
      this.data[6] * m.data[0] + this.data[7] * m.data[3] + this.data[8] * m.data[6],
      this.data[6] * m.data[1] + this.data[7] * m.data[4] + this.data[8] * m.data[7], 
      this.data[6] * m.data[2] + this.data[7] * m.data[5] + this.data[8] * m.data[8] 
    ]
  }

  setInverse(m: GMatrix3) {
    const t1 = m.data[0]*m.data[4];
    const t2 = m.data[0]*m.data[5];
    const t3 = m.data[1]*m.data[3];
    const t4 = m.data[2]*m.data[3];
    const t5 = m.data[1]*m.data[6];
    const t6 = m.data[2]*m.data[6];

    // Calculate the determinant.
    const det = (t1*m.data[8] - t2*m.data[7] - t3*m.data[8]+ t4*m.data[7] + t5*m.data[5] - t6*m.data[4]);
    // Make sure the determinant is non-zero. 
    if (det == 0) {
      return;
    }
    const invd = 1/det;

    this.data[0] = (m.data[4]*m.data[8]-m.data[5]*m.data[7])*invd; 
    this.data[1] = -(m.data[1]*m.data[8]-m.data[2]*m.data[7])*invd; 
    this.data[2] = (m.data[1]*m.data[5]-m.data[2]*m.data[4])*invd;
    this.data[3] = -(m.data[3]*m.data[8]-m.data[5]*m.data[6])*invd;
    this.data[4] = (m.data[0]*m.data[8]-t6)*invd;
    this.data[5] = -(t2-t4)*invd;
    this.data[6] = (m.data[3]*m.data[7]-m.data[4]*m.data[6])*invd;
    this.data[7] = -(m.data[0]*m.data[7]-t5)*invd;
    this.data[8] = (t1-t3)*invd;
  }
}