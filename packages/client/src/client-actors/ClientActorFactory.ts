import {Actor} from '@cubic-eng/core'
import {IActor} from '@cubic-eng/core'
import {Actor3} from '@cubic-eng/core'
import {ClientActorType} from '@cubic-eng/core'
import {
  ClientMultipleActor,
  ClientSingleActor,
  ClientSingleCenteredActor,
  ClientSingleTranslatedActor,
} from '.'
import { IClientActor } from './IClientActor';
export class ClientActorFactory {

  cliActors: Map<ClientActorType, IClientActor>

  static createClientActorType(actor: IActor): IClientActor {
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

  static registerClientActorType(label: ClientActorType, cliActor: IClientActor) {

  }
}