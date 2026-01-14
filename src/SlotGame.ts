import {Application, Container, Graphics, Renderer, Text, TextStyle} from "pixi.js";

// type for object reel
type Reel = {
  container: Container
  symbols: Text[]
  spinning: boolean
}

export const SlotGame = (app: Application<Renderer>) => {
  const reelCount = 3
  const symbols = ['🍒', '🍋', '🍊', '🔔', '⭐']
  const symbolsPerReel = 3 // visible symbols on reel
  const balance = 1000
  const bet = 10
  let isSpinning = false
  let reels: Reel[] = []


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
    const betText = new Text(`Bet: ${bet}$`, infoStyle)
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
  }



  // Create reels
  const createReels = () => {
    const reelWidth = 150
    const reelHeight = 450
    const spacing = 20

    // calculating start positon (for centering)
    const startX = (app.screen.width -
      (reelCount * reelWidth +
        (reelCount - 1) * spacing)) / 2
    const startY = 200

    // Create only ONE reel (for simplify)
    const reelContainer = new Container()
    reelContainer.x = startX
    reelContainer.y = startY

    // Reel background
    const reelBg = new Graphics()
    reelBg.rect(0, 0, reelWidth, reelHeight)
    reelBg.fill(0x2a2a3e) // dark blue
    reelBg.stroke({width: 3, color: 0x4a4a5e}) // outline
    reelContainer.addChild(reelBg)

    // mask (view area)
    const mask = new Graphics()
    mask.rect(0, 0, reelWidth, reelHeight)
    mask.fill(0xffffff)
    reelContainer.mask = mask
    reelContainer.addChild(mask)

    // Create one symbol
    const createSymbol = () => {
      const symbolText = new Text({
        text: symbols[Math.floor(Math.random() * symbols.length)],
        style: {
          fontFamily: 'Arial',
          fontSize: 80,
          fill: '#FFFFFF'
        }
      }
      )

      // center symbol horizontally
      symbolText.anchor.set(0.5)
      symbolText.x = reelWidth / 2 // reel center (150 / 2)

      return symbolText
    }

    // Symbols inside reel
    // Create more symbols, then possible to see (for limitless scroll effect)
    const reelSymbols: Text[] = []
    for (let j = 0; j < symbolsPerReel + 2; j++) {
      const symbol = createSymbol()
      const symbolHeight = reelHeight / symbolsPerReel
      symbol.y = j * symbolHeight // place symbols vertically
      reelSymbols.push(symbol)
      reelContainer.addChild(symbol)
    }

    // saving reel state
    reels.push({
      container: reelContainer,
      symbols: reelSymbols,
      spinning: false
    })

    // Add reel to stage
    app.stage.addChild(reelContainer)
  }


  // Initialize game parts UI
  setupUI();
  createReels()
}