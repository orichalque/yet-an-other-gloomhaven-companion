var abilitiesManagement = {
    data: {
        /* Ability information */
        abilities : [],
        abilityCategory: null,
        abilitiesChosen: [],        
        twoAbilitiesSelected: [],
        abilitiesOnBoard: [],
        longRestMode: false,
        className: ''
    },
    methods: {
        displayAbilities: function(param) {
            this.classChosen = true;
            this.displayModifiers(param.name.substring(0,2))
            if (this.abilityCategory == param) {
                this.abilityCategory = null
            } else {
                this.abilityCategory = param
                this.abilityCategory.cards.sort((a, b) => a.level - b.level)
            }
            this.$forceUpdate()

        },
        addAbility: function(card) {   
            card.duration = 0
            if (!this.abilitiesChosen.includes(card)) {
                if (this.abilitiesChosen.length < this.abilityCategory.max) 
                    this.abilitiesChosen.push(card)
            } else {
                this.removeAbility(card)
            }
        },
        removeAbility: function(card) {
            indexOfCardToRemove = this.abilitiesChosen.indexOf(card)
            this.abilitiesChosen.splice(indexOfCardToRemove, 1)
        },
        shortRest: function() {
            if (!this.longRestMode && this.abilitiesChosen != null && this.abilitiesChosen.filter(card => card.played).length >0) {
                var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed))
                var cardIndexToDestroy = getRandomInt(cardsPlayed.length)    
                cardsPlayed[cardIndexToDestroy].destroyed = true
                cardsPlayed.splice(cardIndexToDestroy, 1)
                cardsPlayed.forEach(card => card.played = false)
                
                if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                    this.showRedAlert('You do not have enough cards in your end to continue.')
                }
            }   
            this.$forceUpdate()
        },
        longRest: function() {
            if (this.abilitiesChosen != null && this.abilitiesChosen.filter(card => card.played && ! card.destroyed).length >0) {
                this.longRestMode = true    
                this.gearChosen.forEach(gear => {
                    if (gear.played && ! gear.lost) {
                        gear.played = false
                    }
                })
            }            
        },
        destroyLongRestCard: function(card) {
            card.destroyed = true
            var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed))
            cardsPlayed.forEach(card => card.played = false)
            
            if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                this.showRedAlert('You do not have enough cards in your end to continue.')
            }
            this.longRestMode = false
            this.$forceUpdate()
        },
        pickCard: function(card) {
            if (this.twoAbilitiesSelected.length < 2) {
                this.twoAbilitiesSelected.push(card)
            } else {
                this.showRedAlert('You already picked two cards')                        
            }            
        },
        cancelCard: function(card) {
            if (this.twoAbilitiesSelected.includes(card)) {
                indexOfCardToRemove = this.twoAbilitiesSelected.indexOf(card)
                this.twoAbilitiesSelected.splice(indexOfCardToRemove, 1)
            }
        },
        fetchCard: function(card) {
            card.played = false
            card.destroyed = false
            this.$forceUpdate()
        },
        destroyCard: function(card) {
            this.cancelCard(card)
            card.destroyed = true
            card.played = true
            card.duration = 0
            this.$forceUpdate()
        },
        useCard: function(card) {
            card.numberOfTimesUsed ++     
            this.$forceUpdate()       
        },
        keepAbilityOneTurn(card) {
            card.duration = 1
            this.$forceUpdate()
        },
        keepAbilityManyTurns(card) {
            card.duration = -1
            card.numberOfTimesUsed = 0            
            this.$forceUpdate()
        },
        play: function() {
            if (this.twoAbilitiesSelected.length != 2) {
                if(this.abilitiesChosen.length == 0) {
                    this.showRedAlert('You need to build you deck in the Abilities section.')
                } else {
                    this.showRedAlert('You have to select two cards.')
                }
            } else {
                this.twoAbilitiesSelected.forEach(card => card.played = true)   
                this.twoAbilitiesSelected = []             
                this.abilitiesChosen.filter(elem => elem.duration > 0).forEach(elem => elem.duration --)
                this.turn ++
                this.$forceUpdate()
            }            
        }
    }
}