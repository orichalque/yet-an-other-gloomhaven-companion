const curseName = 'curse'
const blessingName = 'bless'
const nullName = 'am-p-19'
const twoXName = 'am-p-20'

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
        blessings: 0,
        curses: 0,
        hasEnabledModifierDisplay: false
    },
    methods: {
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
            this.lastDrawnModifier = this.modifiersDrawPile[randomint]

            if (this.checkIfCurseOrBless(this.lastDrawnModifier)) {
                this.removeModifier(this.lastDrawnModifier)
            } else {
                this.modifiersDrawPile.splice(randomint,1)            
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
        checkIfBlessing: function(card) {
            return this.modifiersSpecial.find(element => element.name == blessingName).cards.includes(card) || false
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
            this.lastDrawnModifier = null
            this.modifiersDiscardPile = []
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
        },
        addCurse: function() {
            const availableCurses = this.modifiersSpecial
                .find(element => element.name == curseName)
                .cards
                .filter(element => !this.modifiersDrawPile.includes(element))
        
            if(availableCurses.length > 0) this.addModifier(availableCurses[0])
        },
        resetModifiers: function() {
            this.shuffleModifiersDeck()
            this.modifiersDrawPile.map(card => {if(this.checkIfCurseOrBless(card)) this.removeModifier(card)})
            this.blessings = this.getBlessings()
            this.curses = this.getCurses()            
        },
        getBlessings: function() {
            return this.modifiersDrawPile.filter(element => this.checkIfBlessing(element)).length
        },
        getCurses: function() {
            return this.modifiersDrawPile.filter(element => this.checkIfCurse(element)).length
        }
    }
}
