new Vue({
    el: '#app',
    data: {
        menu : 'home',
        modifiers : null,
        abilities : null,
        modifierCategory: null,
        abilityCategory: null
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
            character = null
            abilities.forEach(elem => {
                if(elem.name.endsWith('-back')) {                    
                    if (character != null) {
                        this.abilities.push(character)
                    }
                    character = {name: '', abilities: []}         
                    character.name = elem.name.substring(0,2)             
                    character.abilities = []                                                             
                }
                character.abilities.push(elem)
            })
        }
    }, 
    beforeMount(){
        this.loadDatabase()
    }
  })