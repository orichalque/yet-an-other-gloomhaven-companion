new Vue({
    el: '#app',
    data: {
        menu : 'home',
        turn: 1,
        acceptedCookies: false,
        modifiers : null,        
        modifierCategory: null,        
        modifiersChosen: [],
        modifiersDrawPile: [],
        lastDrawnModifier: null,
        abilities : null,
        abilityCategory: null,
        abilitiesChosen: [],        
        twoAbilitiesSelected: [],
        abilitiesOnBoard: [],
        longRestMode: false,
        abilityAlert: ''
    },
    methods: {
        set: function (param) {
            this.menu = param
        },
        displayModifiers: function(param) {
            if (this.modifierCategory == param) {
                this.modifierCategory = null
            } else {
                this.modifierCategory = param
            }
        },
        displayAbilities: function(param) {
            if (this.abilityCategory == param) {
                this.abilityCategory = null
            } else {
                this.abilityCategory = param
            }
        },
        loadDatabase: function() {
            this.modifiers = []
            this.abilities = []
            modifiers = database.attack_modifiers 
            abilities = database.characters_abilities
            currentId = null

            modifier = null
            modifiers.forEach(elem => {
                id = elem.name.substring(0,5)
                if (id.endsWith('-')) {
                    id = elem.name.substring(0,4)
                }
                if (id != currentId) {                
                    if ( modifier != null) {
                        this.modifiers.push(modifier)
                    }

                    currentId = id           
                    modifier = {name : id, cards : []}                    
                }
                modifier.cards.push(elem)
            })
            this.modifiers.push(modifier)

            character = null
            abilities.forEach(elem => {
                if(elem.name.endsWith('-back')) {                    
                    if (character != null) {
                        this.abilities.push(character)
                    }
                    character = {name: '', cards: []}         
                    character.name = elem.name.substring(0,2)                                        
                }
                character.cards.push(elem)                
            })

            this.abilities.push(character)

        },
        addModifier: function(card) {   
            this.modifiersChosen.push(card)
            this.modifiersDrawPile.push(card)
        },
        removeModifier: function(card) {
            indexOfCardToRemove = this.abilitiesChosen.indexOf(card)
            this.modifiersChosen.splice(indexOfCardToRemove, 1)
            this.modifiersDrawPile.splice(indexOfCardToRemove, 1)
        },
        drawModifier: function() {
            var randomint = getRandomInt(this.modifiersDrawPile.length)
            this.lastDrawnModifier = this.modifiersDrawPile[randomint]
            this.modifiersDrawPile.splice(randomint,1)
        },
        shuffleModifiersDeck: function() {
            for(let i = this.modifiersChosen.length - 1; i > 0; i--){
                this.modifiersDrawPile.push(this.modifiersChosen[i])
            }
            this.lastDrawnModifier = null
        },
        addAbility: function(card) {   
            card.duration = 0
            this.abilitiesChosen.push(card)
        },
        removeAbility: function(card) {
            indexOfCardToRemove = this.abilitiesChosen.indexOf(card)
            this.abilitiesChosen.splice(indexOfCardToRemove, 1)
        },
        newGame: function() {
            this.abilitiesChosen.forEach(card => {
                card.played = false
                card.destroyed = false
                card.duration = 0
            })

            //TODO: shuffle modifiers
            this.turn = 1            
            this.$forceUpdate()

        },
        shortRest: function() {
            if (this.abilitiesChosen != null && this.abilitiesChosen.filter(card => card.played).length >0) {
                var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed))
                var cardIndexToDestroy = getRandomInt(cardsPlayed.length)    
                cardsPlayed[cardIndexToDestroy].destroyed = true
                cardsPlayed.splice(cardIndexToDestroy, 1)
                cardsPlayed.forEach(card => card.played = false)
                
                if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                    this.showAlert('You do not have enough cards in your end to continue.')
                }
            }   
            this.$forceUpdate()
        },
        longRest: function() {
            if (this.abilitiesChosen != null && this.abilitiesChosen.filter(card => card.played).length >0) {
                this.longRestMode = true    
            }            
        },
        destroyLongRestCard: function(card) {
            card.destroyed = true
            var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed))
            cardsPlayed.forEach(card => card.played = false)
            
            if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                this.showAlert('You do not have enough cards in your end to continue.')
            }
            this.longRestMode = false
            this.$forceUpdate()
        },
        pickCard: function(card) {
            if (this.twoAbilitiesSelected.length < 2) {
                this.twoAbilitiesSelected.push(card)
            } else {
                this.showAlert('You already picked two cards')                        
            }            
        },
        cancelCard: function(card) {
            this.twoAbilitiesSelected.pop(card)     
        },
        fetchCard: function(card) {
            card.played = false
            card.destroyed = false
            this.$forceUpdate()
        },
        destroyCard: function(card) {
            card.destroyed = true
            this.$forceUpdate()
        },
        keepAbilityOneTurn(card) {
            card.duration = 1
            this.$forceUpdate()
        },
        keepAbilityManyTurns(card) {
            card.duration = -1
            this.$forceUpdate()
        },
        play: function() {
            if (this.twoAbilitiesSelected.length != 2) {
                if(this.abilitiesChosen.length == 0) {
                    this.showAlert('You need to build you deck in the Abilities section.')
                } else {
                    this.showAlert('You have to select two cards.')
                }
            } else {
                this.twoAbilitiesSelected.forEach(card => card.played = true)   
                this.twoAbilitiesSelected = []             
                this.abilitiesChosen.filter(elem => elem.duration > 0).forEach(elem => elem.duration --)
                this.turn ++
                this.$forceUpdate()
            }            
        },
        showAlert: function(alert){
            this.abilityAlert = alert
            $('#abilityAlert').show()            
        },
        dismissAlert: function(alert) {
            $('#abilityAlert').hide()
        },
        saveData: function() {
            Cookies.set("abilities", JSON.stringify(this.abilitiesChosen))
            Cookies.set("modifiers", JSON.stringify(this.modifiersChosen))            
        },
        loadData: function() {
            abilityCookie = Cookies.get('abilities')
            if (abilityCookie != null) {
                oldAbilities = JSON.parse(abilityCookie)
                oldAbilities.forEach(ability => {
                    this.abilities.forEach(inDataBaseAbility => {
                        inDataBaseAbility.cards.forEach(card => {
                            if (card.name === ability.name) {                        
                                this.abilitiesChosen.push(card)
                            }
                        })                   
                    })
                })
            }
            
            modifierCookie = Cookies.get("modifiers");
            if (modifierCookie != null) {
                oldModifies = JSON.parse(modifierCookie);
            }

            this.newGame();
            
        },
        getAcceptedCookie: function() {    
            return Cookies.get('accepted')
        },
        acceptCookie: function() {
            Cookies.set('accepted', 'true')
            this.$forceUpdate()
        }
    }, 
    beforeMount(){
        this.loadDatabase()
        this.loadData()
    }
  })

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  