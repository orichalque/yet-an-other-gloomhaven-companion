new Vue({
    el: '#app',
    mixins: [gearManagement, abilitiesManagement, modifiersManagement, enhancementManagement, battleGoalsManagement],
    data: {
        /* Platform information */
        menu : 'home',
        acceptedCookies: false,
        isMobile: false,        
        hasOpenedXEnvelope: false,
        hasEnabledCardExchange: false,
        showSpoiler: false,
        showLockedClasses: false,
        version: 'vanilla',
        alert: '',        
        classChosen : false,

        /* General game information */ 
        turn: 1,
        level: 1,
        specialClassMode : '',
        specialClassValue : 0,
    },
    methods: {
        set: function (param) {
            this.menu = param
        },
        switchClass: function() {
            this.classChosen = false;
            this.abilityCategory = null;
            this.abilitiesChosen = [];
        },
        loadDatabase: function() {
            versionCookie = Cookies.get('version')      
            console.log(versionCookie)      
            if (versionCookie != null) {
                this.loadDatabaseVersion(versionCookie)
            } else {
                this.loadDatabaseVersion('vanilla')
            }

            this.modifiersSpecial = attack_modifiers_special
            this.modifiersBase = attack_modifiers_base
            this.modifiersBase.forEach(cat => {
                cat.cards.forEach(modif => {
                    this.modifiersChosen.push(modif)
                })
            })
            this.modifiersDrawPile = this.modifiersChosen.slice() 
            this.allGear = allItems
            this.battleGoals = battle_goals
            this.loadDatabaseVersion(this.version)
        },
        loadDatabaseVersion: function(param){
            this.version = param
            
            switch(param){
                case 'vanilla':
                    this.loadDatabaseVanilla()
                    break
                case 'jotl':
                    this.loadDatabaseJotl()
                    break
                case 'frosthaven':
                    this.loadDatabaseFrosthaven()
                    break
                default:
                    console.log("default")
                    this.loadDatabaseVanilla()
                    break
            }
        },
        loadDatabaseVanilla: function() {
            this.classNames = classNames
            this.modifiers = attack_modifiers_categories          
            this.abilities = abilities
        },
        loadDatabaseFrosthaven: function() {
            this.classNames = classNames_frosthaven
            this.modifiers =  attack_modifiers_categories_frosthaven
            this.abilities = abilities_frosthaven
        },
        loadDatabaseJotl: function() {
            this.classNames = classNames_jotl
            this.modifiers = attack_modifiers_categories_jotl        
            this.abilities = abilities_jotl
        },
        loadXEnvelope: function() {
            if (! this.hasOpenedXEnvelope) {            
                console.log("Enabled")                    
                this.hasOpenedXEnvelope = true
                this.modifiers.push(XEnvelopeModifiers)
                this.abilities.push(XEnvelopeAbilities)
            }
        },
        enableCardExchange: function() {
            this.hasEnabledCardExchange = !this.hasEnabledCardExchange 
        },
        newGame: function() {
            this.abilitiesChosen.forEach(card => {
                card.played = false
                card.destroyed = false
                card.duration = 0
            })

            this.gearChosen.forEach(item => {
                this.restoreItem(item);
            })

            this.resetModifiers()
            
            this.turn = 1            
            this.$forceUpdate()

        },
        saveData: function() {
            Cookies.set("version", this.version, { expires: 365 })
            Cookies.set("abilities", JSON.stringify(this.abilitiesChosen), { expires: 365 })
            Cookies.set("modifiers", JSON.stringify(this.modifiersChosen), { expires: 365 })
            Cookies.set("gear", JSON.stringify(this.gearChosen), { expires: 365 })    
            this.showGreenAlert("Data saved!")       
        },
        loadData: function() {
            abilityCookie = Cookies.get('abilities')

            if (abilityCookie != null) {
                oldAbilities = JSON.parse(abilityCookie)
                oldAbilities.forEach(ability => {
                    this.abilities.forEach(cat => {
                        cat.cards.forEach(card => {
                            if (card.name === ability.name) {
                                if (ability.top != null) {
                                    card.top = ability.top
                                }
                                if (ability.bottom != null) {
                                    card.bottom = ability.bottom
                                }
                                this.abilitiesChosen.push(card)
                            }
                        })
                    })
                })
            }
            
            gearCookie = Cookies.get('gear')
            if (gearCookie != null) {
                oldGear = JSON.parse(gearCookie)
                oldGear.forEach(gear => {
                    this.allGear.forEach(cat => {
                        cat.items.forEach(item => {
                            if (gear.name === item.name) {
                                this.gearChosen.push(item)
                            }
                        })
                    })
                })
            }

            modifierCookie = Cookies.get("modifiers");
            if (modifierCookie != null) {
                var oldModifiers = JSON.parse(modifierCookie);
                if (oldModifiers != null) {
                    this.modifiersChosen = []
                    oldModifiers.forEach(modifier => {

                        this.modifiersBase.forEach(cat => {
                            cat.cards.forEach(modif => {
                                if (modif.name === modifier.name) {
                                    this.modifiersChosen.push(modif)
                                    this.modifiersDrawPile.push(modif)    
                                }
                            })
                        })
                        
                        
                        this.modifiersSpecial.forEach(catModif => {
                            catModif.cards.forEach(modif => {
                                if (modif.name === modifier.name) {
                                    this.modifiersChosen.push(modif)
                                    this.modifiersDrawPile.push(modif)                                
                                }
                            })
                        })
                        
                        this.modifiers.forEach(catModif => {
                            catModif.cards.forEach(card => {
                                if (card.name === modifier.name) {
                                    this.modifiersChosen.push(card)                                
                                    this.modifiersDrawPile.push(card)                                    
                                }
                            })                            
                        })
                    })
                    
                    this.modifiersDrawPile = this.modifiersChosen.slice()
                }
               
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
        dismissAlert: function(alert) {
            $(alert).hide()
        },
        showGreenAlert: function(alert){
            this.alert = alert
            $('#greenAlert').show()            
        },
        dismissGreenAlert: function(alert) {
            $('#greenAlert').hide()
        },
        draggableAbilities: function() {
            new Sortable(document.getElementById('abilities'), {
                animation: 150,
                onUpdate: (event) => { this.updateCardPosition(event.oldIndex, event.newIndex) }
            });
        },
        draggableModifiers: function() {
            new Sortable(document.getElementById('sortableModifiers'), {
                animation: 150,
                onEnd: (event) => { 
                    this.updateModifierPosition(event.oldIndex, event.newIndex);
                    if (event.newIndex > this.cardsToDisplayCurrent && (this.cardsToDisplayCurrent > 0)) {
                        this.cardsToDisplayCurrent --
                    } else if (event.oldIndex >= this.cardsToDisplayCurrent) {
                        this.cardsToDisplayCurrent = event.newIndex
                    }                                   
                }
            });
        },
    }, 
    beforeMount(){
        this.loadDatabase()
        this.loadData()
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.isMobile = true
        }
    },
    mounted() { this.$nextTick(() => { this.draggableAbilities() })},
    updated() { this.$nextTick(() => { this.draggableAbilities() })},
    mounted() { this.$nextTick(() => { this.draggableModifiers() })},
    updated() { this.$nextTick(() => { this.draggableModifiers() })},
  })

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

const $dropdown = $(".dropdown");
const $dropdownToggle = $(".dropdown-toggle");
const $dropdownMenu = $(".dropdown-menu");
const showClass = "show";
 
$(window).on("load resize", function() {
  if (this.matchMedia("(min-width: 768px)").matches) {
    $dropdown.hover(
      function() {
        const $this = $(this);
        $this.addClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "true");
        $this.find($dropdownMenu).addClass(showClass);
      },
      function() {
        const $this = $(this);
        $this.removeClass(showClass);
        $this.find($dropdownToggle).attr("aria-expanded", "false");
        $this.find($dropdownMenu).removeClass(showClass);
      }
    );
  } else {
    $dropdown.off("mouseenter mouseleave");
  }
});
