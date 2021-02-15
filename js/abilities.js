Array.prototype.move = function(from, to) {
    if(from >= 0 && to >= 0 && from < this.length && to < this.length) {
        this.splice(to, 0, this.splice(from, 1)[0]);           
    }
};

var abilitiesManagement = {
    data: {
        /* Ability information */
        abilities : [],
        abilityCategory: null,
        abilitiesChosen: [],        
        twoAbilitiesSelected: [],
        classDisplayed: [],
        longRestMode: false,
        shortRestMode: false,
        cardsDiscardedPreviousTurn: null,
        cardToLose: null,
        cardsPlayed: [],
        cardsInHand: [],
        cardsDestroyed : [],
        cardsDiscarded : [],
        cardsOnBoard : [],
        className: '',
        chosenCardExchanger: null,
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
            $('#characterSelectionModal').modal('hide')
            this.$forceUpdate()
        },
        displayAbilitiesToExchange: function(param) {
            if (this.chosenCardExchanger == param) {
                this.chosenCardExchanger = null
            } else {
                this.chosenCardExchanger = param
            }
        },
        addAbility: function(card) {   
            card.duration = 0
            if (!this.abilitiesChosen.includes(card)) {
                if (this.abilitiesChosen.length < this.abilityCategory.max) 
                    this.abilitiesChosen.push(card)
                    this.cardsInHand.push(card)
            } else {
                this.removeAbility(card)
            }
        },
        acceptAbility: function(card) {   
            card.duration = 0
            this.cardsInHand.push(card)
        },
        removeAbility: function(card) {
            indexOfCardToRemove = this.abilitiesChosen.indexOf(card)
            this.abilitiesChosen.splice(indexOfCardToRemove, 1)

            this.removeAbilityFromBoard(card);
        },
        stopHidingAbility: function(abilityCategory)  {
            abilityCategory.hidden = false
            if (!this.classDisplayed.includes(abilityCategory.name)) {
                this.classDisplayed.push(abilityCategory.name)                
            }
            this.displayAbilities(abilityCategory)
        },
        removeAbilityFromBoard(card) {
            if (this.cardsInHand.includes(card)) {
                indexOfCardToRemove = this.cardsInHand.indexOf(card);
                this.cardsInHand.splice(indexOfCardToRemove, 1);
            } else if (this.cardsDestroyed.includes(card)) {
                indexOfCardToRemove = this.cardsDestroyed.indexOf(card);
                this.cardsDestroyed.splice(indexOfCardToRemove, 1);
            } else if (this.cardsDiscarded.includes(card)) {
                indexOfCardToRemove = this.cardsDiscarded.indexOf(card);
                this.cardsDiscarded.splice(indexOfCardToRemove, 1);
            } else if(this.cardsOnBoard.includes(card)){
                indexOfCardToRemove = this.cardsOnBoard.indexOf(card);
                this.cardsOnBoard.splice(indexOfCardToRemove, 1);
            }
        },
        shortRest: function() {          
            if(this.cardsDiscardedPreviousTurn == null){
                this.cardsDiscardedPreviousTurn = this.cardsDiscarded
            }  

            if (this.cardsDiscardedPreviousTurn.length > 0) {
                this.shortRestMode = true

                //destroy a random discarded card
                var cardIndexToDestroy = getRandomInt(this.cardsDiscardedPreviousTurn.length)
                this.cardToLose = this.cardsDiscardedPreviousTurn[cardIndexToDestroy]
                this.cardToLose.destroyed = true
                this.cardsDiscardedPreviousTurn.splice(cardIndexToDestroy, 1)
                this.cardsDestroyed.push(this.cardToLose)

                //recover the other discarded cards
                this.cardsDiscardedPreviousTurn.forEach(card => {
                    indexOfCardToRemove = this.cardsDiscarded.indexOf(card);
                    this.cardsDiscarded.splice(indexOfCardToRemove, 1);

                    this.cardsInHand.push(card)

                    card.played = false
                })
                
                if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                    this.showRedAlert('You do not have enough cards in your hand to continue.')                
                }
            } else {
                this.showRedAlert('You need discarded cards to rest.')                
            }
                
            this.$forceUpdate()
        },
        rerollShortRest: function() {
            //recover the previously destroyed card
            this.cardToLose.destroyed = false
            this.cardToLose.played = false
            indexOfCardToRemove = this.cardsDestroyed.indexOf(this.cardToLose);
            this.cardsDestroyed.splice(indexOfCardToRemove, 1);
            this.cardsInHand.push(this.cardToLose)

            this.shortRest()
            this.cardsDiscardedPreviousTurn = null
            this.shortRestMode = false
            this.$forceUpdate()            
        },
        longRest: function() {
            this.longRestMode = true    
            this.$forceUpdate()    
        },
        canRest: function() {
            return this.cardsDiscarded.length >= 2
        },
        destroyLongRestCard: function(card) {
            card.destroyed = true
            var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed && (card.duration == 0 || card.duration == null)))
            cardsPlayed.forEach(card => card.played = false)
            
            this.abilitiesChosen.filter(elem => elem.duration > 0).forEach(elem => elem.duration --)
            this.turn ++
            
            this.gearChosen.forEach(gear => {
                if (gear.played && ! gear.lost) {
                    gear.played = false
                }
            })
            
            if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                this.showRedAlert('You do not have enough cards in your hand to continue.')
            }
            
            this.longRestMode = false
            this.$forceUpdate()
        },
        pickCard: function(card) {
            if (this.twoAbilitiesSelected.includes(card)) {
                this.cancelCard(card)
            } else if (this.twoAbilitiesSelected.length < 2) {
                this.twoAbilitiesSelected.push(card)                
            }       
        },
        cancelCard: function(card) {
            indexOfCardToRemove = this.twoAbilitiesSelected.indexOf(card)
            this.twoAbilitiesSelected.splice(indexOfCardToRemove, 1)
        },
        fetchCard: function(card) {
            if(this.cardsDestroyed.includes(card)){
                indexOfCardToRemove = this.cardsDestroyed.indexOf(card)
                this.cardsDestroyed.splice(indexOfCardToRemove, 1)
            } else if(this.cardsDiscarded.includes(card)){
                indexOfCardToRemove = this.cardsDiscarded.indexOf(card)
                this.cardsDiscarded.splice(indexOfCardToRemove, 1)
            }
            this.cardsInHand.push(card)
            this.$forceUpdate()
        },
        destroyCard: function(card) {
            if(card.canBeExchanged){
                this.removeAbility(card)
            }else{
                this.cancelCard(card)
                this.cardsDestroyed.push(card)

                if(this.cardsInHand.includes(card)){
                    indexOfCardToRemove = this.cardsInHand.indexOf(card)
                    this.cardsInHand.splice(indexOfCardToRemove, 1)
                }else if(this.cardsDiscarded.includes(card)){
                    indexOfCardToRemove = this.cardsDiscarded.indexOf(card)
                    this.cardsDiscarded.splice(indexOfCardToRemove, 1)
                }
                this.$forceUpdate()
            }
        },
        playCard: function(card) {
            this.cancelCard(card)
            this.cardsDiscarded.push(card)

            indexOfCardToRemove = this.cardsInHand.indexOf(card)
            this.cardsInHand.splice(indexOfCardToRemove, 1)
        },
        discardOnBoardItem(card) {
            indexOfCardToRemove = this.cardsOnBoard.indexOf(card)
            this.cardsOnBoard.splice(indexOfCardToRemove, 1)

            this.cardsDiscarded.push(card)
            card.duration = 0
            this.$forceUpdate()
        },
        useCard: function(card) {
            card.numberOfTimesUsed ++     
            this.$forceUpdate()       
        },
        keepAbilityOneTurn(card) {
            card.duration = 1     
            this.cardsOnBoard.push(card)
            
            indexOfCardToRemove = this.cardsDiscarded.indexOf(card)
            this.cardsDiscarded.splice(indexOfCardToRemove, 1)
            this.$forceUpdate()
        },
        keepAbilityManyTurns(card) {    
            card.duration = -1
            card.numberOfTimesUsed = 0            

            this.cardsOnBoard.push(card)
            
            indexOfCardToRemove = this.cardsDiscarded.indexOf(card)
            this.cardsDiscarded.splice(indexOfCardToRemove, 1)
            this.$forceUpdate()
        },
        updateCardPosition: function(collection, oldIndex, newIndex) {
            collection.move(oldIndex, newIndex)
        },
        updateOnBoardCards(){
            this.cardsOnBoard.forEach(card => {
                card.duration--;
                if(card.duration==0){
                    indexOfCardToRemove = this.cardsOnBoard.indexOf(card)
                    this.cardsOnBoard.splice(indexOfCardToRemove, 1)

                    this.cardsDiscarded.push(card)
                }
            })
        }, 
        play: function() {
            if (this.twoAbilitiesSelected.length != 2) {
                if(this.abilitiesChosen.length == 0) {
                    this.showRedAlert('You need to build you deck in the Abilities section.')
                } else {
                    this.showRedAlert('You have to select two cards.')
                }
            } else {
                this.twoAbilitiesSelected.forEach(card => {
                    if(card.canBeExchanged){
                        this.removeAbility(card)
                    } else {
                        this.playCard(card)
                    }
                })   
                this.twoAbilitiesSelected = []   
                this.updateOnBoardCards()          
                this.turn ++                
                this.shortRestMode = false
                this.$forceUpdate()
                this.roundEndShuffle()
            }            
        }
    }
}

