import {EventHandler} from '@cuboid3/core'

export class InputHandler {

  private sock : SocketIOClient.Socket;
  private document: Document
  private currentMouseCoord: number
  private screenLocked: boolean
  private mouseSensitivity: number
  private clientScenarioDefs: any

  constructor(socket: SocketIOClient.Socket, document: Document, clientScenarioDefs: any) {
    this.sock = socket
    this.document = document
    this.screenLocked = false
    this.mouseSensitivity = 1

    this.clientScenarioDefs = clientScenarioDefs
  }

  init() {
    this.defaultAttachInputEvents()

    EventHandler.subscribe('client:primaryActorTypeAdded', (actorName: string) => {

      Object.keys(this.clientScenarioDefs).forEach((scenarioName) => {
        if (typeof this.clientScenarioDefs[scenarioName].inputs[actorName] !== "undefined") {
          console.log("applying custom inputs from scenarioName", scenarioName);
          this.clientScenarioDefs[scenarioName].inputs[actorName](this.sock, this.document)
        }
      })
    })

    EventHandler.subscribe('client:playAgain', () => {
      this.sock.emit('playAgain')
    })

    EventHandler.subscribe('client:lockScreen', () => {
      this.lockScreenOnCanvasClick();
    })

    EventHandler.subscribe('client:unlockScreen', () => {
      this.unlockScreen();
    })
    EventHandler.subscribe('client:setMouseSensitivity', (sensitivity: number) => {
      this.setMouseSensitivity(sensitivity);
    })

    EventHandler.subscribe('client:respawn', () => {
      this.sock.emit('respawn')
    })

    EventHandler.subscribe('client:heroSelected', (heroName: string) => {
      this.sock.emit('heroSelected', {hero: heroName})
    })
  }

  lockScreenOnCanvasClick() {
    setTimeout(() => {
      let canvas = this.document.getElementById('game-canvas')!
      if (!canvas) {
        return
      }
      canvas.onclick = function() {
        //console.log("request pointer lock")
        canvas.requestPointerLock();
        if (document.pointerLockElement) {
          canvas.onclick = function() {}
        }
      }
    },300)
  }

  unlockScreen() {
    setTimeout(() => {
      //let canvas = this.document.getElementById('game-canvas')
      /*canvas.onclick = function() {
        console.log("clear pointer lock")
      }*/
      console.log("clear pointer lock")
      document.exitPointerLock();
      this.lockScreenOnCanvasClick()
    },300)
  }

  setMouseSensitivity(sensitivity: number) {
    this.mouseSensitivity = sensitivity
  }

  defaultAttachInputEvents() {

    this.document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
    }, false);

    this.document.addEventListener('pointerlockchange', () => {
      if (this.document.pointerLockElement === this.document.getElementById('game-canvas')) {
        this.screenLocked = true
      } else {
        this.lockScreenOnCanvasClick()
        this.screenLocked = false
      }
    }, false);


    this.document.onmousedown = (e) => {
      if ((e.target as any).nodeName === 'CANVAS') {
        e.preventDefault()
        if (e.button === 0) {
          this.sock.emit('command', {label: 'fire'});
        }
  
        if (e.button === 2) {
          this.sock.emit('command', {label: 'startDefend'});
        }
        return false;
      }
    }

    this.document.onmouseup = (e) => {
      if ((e.target as any).nodeName === 'CANVAS') {
        e.preventDefault()
        if (e.button === 2) {
          this.sock.emit('command', {label: 'stopDefend'});
        }
        /*if (e.button === 0) {
          console.log("mouse 1 up")
        }*/
        return false;
      }
    }

    this.document.onmousemove = (e) =>  {
      //console.log(e)
      if (!this.screenLocked) {
        return
      }
      this.sock.emit('command', {label: 'mouseMove', value: e.movementX * -1 * this.mouseSensitivity})
    }

    this.document.onkeydown = (e) => {
      //console.log(e);
      if (e.keyCode === 27) {
        EventHandler.publish("client:toggleEscMenu")
      }
      if (e.keyCode === 65) {
        this.sock.emit('command', {label: 'startMoveLeft'})
      }
    
      if (e.keyCode === 68) {
        this.sock.emit('command', {label: 'startMoveRight'});
      }

      if (e.keyCode === 66) {
        this.sock.emit('command', {label: 'startDefend'});
        e.preventDefault()
      }

      if (e.keyCode === 32) {
        this.sock.emit('command', {label: 'fire'});
        console.log('fire')
        e.preventDefault()
      }

      if (e.keyCode === 87) {
        this.sock.emit('command', {label: 'startMoveUp'});
      }

      if (e.keyCode === 83) {
        this.sock.emit('command', {label: 'startMoveDown'});
      }

      if (e.key === 'c') {
        this.sock.emit('command', {label: 'downC'})
      }

      if (e.key === 'x') {
        //this.sock.emit('command', {label: 'downX', value: 0})
        this.sock.emit('scenarioEvent', {eventName: 'specialMove', data: 0})
      }
      if (e.key === 'z') {
        //this.sock.emit('command', {label: 'downC', value: 1})
        this.sock.emit('scenarioEvent', {eventName: 'specialMove', data: 1})
      }
      /*if (e.key === 'v') {
        //this.sock.emit('command', {label: 'downV', value: 2})
        this.sock.emit('scenarioEvent', {eventName: 'specialMove', data: 2})
      }*/
    };


    this.document.onkeyup = ((e) => {
      if (e.keyCode === 65) {
        this.sock.emit('command', {label: 'stopMoveLeft'})
      }
    
      if (e.keyCode === 68) {
        this.sock.emit('command', {label: 'stopMoveRight'});
      }
      if (e.keyCode === 87) {
        this.sock.emit('command', {label: 'stopMoveUp'});
      }
      if (e.keyCode === 83) {
        this.sock.emit('command', {label: 'stopMoveDown'});
      }

      if (e.keyCode === 66) {
        this.sock.emit('command', {label: 'stopDefend'});
        e.preventDefault()
      }
      //e.preventDefault()
    });

    this.document.onkeypress = ((e) => {
      const statKeys = ['1','2','3','4','5','6','7'];
      if (statKeys.indexOf(e.key) > -1) {
        //console.log("Pressed Valid Key", e.key)
        //this.sock.emit('statIncrease', e.key)
        this.sock.emit('scenarioEvent', {eventName: 'statIncrease', data: e.key})
      }

      /*if (e.keyCode === 87) {
        this.sock.emit('command', {label: 'stopMoveUp'});
      }
      if (e.keyCode === 83) {
        this.sock.emit('command', {label: 'stopMoveDown'});
      }

      if (e.keyCode === 66) {
        this.sock.emit('command', {label: 'stopDefend'});
        e.preventDefault()
      }*/
      //e.preventDefault()
    });
  }
}