import {Application, Container, Graphics, Renderer, Text, TextStyle} from "pixi.js";

// type for object reel
type Reel = {
  container: Container
  symbols: Text[]
  spinning: boolean
  finalSymbols?: string[]
}

export const SlotGame = (app: Application<Renderer>) => {
  const reelCount = 3
  const symbols = ['🍒', '🍋', '🍊', '🔔', '⭐']
  const symbolsPerReel = 3 // visible symbols on reel
  let balance = 1000
  const bet = 10
  let isSpinning = false
  let reels: Reel[] = []
  let spinButton: Graphics | null = null
  let winText: Text | null = null
  let balanceText: Text | null = null
  let betText: Text | null = null

  // function for creating UI
  const setupUI = () => {
    // Title
    const title = new Text({
      text: 'BRIGHT SLOTS',
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
    balanceText = new Text({text: `Balance: ${balance}$`, style: infoStyle})
    balanceText.anchor.set(0, 0.5) // Left edge, vertical centered
    balanceText.x = 50
    balanceText.y = 120
    app.stage.addChild(balanceText)

    // Bet
    betText = new Text({text: `Bet: ${bet}$`, style: infoStyle})
    betText.anchor.set(0, 0.5)
    betText.x = 50
    betText.y = 160
    app.stage.addChild(betText)
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

    // Create ALL reels in loop
    for (let i = 0; i < reelCount; i++) {
      const reelContainer = new Container()
      reelContainer.x = startX + i * (reelWidth + spacing) // Move next reel
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
  }

  const createSpinButton = () => {
    const buttonWidth = 200
    const buttonHeight = 80
    const buttonX = app.screen.width / 2 - buttonWidth / 2 // Centering
    const buttonY = app.screen.height - 150

    // Draw button
    const button = new Graphics()
    button.roundRect(0, 0, buttonWidth, buttonHeight, 15)
    button.fill(0x00ff00)
    button.stroke({width: 3, color: '0x00cc00'}) // outline
    button.x = buttonX
    button.y = buttonY

    const buttonText = new Text({
      text: 'SPIN',
      style: {
        fontFamily: 'Arial',
        fontSize: 48,
        fontWeight: 'bold',
        fill: '#FFFFFF'
      }
    })
    buttonText.anchor.set(0.5)
    buttonText.x = buttonWidth / 2
    buttonText.y = buttonHeight / 2
    button.addChild(buttonText)

    // turn on events
    button.eventMode = 'static'
    button.cursor = 'pointer'

    // onClick
    button.on('pointerdown', () => {
      spin()
    })

    // Hover effect
    button.on('pointerenter', () => {
      button.clear()
      button.roundRect(0, 0, buttonWidth, buttonHeight, 15)
      button.fill(0x00cc00) // darker on hover
      button.stroke({width: 3, color: '0x00aa00'})
    })

    button.on('pointerleave', () => {
      button.clear()
      button.roundRect(0, 0, buttonWidth, buttonHeight, 15)
      button.fill(0x00ff00) // return the original color
      button.stroke({width: 3, color: '0x00cc00'})
    })

    app.stage.addChild(button)
    spinButton = button // save link for control
  }

  const createWinText = () => {
    winText = new Text({
      text: '',
      style: {
        fontFamily: 'Arial',
        fontSize: 30,
        fill: '#00FF00',
        fontWeight: 'bold'
      }
    })
    winText.anchor.set(0.5)
    winText.x = app.screen.width / 2
    winText.y = app.screen.height - 30
    app.stage.addChild(winText)
  }

  const spin = () => {
    // check: spin restricted, if it is spinning or no money
    if (isSpinning || balance < bet) {
      console.log('spin restricted')
      return
    }

    // write off the bet
    balance -= bet
    updateBalance()

    // reset win message
    if (winText !== null) {
      winText.text = ''
    }
    isSpinning = true

    // disable button while is spinning
    if (spinButton !== null) {
      spinButton.alpha = 0.5
      spinButton.eventMode = 'none'
    }

    // Generate final symbols for each reels
    reels.forEach(reel => {
      // generate random symbols
      const finalSymbols: string[] = []
      for (let i = 0; i < symbolsPerReel; i++) {
        finalSymbols.push(
          symbols[Math.floor(Math.random() * symbols.length)]
        )
      }
      reel.finalSymbols = finalSymbols

      // set final symbols (without animation)
      reel.symbols.forEach((symbol, symbolIndex) => {
        if (symbolIndex < symbolsPerReel && reel.finalSymbols) {
          symbol.text = reel.finalSymbols[symbolIndex]
        }
      })
    })

    checkWin()

    // turn on button again
    isSpinning = false
    if (spinButton !== null) {
      spinButton.alpha = 1
      spinButton.eventMode = 'static'
    }
  }

  const updateBalance = () => {
    if (balanceText !== null) {
      balanceText.text = `Balance: ${balance}$`
      // if balance less than bet, make text red
      balanceText.style.fill = balance < bet ? '#FF0000' : '#FFFFFF'
    }
  }

  const checkWin = () => {
    // take middle symbol from each reel
    const middleRow = reels.map(
      reel => reel.symbols[1].text
    )
    const [a, b, c] = middleRow
    let win = 0

    // win condition
    if (a === b && b === c) {
      win = bet * 10
    }

    if (win > 0) {
      balance += win
      if (winText !== null) {
        winText.text = `WIN: ${win}$`
        winText.style.fill = '#00FF00'
      }
    } else {
      if (winText !== null) {
        winText.text = 'Try again!'
        winText.style.fill = '#FF0000'
        setTimeout(() => {
          // check winText again because TypeScript can't guarantee it's still not null after 2 seconds
          winText && (winText.text = '')
        }, 2000)
      }
    }

    updateBalance()
  }


  // Initialize game parts UI
  setupUI();
  createReels()
  createSpinButton()
  createWinText() // called last so winText will be on top of all elements
}