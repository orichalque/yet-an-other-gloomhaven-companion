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
        cardToLose: null,
        cardsToRestore: null,
        cardsPlayed: [],
        cardsInHand: [],
        cardsDestroyed : [],
        cardsDiscarded : [],
        cardsOnBoard : [],
        className: '',
        chosenCardExchanger: null,
        rerolling : false,
        abilitySearchExp: "",
        filteredAbilities: []
    },
    computed: {
        isRestDisabled: function() {
            return this.cardsDiscarded.length<2
        },
        islongRestBtnEnabled: function() {
            return this.cardToLose != null
        }
    },
    methods: {
        saveAbilityGameplayData: function () {
            Cookies.set("twoAbilitiesSelected", JSON.stringify(this.twoAbilitiesSelected), { expires: 365 })
            Cookies.set("cardsInHand", JSON.stringify(this.cardsInHand), { expires: 365 })
            Cookies.set("cardsDestroyed", JSON.stringify(this.cardsDestroyed), { expires: 365 })
            Cookies.set("cardsDiscarded", JSON.stringify(this.cardsDiscarded), { expires: 365 })
            Cookies.set("cardsOnBoard", JSON.stringify(this.cardsOnBoard), { expires: 365 })
        },
        loadAbilityGameplayData: function () {
            // Load two selected abilities
            twoAbilitiesSelectedCookie = Cookies.get('twoAbilitiesSelected')
            if (twoAbilitiesSelectedCookie != null) {
                oldAbilitiesSelected = JSON.parse(twoAbilitiesSelectedCookie)
                oldAbilitiesSelected.forEach(ability => {
                    this.abilities.forEach(cat => {
                        cat.cards.forEach(card => {
                            if (card.name === ability.name) {
                                this.twoAbilitiesSelected.push(card)
                            }
                        })
                    })
                })
            }

            // Load abilities currently in hand
            cardsInHandCookie = Cookies.get('cardsInHand')
            if (cardsInHandCookie != null) {
                this.cardsInHand = []
                oldCardsInHand = JSON.parse(cardsInHandCookie)
                oldCardsInHand.forEach(ability => {
                    this.abilities.forEach(cat => {
                        cat.cards.forEach(card => {
                            if (card.name === ability.name) {
                                this.cardsInHand.push(card)
                            }
                        })
                    })
                })
            }

            // Load destroyed abilities
            cardsDestroyedCookie = Cookies.get('cardsDestroyed')
            if (cardsDestroyedCookie != null) {
                oldCardsDestroyed = JSON.parse(cardsDestroyedCookie)
                oldCardsDestroyed.forEach(ability => {
                    this.abilities.forEach(cat => {
                        cat.cards.forEach(card => {
                            if (card.name === ability.name) {
                                this.cardsDestroyed.push(card)
                            }
                        })
                    })
                })
            }

            // Load discarded abilities
            cardsDiscardedCookie = Cookies.get('cardsDiscarded')
            if (cardsDiscardedCookie != null) {
                oldCardsDiscarded = JSON.parse(cardsDiscardedCookie)
                oldCardsDiscarded.forEach(ability => {
                    this.abilities.forEach(cat => {
                        cat.cards.forEach(card => {
                            if (card.name === ability.name) {
                                this.cardsDiscarded.push(card)
                            }
                        })
                    })
                })
            }

            // Load abilities currently on the board
            cardsOnBoardCookie = Cookies.get('cardsOnBoard')
            if (cardsOnBoardCookie != null) {
                oldCardsOnBoard = JSON.parse(cardsOnBoardCookie)
                oldCardsOnBoard.forEach(ability => {
                    this.abilities.forEach(cat => {
                        cat.cards.forEach(card => {
                            if (card.name === ability.name) {
                                if (ability.numberOfTimesUsed != null) {
                                    card.numberOfTimesUsed = ability.numberOfTimesUsed
                                }
                                card.duration = -1
                                this.cardsOnBoard.push(card)
                            }
                        })
                    })
                })
            }

            this.$forceUpdate()
        },
        displayAbilities: function(param) {
            this.classChosen = true;
            if (this.abilityCategory == param) { // unselecting a class
                this.abilityCategory = null
                this.classChosen = false;
            } else {
                this.displayModifiers(param.name)
                console.log(param.name)
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
                if (this.abilitiesChosen.length < this.abilityCategory.max) {
                    this.abilitiesChosen.push(card)
                    this.cardsInHand.push(card)
                } else {
                    this.showRedAlert('You have selected the maximum number of ability cards this class can take into battle.')
                }
            } else {
                this.removeAbility(card)
            }
        },
        acceptAbility: function(card) {
            card.duration = 0
            if (!this.cardsInHand.includes(card)) {
                this.cardsInHand.push(card)
            }            
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
                if(this.twoAbilitiesSelected.includes(card)){
                    indexOfCardToRemove = this.twoAbilitiesSelected.indexOf(card);
                    this.twoAbilitiesSelected.splice(indexOfCardToRemove, 1);
                }
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
        initShortRest: function() {
            this.rerolling = false
            var cardIndexToDestroy = getRandomInt(this.cardsDiscarded.length)
            isSameCard = (element) => element == this.cardToLose
            while(this.cardToLose != null && cardIndexToDestroy == this.cardsDiscarded.findIndex(isSameCard)){
                cardIndexToDestroy = getRandomInt(this.cardsDiscarded.length)
            }
            this.cardToLose = this.cardsDiscarded[cardIndexToDestroy]
            this.initRest()
        },
        initRest: function() {
            this.cardsToRestore = []
            this.cardsDiscarded.forEach(element => {
                if(element != this.cardToLose){
                    this.cardsToRestore.push(element)
                }
            });
        },
        reroll: function() {
            this.initShortRest()
            this.rerolling = true
        },
        rest: function() {
            //lose the chosen card
            indexOfCardToRemove = this.cardsDiscarded.indexOf(this.cardToLose);
            this.cardsDiscarded.splice(indexOfCardToRemove, 1);
            this.cardsDestroyed.push(this.cardToLose)

            //recover the discarded cards
            this.cardsDiscarded.forEach(card => {
                this.cardsInHand.push(card)
            });

            this.cardsDiscarded = []
            this.rerolling = false
            this.cardToLose = null

            this.$forceUpdate()
        },
        longRest: function() {
            this.rest()

            this.turn ++

            this.updateOnBoardCards()

            this.gearChosen.forEach(gear => {
                if (gear.played && ! gear.lost) {
                    gear.played = false
                }
            })

            //idk why, but the modal wont close normally if the button has a :disabled attribute
            $('#longRestModal').modal('hide')

            if (this.cardsInHand.length <2) {
                this.showRedAlert('You do not have enough cards in your hand to continue.')
            }
            this.$forceUpdate()
        },
        canRest: function() {
            return this.cardsDiscarded.length >= 2
        },
        pickCardToLoseLongRest: function(card) {
            this.cardToLose = card
            this.initRest()
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
            for(var i = this.cardsOnBoard.length -1; i >= 0 ; i--){
                card = this.cardsOnBoard[i]
                card.duration--;
                if(card.duration==0){
                    this.cardsDiscarded.push(card)
                    this.cardsOnBoard.splice(i, 1);
                }
            }
        },
        filterAbilities: function(evt) {
            this.filteredAbilities = []
            this.abilityCategory.cards.forEach(c => {
                if (c.name.includes(this.abilitySearchExp.toLowerCase())) {
                    this.filteredAbilities.push(c);
                }
            });
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
                        this.cardsInHand.pop(card)
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
