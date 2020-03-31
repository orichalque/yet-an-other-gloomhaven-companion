new Vue({
    el: '#app',
    mixins: [gearManagement, abilitiesManagement, modifiersManagement],
    data: {
        /* Platform information */
        menu : 'home',
        acceptedCookies: false,
        isMobile: false,        
        hasOpenedXEnvelope: false,
        showSpoiler: false,
        version: 'vanilla',
        alert: '',        
        /* General game information */ 
        turn: 1,
        level: 1    
    },
    methods: {
        set: function (param) {
            this.menu = param
        },        
        loadDatabase: function() {
            this.modifiersBase = attack_modifiers_base
            this.modifiersChosen = this.modifiersBase.slice()
            this.modifiersDrawPile = this.modifiersBase.slice()
            this.modifiersSpecial = attack_modifiers_special
            this.modifiers = attack_modifiers_categories
            this.abilities = abilities
            this.allGear = allItems
        },
        loadXEnvelope: function() {
            if (! this.hasOpenedXEnvelope) {            
                console.log("Enabled")                    
                this.hasOpenedXEnvelope = true
                this.modifiers.push(XEnvelopeModifiers)
                this.abilities.push(XEnvelopeAbilities)
            }
        },
        newGame: function() {
            this.abilitiesChosen.forEach(card => {
                card.played = false
                card.destroyed = false
                card.duration = 0
            })

            this.shuffleModifiersDeck()
            this.turn = 1            
            this.$forceUpdate()

        },
        saveData: function() {
            Cookies.set("abilities", JSON.stringify(this.abilitiesChosen))
            Cookies.set("modifiers", JSON.stringify(this.modifiersChosen))    
            this.showGreenAlert("Data saved!")       
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
        },
        showRedAlert: function(alert){
            this.alert = alert
            $('#redAlert').show()            
        },
        dismissRedAlert: function(alert) {
            $('#redAlert').hide()
        },
        showGreenAlert: function(alert){
            this.alert = alert
            $('#greenAlert').show()            
        },
        dismissGreenAlert: function(alert) {
            $('#greenAlert').hide()
        }
    }, 
    beforeMount(){
        this.loadDatabase()
        this.loadData()
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.isMobile = true
        }
    }
  })

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

