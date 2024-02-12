const curseName = 'curse'
const blessingName = 'bless'
const nullName = 'am-p-19'
const twoXName = 'am-p-20'
const sanctuaryNamePrefix = 'cs-am-sa-'

var modifiersManagement = {
    data: {
        /* Modifier information */
        modifiers : [],
        modifiersBase : [],
        modifiersSpecial : [],
        modifierCategory: null,
        modifiersChosen: [],
        modifiersDrawPile: [],
        specialModifiers : false,
        lastDrawnModifier: null,
        modifiersDiscardPile : [],
        overlayCard: {},
        cardsToDisplayCurrent: 0,
        blessings: 0,
        curses: 0,
        hasEnabledModifierDisplay: false
    },
    methods: {
        saveModifierGameplayData: function () {
          Cookies.set("modifiersDrawPile", JSON.stringify(this.modifiersDrawPile), { expires: 365 })
          Cookies.set("modifiersDiscardPile", JSON.stringify(this.modifiersDiscardPile), { expires: 365 })
          Cookies.set("lastDrawnModifier", JSON.stringify(this.lastDrawnModifier), { expires: 365 })
          Cookies.set("blessingsGameplayData", JSON.stringify(this.blessings), { expires: 365 })
          Cookies.set("cursesGameplayData", JSON.stringify(this.curses), { expires: 365 })
        },
        loadModifierGamePlayData: function () {

            // Load modifiers draw pile
            modifiersDrawPileCookie = Cookies.get("modifiersDrawPile")
            if (modifiersDrawPileCookie != null) {
              var oldModifiersDrawPile = JSON.parse(modifiersDrawPileCookie);
              if (oldModifiersDrawPile != null) {
                  this.modifiersDrawPile = []
                  oldModifiersDrawPile.forEach(modifier => {
                      // Assumes that modifiersChosen is already loaded
                      this.modifiersChosen.forEach(card => {
                          if (card.name === modifier.name) {
                              this.modifiersDrawPile.push(card)
                          }
                      })
                  })
              }
            }

            // Load modifiers discard pile
            modifiersDiscardPileCookie = Cookies.get("modifiersDiscardPile")
            if (modifiersDiscardPileCookie != null) {
              var oldModifiersDiscardPile = JSON.parse(modifiersDiscardPileCookie);
              if (oldModifiersDiscardPile != null) {
                  this.modifiersDiscardPile = []
                  oldModifiersDiscardPile.forEach(modifier => {
                      // Assumes that modifiersChosen is already loaded
                      this.modifiersChosen.forEach(card => {
                          if (card.name === modifier.name) {
                              this.modifiersDiscardPile.push(card)
                          }
                      })
                  })
              }
            }

            // Load last drawn modifier
            lastDrawnModifierCookie = Cookies.get("lastDrawnModifier")
            if (lastDrawnModifierCookie != null) {
              var oldLastDrawnModifier = JSON.parse(lastDrawnModifierCookie);
              if (oldLastDrawnModifier != null) {
                  this.lastDrawnModifier = null
                  // Assumes that modifiersChosen is already loaded
                  this.modifiersChosen.forEach(card => {
                      if (card.name === oldLastDrawnModifier.name) {
                          this.lastDrawnModifier = card
                      }
                  })
              }
            }

            // Load number of blessings/curses
            blessingsCookie = Cookies.get("blessingsGameplayData")
            if (blessingsCookie != null)
                this.blessings = JSON.parse(blessingsCookie)

            cursesCookie = Cookies.get("cursesGameplayData")
            if (cursesCookie != null)
                this.curses = JSON.parse(cursesCookie)

            this.$forceUpdate()
        },
        displayModifiers: function(param) {
            this.className = param
            if (this.modifierCategory == param) {
                this.modifierCategory = null
            } else {
                this.modifierCategory = param
            }
        },
        addModifier: function(card) {   
            if (!this.modifiersChosen.includes(card)) {
                this.modifiersChosen.push(card)
                this.modifiersDrawPile.push(card)

                if (this.checkIfCurse(card)) this.curses ++
                if (this.checkIfBlessing(card)) this.blessings ++

            } else {
                this.removeModifier(card)
            }
        },
        removeModifier: function(card) {
            this.modifiersChosen = this.modifiersChosen.filter(c => c != card)
            this.modifiersDrawPile = this.modifiersDrawPile.filter(c => c != card)

            if (this.checkIfCurse(card)) this.curses --
            if (this.checkIfBlessing(card)) this.blessings --
        },
        drawModifier: function() {
            var randomint = getRandomInt(this.modifiersDrawPile.length)
            if(this.lastDrawnModifier != null ){
                this.modifiersDiscardPile.unshift(this.lastDrawnModifier)
            }
            this.lastDrawnModifier = this.modifiersDrawPile[0]

            if (this.checkIfCurseOrBless(this.lastDrawnModifier)) {
                this.removeModifier(this.lastDrawnModifier)
            } else {
                this.modifiersDrawPile.splice(0,1)
            }

        },
        checkIfNull: function(card) {
            return (card && card.name === nullName) || false
        },
        checkIfTwoX: function(card) {
            return (card && card.name === twoXName) || false
        },
        checkIfCurse: function(card) {
            return this.modifiersSpecial.find(element => element.name == curseName).cards.includes(card) || false
        },
        checkIfSanctuary: function(card) {
            const sanctuaryCards = this.modifiersSpecial.find(element => element.name.startsWith(sanctuaryNamePrefix))
            if (sanctuaryCards != null) {
                return sanctuaryCards.cards.includes(card)
            } else return false
        },
        checkIfBlessing: function(card) {
            return this.modifiersSpecial.find(element => element.name == blessingName).cards.includes(card) || this.checkIfSanctuary(card)
        },
        checkIfCurseOrBless: function(card) {
            return this.checkIfCurse(card) || this.checkIfBlessing(card)
        },
        roundEndShuffle: function() {
            const filtered = this.modifiersDiscardPile.filter(card => this.checkIfNull(card) || this.checkIfTwoX(card))
            if(this.checkIfNull(this.lastDrawnModifier) || this.checkIfTwoX(this.lastDrawnModifier) || filtered.length > 0) this.shuffleModifiersDeck()
        },
        shuffleModifiersDeck: function() {
            this.modifiersDrawPile = this.modifiersChosen.slice()

            this.shuffle()

            this.lastDrawnModifier = null
            this.modifiersDiscardPile = []
        },
        shuffle: function() {
            // JavaScript implementation of the Durstenfeld shuffle, an optimized version of Fisher-Yates
            // More here: https://stackoverflow.com/a/12646864
            for (let i = this.modifiersDrawPile.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.modifiersDrawPile[i], this.modifiersDrawPile[j]] = [this.modifiersDrawPile[j], this.modifiersDrawPile[i]];
            }
        },
        displaySpecialModifiers: function() {
            if(this.specialModifiers){
                this.specialModifiers = false
            }else{
                this.specialModifiers = true
            }
        },
        switchModifierClass: function () {
            this.modifierCategory = null
            this.className = ''
            this.modifiersChosen = this.modifiersBase.slice()
        },
        addBlessing: function() {
            const availableBlessings = this.modifiersSpecial
                .find(element => element.name == blessingName)
                .cards
                .filter(element => !this.modifiersDrawPile.includes(element))

            if(availableBlessings.length > 0) this.addModifier(availableBlessings[0])
            this.shuffle();
        },
        addCurse: function() {
            const availableCurses = this.modifiersSpecial
                .find(element => element.name == curseName)
                .cards
                .filter(element => !this.modifiersDrawPile.includes(element))

            if(availableCurses.length > 0) this.addModifier(availableCurses[0])
            this.shuffle();
        },
        resetModifiers: function() {                        
            if (this.modifiersDrawPile.filter(card => this.checkIfCurseOrBless(card)).length > 0) {
                this.showConfirmationDialog("Do you want to remove the blessing and curse cards from your modifiers deck ?",
                () => {
                    this.modifiersDrawPile.forEach(card => {
                        if(this.checkIfCurseOrBless(card)) {
                            this.removeModifier(card)
                        }
                    })
                })
            }
            this.shuffleModifiersDeck()
            this.blessings = this.getBlessings()
            this.curses = this.getCurses()
        },        
        updateModifierPosition: function(oldIndex, newIndex) {
            this.modifiersDrawPile.move(oldIndex, newIndex)
        },
        getBlessings: function() {
            return this.modifiersDrawPile.filter(element => this.checkIfBlessing(element)).length
        },
        getCurses: function() {
            return this.modifiersDrawPile.filter(element => this.checkIfCurse(element)).length
        }
    }
}
