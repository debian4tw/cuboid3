"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParticleContactResolver = void 0;
class ParticleContactResolver {
    constructor(iterations) {
    }
    setIterations(iterations) {
        this.iterations = iterations;
    }
    resolveContacts(contactArray, numContacts, duration) {
        let i;
        let iterationsUsed = 0;
        while (iterationsUsed < this.iterations) {
            // Find the contact with the largest closing velocity;
            const REAL_MAX = 10000000;
            let max = REAL_MAX;
            let maxIndex = numContacts;
            for (i = 0; i < numContacts; i++) {
                let sepVel = contactArray[i].calculateSeparatingVelocity();
                if (sepVel < max && (sepVel < 0 || contactArray[i].penetration > 0)) {
                    max = sepVel;
                    maxIndex = i;
                }
            }
            // Do we have anything worth resolving?
            if (maxIndex == numContacts)
                break;
            // Resolve this contact
            contactArray[maxIndex].resolve(duration);
            // Update the interpenetrations for all particles
            /*
            wip
            let move: GVector3 = contactArray[maxIndex].particleMovement;
            for (i = 0; i < numContacts; i++) {
              if (contactArray[i].particles[0] == contactArray[maxIndex].particles[0]) {
                contactArray[i].penetration -= move[0] * contactArray[i].contactNormal;
              } else if (contactArray[i].particles[0] == contactArray[maxIndex].particles[1]) {
                contactArray[i].penetration -= move[1] * contactArray[i].contactNormal;
              }
              if (contactArray[i].particles[1]) {
                if (contactArray[i].particles[1] == contactArray[maxIndex].particles[0]) {
                  contactArray[i].penetration += move[0] * contactArray[i].contactNormal;
                } else if (contactArray[i].particles[1] == contactArray[maxIndex].particles[1]) {
                  contactArray[i].penetration += move[1] * contactArray[i].contactNormal;
                }
              }
            }
            */
            iterationsUsed++;
        }
    }
}
exports.ParticleContactResolver = ParticleContactResolver;
