new Vue({
    el: '#app',
    data: {
        menu : 'home',
        modifiers : null,        
        modifierCategory: null,        
        modifiersChosen: [],
        abilities : null,
        abilityCategory: null,
        abilitiesChosen: [],
        twoAbilitiesSelected: [],
        longRestMode: false
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
        addAbility: function(card) {   
            this.abilitiesChosen.push(card)
        },
        removeAbility: function(card) {
            this.abilitiesChosen.pop(card)
        },
        newGame: function() {
            this.abilitiesChosen.forEach(card => {
                card.played = false
                card.destroyed = false
            })
            this.$forceUpdate()

        },
        shortRest: function() {
            var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed))
            var cardIndexToDestroy = getRandomInt(cardsPlayed.length)    
            cardsPlayed[cardIndexToDestroy].destroyed = true
            cardsPlayed.splice(cardIndexToDestroy, 1)
            cardsPlayed.forEach(card => card.played = false)
            
            if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                this.showAlert('#notEnoughCards')
            }

            this.$forceUpdate()
        },
        longRest: function() {
            this.longRestMode = true
        },
        destroyLongRestCard: function(card) {
            card.destroyed = true
            var cardsPlayed = this.abilitiesChosen.filter( card => (card.played && !card.destroyed))
            cardsPlayed.forEach(card => card.played = false)
            
            if (this.abilitiesChosen.filter(card => !card.played && !card.destroyed).length <2) {
                this.showAlert('#notEnoughCards')
            }
            this.longRestMode = false
            this.$forceUpdate()
        },
        pickCard: function(card) {
            if (this.twoAbilitiesSelected.length < 2) {
                this.twoAbilitiesSelected.push(card)
            } else {
                this.showAlert('#tooManyCardsInHand')                        
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
        play: function() {
            if (this.twoAbilitiesSelected.length != 2) {
                this.showAlert('#notEnoughCardsPicked')
            } else {
                this.twoAbilitiesSelected.forEach(card => card.played = true)   
                this.twoAbilitiesSelected = []             
                this.$forceUpdate();
            }            
        },
        showAlert: function(alert){
            $(alert).show()            
        },
        dismissAlert: function(alert) {
            $(alert).hide()
        }     
    }, 
    beforeMount(){
        this.loadDatabase()
    }
  })

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }