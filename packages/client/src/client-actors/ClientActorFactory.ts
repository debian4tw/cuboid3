import {Actor} from '@cuboid3/core'
import {IActor} from '@cuboid3/core'
import {Actor3} from '@cuboid3/core'
import {ClientActorType} from '@cuboid3/core'
import {
  ClientActor,
  ClientMultipleActor,
  ClientSingleActor,
  ClientSingleCenteredActor,
  ClientSingleTranslatedActor,
} from '.'
import { IClientActor, IClientActorConstructor } from './IClientActor';
export class ClientActorFactory {

  cliActors: Map<ClientActorType, IClientActorConstructor>

  constructor(clientDefs: any[]) {
    this.cliActors = new Map()
    clientDefs.forEach((cliDef) => {
      cliDef.clientActors?.forEach((cliAct: any) => {
        this.registerClientActorType(cliAct.label, cliAct.cliActor)
      })
    })
  }

  createClientActorType(actor: IActor): IClientActor {
    //console.log("creating ClientActorType", actor.getClientActorType())
    if (this.cliActors.get(actor.getClientActorType())) {
      //console.log(actor.name, "CLiActorType found on map", actor.getClientActorType())
      const clientActorConstructor = this.cliActors.get(actor.getClientActorType())
      //console.log("Constructor", clientActorConstructor)
      if (clientActorConstructor) {
        //console.log("Returning cliActorConstructor")
        return new clientActorConstructor(actor as Actor)
      }
    } else {
      // console.log(actor.getClientActorType(), "not found on map")
      switch(actor.getClientActorType()) {
        case ClientActorType.ClientMultipleActor:
          return new ClientMultipleActor(actor as Actor)
  
        case ClientActorType.ClientSingleCenteredActor:
          return new ClientSingleCenteredActor(actor)
  
        case ClientActorType.ClientSingleTranslatedActor:
          return new ClientSingleTranslatedActor(actor)
  
        default:
          return new ClientSingleActor(actor)
      }
    }
    return new ClientSingleActor(actor)
  }

  registerClientActorType(label: ClientActorType, cliActor: IClientActorConstructor) {
    this.cliActors.set(label, cliActor)
  }
}