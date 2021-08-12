import { GParticleContact } from './GParticleContact';
export declare class ParticleContactResolver {
    private iterations;
    constructor(iterations: number);
    setIterations(iterations: number): void;
    resolveContacts(contactArray: [GParticleContact], numContacts: number, duration: number): void;
}
