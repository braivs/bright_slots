import {Application, Renderer, Text, TextStyle} from "pixi.js";

export const SlotGame = (app: Application<Renderer>) => {
  const reelCount = 3
  const symbols = ['🍒', '🍋', '🍊', '🔔', '⭐']
  const balance = 1000
  const bet = 10
  let isSpinning = false
  let reels = []


  // function for creating UI
  const setupUI = () => {
    // Title
    const title = new Text({
      text: 'SLOT MACHINE',
      style: {
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#FFD700',
        stroke: '#000000'
      }
    })
    app.stage.addChild(title)
    title.anchor.set(0.5) // centering
    title.x = app.screen.width / 2 // center of screen
    title.y = 60
  }

  // style for balance & bet
  const infoStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 32,
    fill: '#FFFFFF'
  })

  // Balance
  const balanceText = new Text(`Balance: ${balance}$`, infoStyle)
  balanceText.anchor.set(0,0.5) // Left edge, vertical centered
  balanceText.x = 50
  balanceText.y = 120
  app.stage.addChild(balanceText)

  // Bet
  const betText = new Text(`Bet: ${bet} $`, infoStyle)
  betText.anchor.set(0, 0.5)
  betText.x = 50
  betText.y = 160
  app.stage.addChild(betText)

  // Win message
  const winText = new Text({
    text: '',
    style: {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: '#00FF00',
      fontWeight: 'bold'
    }
  })
  winText.anchor.set(0.5)
  winText.x = app.screen.width / 2
  winText.y = app.screen.height - 100
  app.stage.addChild(winText)

  // create UI
  setupUI();

}