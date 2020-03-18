new Vue({
    el: '#app',
    data: {
        menu : 'home',
        modifiers : null,
        abilities : null,
        modifierCategory: null,
        abilityCategory: null,
        abilitiesChosen: [],
        modifiersChosen: []
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
        }
    }, 
    beforeMount(){
        this.loadDatabase()
    }
  })