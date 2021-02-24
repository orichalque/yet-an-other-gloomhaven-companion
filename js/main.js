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
        hasEnabledCurses: true,
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
        setMenu: function (param) {
            this.menu = param
            if(param == 'home'){
                this.$nextTick(() => { this.draggableAbilities(), this.draggableGear() })
            }
        },
        switchClass: function() {
            this.classChosen = false;
            this.abilityCategory = null;
            this.abilitiesChosen = [];
        },
        loadDatabase: function() {
            //versionCookie = Cookies.get('version')
            versionCookie = Cookies.get('version')
            if (versionCookie != null)
                try {
                    this.loadDatabaseVersion(JSON.parse(versionCookie))
                } catch(e) {
                    console.log("could not load the version")
                    this.loadDatabaseVersion("vanilla")
                }
            else 
                this.loadDatabaseVersion("vanilla")

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
        },
        loadDatabaseVersion: function(param){
            this.version = param
            this.gearCategory = null

            switch(param){
                case 'vanilla':
                    console.log("loaded vanilla")
                    this.loadDatabaseVanilla()
                    break
                case 'jotl':
                    console.log("loaded jotl")
                    this.loadDatabaseJotl()
                    break
                case 'frosthaven':
                    console.log("loaded frosthaven")
                    this.loadDatabaseFrosthaven()
                    break
                default:
                    console.log("loaded vanilla by default")
                    this.version = 'vanilla'
                    this.loadDatabaseVanilla()
            }
        },
        loadDatabaseVanilla: function() {
            this.classNames = classNames
            this.modifiers = attack_modifiers_categories          
            this.abilities = abilities
            this.allGear = allItems
        },
        loadDatabaseFrosthaven: function() {
            this.classNames = classNames_frosthaven
            this.modifiers =  attack_modifiers_categories_frosthaven
            this.abilities = abilities_frosthaven
            this.allGear = allItems_frosthaven // empty 
        },
        loadDatabaseJotl: function() {
            this.classNames = classNames_jotl
            this.modifiers = attack_modifiers_categories_jotl        
            this.abilities = abilities_jotl
            this.allGear = allItems_jotl
        },
        loadXEnvelope: function() {   
            if (! this.hasOpenedXEnvelope) {
                console.log("loading x envelope")
                this.modifiers.push(XEnvelopeModifiers)
                this.abilities.push(XEnvelopeAbilities)
                this.hasOpenedXEnvelope = true
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
            
            this.resetBattlegoals()
            this.resetModifiers()
            
            this.turn = 1            
            this.$forceUpdate()

        },
        saveData: function() {                        
            // character
            if (this.abilityCategory != null)
                Cookies.set("class", JSON.stringify(this.abilityCategory.name), { expires: 365})                                    

            Cookies.set("abilities", JSON.stringify(this.abilitiesChosen), { expires: 365 })
            Cookies.set("modifiers", JSON.stringify(this.modifiersChosen), { expires: 365 })
            Cookies.set("gear", JSON.stringify(this.gearChosen), { expires: 365 })    
            
            Cookies.set("classDisplayed", JSON.stringify(this.classDisplayed), { expires: 365 })

            // game options
            Cookies.set("hasEnabledModifierDisplay", JSON.stringify(this.hasEnabledModifierDisplay), { expires: 365 })
            Cookies.set("hasEnabledCardExchange", JSON.stringify(this.hasEnabledCardExchange), { expires: 365})
            Cookies.set("hasOpenedXEnvelope", JSON.stringify(this.hasOpenedXEnvelope), { expires: 365})
            Cookies.set("hasEnabledCurses", JSON.stringify(this.hasEnabledCurses), { expires: 365})            
            Cookies.set("version", JSON.stringify(this.version), { expires: 365 })            

            this.showGreenAlert("Data saved!")       
        },
        loadData: function() {
            openedX = Cookies.get("hasOpenedXEnvelope")
            if (openedX != null) {
                XEnvelope = JSON.parse(openedX)
                if (XEnvelope) {
                    this.loadXEnvelope()
                }
            }                

            classCookie = Cookies.get('class')
            if (classCookie != null) {
                theClass = JSON.parse(classCookie)   
                this.abilities.forEach( ability => {
                    if (ability.name == theClass) {
                        this.displayAbilities(ability)                                                                        
                        this.abilityCategory.hidden = false                        
                    }
                })                             
            }

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
            
            cardExchange = Cookies.get("hasEnabledCardExchange")
            if (cardExchange != null)
                this.hasEnabledCardExchange = JSON.parse(cardExchange)

            modifierDisplay = Cookies.get("hasEnabledModifierDisplay")
            if (modifierDisplay != null)
                this.hasEnabledModifierDisplay = JSON.parse(modifierDisplay)
            
            curseEnabled = Cookies.get("hasEnabledCurses")
            if (curseEnabled != null) {
                this.hasEnabledCurses = JSON.parse(curseEnabled)
            }

            classNotHidden = Cookies.get("classDisplayed")
            if (classNotHidden != null) {
                this.classDisplayed = JSON.parse(classNotHidden)
                this.abilities.forEach(ab => {
                    if (this.classDisplayed.includes(ab.name)) {
                        ab.hidden = false
                    }
                })
            }

            this.$forceUpdate()
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
            $('#redAlert').modal('show')            
        },
        showGreenAlert: function(alert){
            this.alert = alert
            $('#greenAlert').modal('show')         
        },
        draggableAbilities: function() {
            if (document.getElementById('abilities')) {
                new Sortable(document.getElementById('abilities'), {
                    animation: 150,
                    onUpdate: (event) => { this.updateCardPosition(event.oldIndex, event.newIndex) }
                });
            }            
        },
        draggableModifiers: function() {
            if (document.getElementById('sortableModifiers') != null)  {
                new Sortable(document.getElementById('sortableModifiers'), {
                    animation: 150,
                    onEnd: (event) => { 
                        this.updateModifierPosition(event.oldIndex, event.newIndex);
                        if (event.newIndex < this.cardsToDisplayCurrent) { // we move a modif in the visibility area
                            if (event.oldIndex >= this.cardsToDisplayCurrent) // the card comes from the outside
                                this.cardsToDisplayCurrent = event.newIndex 
                        }
    
                        if (event.newIndex >= this.cardsToDisplayCurrent) { // we move a modif outside of the visibility area
                            if (event.oldIndex < this.cardsToDisplayCurrent)
                                this.cardsToDisplayCurrent --
                        }
                    }
                });
            }            
        },
        draggableGear: function() {
            if (document.getElementById('gear') != null ) {
                new Sortable(document.getElementById('gear'), {
                    animation: 150,
                    onUpdate: (event) => { this.updateGearPosition(event.oldIndex, event.newIndex) }
                });
            }
        },
        updateModifiersDraggable(){
            this.$nextTick(() => { this.draggableModifiers() })
        },
    }, 
    beforeMount(){
        this.loadDatabase()
        this.loadData()
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            this.isMobile = true
        }
    },
    mounted() { this.$nextTick(() => { this.draggableAbilities(), this.draggableGear() })},
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
