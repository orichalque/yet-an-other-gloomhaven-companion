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
        lastDrawnModifier: null  
    },
    methods: {
        displayModifiers: function(param) {
            if (this.modifierCategory === param) {
                this.modifierCategory = null
            } else {
                this.modifierCategory = param
            }
        },            
        addModifier: function(card) {   
            this.modifiersChosen.push(card)
            this.modifiersDrawPile.push(card)
        },
        removeModifier: function(card) {
            indexOfCardToRemove = this.modifiersChosen.indexOf(card)
            this.modifiersChosen.splice(indexOfCardToRemove, 1)
            this.modifiersDrawPile.splice(indexOfCardToRemove, 1)
        },
        drawModifier: function() {
            var randomint = getRandomInt(this.modifiersDrawPile.length)
            this.lastDrawnModifier = this.modifiersDrawPile[randomint]
            this.modifiersDrawPile.splice(randomint,1)
        },
        shuffleModifiersDeck: function() {
            this.modifiersDrawPile = []
            for(let i = this.modifiersChosen.length - 1; i > 0; i--){
                this.modifiersDrawPile.push(this.modifiersChosen[i])
            }
            this.lastDrawnModifier = null
        },
        displaySpecialModifiers: function() {
            if(this.specialModifiers){
                this.specialModifiers = false
            }else{
                this.specialModifiers = true
            }
        },
        addModifier: function(card) {   
            this.modifiersChosen.push(card)
            this.modifiersDrawPile.push(card)
        },
        removeModifier: function(card) {
            indexOfCardToRemove = this.modifiersChosen.indexOf(card)
            this.modifiersChosen.splice(indexOfCardToRemove, 1)
            this.modifiersDrawPile.splice(indexOfCardToRemove, 1)
        },
        drawModifier: function() {
            var randomint = getRandomInt(this.modifiersDrawPile.length)
            this.lastDrawnModifier = this.modifiersDrawPile[randomint]
            this.modifiersDrawPile.splice(randomint,1)
        },
        shuffleModifiersDeck: function() {
            this.modifiersDrawPile = []
            for(let i = this.modifiersChosen.length - 1; i > 0; i--){
                this.modifiersDrawPile.push(this.modifiersChosen[i])
            }
            this.lastDrawnModifier = null
        }        
    }
}