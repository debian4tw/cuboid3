import { Game } from "@cuboid3/core";
export class PublicGamesManager {
  private games: Game[]
  private maxPlayers =  4

  constructor() {
    this.games = []
  }

  join() {
    //
  }

  getNextAvailableGame() : Game | undefined {
    return this.games.find((game) => game.getPlayersAmount() < this.maxPlayers)
  }

  addGame(game: Game) {
    // tslint:disable-next-line:no-console
    console.log("adding public game v2", game.getId())
    this.games.push(game)
    game.startScenarioSwitchLoop()
    //console.log("force set scenario 7")
    //game.setScenario(7)
  }

  removeGame(gameId: string) {
    this.games = this.games.filter(game => game.getId() !== gameId)
  }
}