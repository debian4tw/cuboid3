export class Player {

  private id: string
  socketId: string
  lives: number
  initialLives: number
  name: string
  color: any
  score: number
  kills: number
  deaths: number
  public team: number
  private createdAt: Date
  private isBot: boolean

  constructor(socketId: string, playerName: string, isBot: boolean = false) {
      this.id = socketId
      this.socketId = socketId
      this.name = this.sanitize(playerName)
      this.initialLives = 10
      this.resetScore()
      this.resetLives()
      this.createdAt = new Date()
      this.isBot = isBot
  }

  public sanitize(playerName: string) {
      //let name =  playerName.replace(/[\W_]+/g,"");
      let name = playerName.replace(/[^a-zA-Z0-9_\(\)]+/g,"")
      return name
  }

  public setTeam(team: number) {
      console.log('set team v2', team)
      this.team = team
  }

  public isBotPlayer() {
      return this.isBot
  }

  public serialize() {
      return {
          id: this.id,
          name: this.name,
          lives: this.lives,
          color: this.color,
          team: this.team,
          score: this.score,
          kills: this.kills,
          deaths: this.deaths
      }
  }

  public setColor(color: any) {
      this.color = color
  }

  public getColor(color: any) {
      return this.color
  }

  public getId() {
      return this.id
  }

  public getName() {
      return this.name
  }

  public addLive() {
      this.lives++
  }

  public removeLive() {
      this.lives--
  }

  public resetLives() {
      this.lives = this.initialLives
  }

  public getLives() {
      return this.lives
  }

  getScore() {
      return this.score
  }

  setScore(score: number) {
      this.score = score
  }

  increaseKills() {
      this.kills++
  }

  increaseDeaths() {
      this.deaths++
  }

  resetScore() {
      this.setScore(0)
      this.kills = 0
      this.deaths = 0
  }


  public playedTime(dateFuture: Date) {
      const locale = "en-US";
      const localeOpts = {
        minimumIntegerDigits: 2,
        useGrouping: false
      };
    
      let delta = Math.abs(dateFuture.valueOf() - this.createdAt.valueOf()) / 1000;
    
      //calculate (and subtract) whole minutes
      let minutes = Math.floor(delta / 60) % 60;
      delta -= minutes * 60;
    
      // what's left is seconds
      let seconds = Math.floor(delta % 60); 
      return {
        minutes: minutes.toLocaleString(locale, localeOpts),
        seconds: seconds.toLocaleString(locale, localeOpts)
      }
  }

}