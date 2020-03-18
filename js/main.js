new Vue({
    el: '#app',
    data: {
        menu : 'home',
        acceptedCookies: false,
        modifiers : null,        
        modifierCategory: null,        
        modifiersChosen: [],
        abilities : null,
        abilityCategory: null,
        abilitiesChosen: [],
        twoAbilitiesSelected: [],
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
        play: function() {
            if (this.twoAbilitiesSelected.length != 2) {
                if(this.twoAbilitiesSelected.length == 0) {
                    this.showAlert('You need to build you deck in the Character Abilities section.')
                } else {
                    this.showAlert('You have to select two cards.')
                }
            } else {
                this.saveData()
                this.twoAbilitiesSelected.forEach(card => card.played = true)   
                this.twoAbilitiesSelected = []             
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
            
            oldAbilities = JSON.parse(Cookies.get("abilities"));
            oldAbilities.forEach(ability => {
                this.abilities.forEach(inDataBaseAbility => {
                    if (inDataBaseAbility.name === ability.name) {
                        abilitiesChosen.push(inDataBaseAbility)
                    }
                })
            })
            
            oldModifies = JSON.parse(Cookies.get("modifiers"));
        },
        getAcceptedCookie: function() {    
            console.log(Cookies.get('accepted'))
            return Cookies.get('accepted')
        },
        acceptCookie: function() {
            Cookies.set('accepted', true)
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

  