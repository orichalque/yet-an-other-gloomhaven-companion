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
        showLockedClasses: false,
        version: 'vanilla',
        alert: '',        
        classChosen : false,
        /* General game information */ 
        turn: 1,
        level: 1
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
            this.modifiersSpecial = attack_modifiers_special
            this.modifiersChosen = this.modifiersBase.slice()
            this.modifiersDrawPile = this.modifiersBase.slice() 
            this.allGear = allItems
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
            Cookies.set("gear", JSON.stringify(this.gearChosen))    
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
                oldModifies = JSON.parse(modifierCookie);
                //TODO
                oldModifies.forEach(modifier => {
                    attack_modifiers_base
                    attack_modifiers_special
                    attack_modifiers_categories
                })
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