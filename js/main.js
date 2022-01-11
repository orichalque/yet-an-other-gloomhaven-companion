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
        hasEnabledSaveGameplayData: true,
        showSpoiler: false,
        showLockedClasses: false,
        version: 'vanilla',
        alert: '',
        classChosen : false,
        dark: true,
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
                case 'crimsonscales':
                    console.log("loaded crimson scales")
                    this.loadDatabaseCrimsonScales()
                    this.allGear[0].items.forEach( g => {
                        g.name = g.name.replace(/\d+/g, '');
                        g.name = g.name.replace('-', '')
                        g.name = g.name.replaceAll('-', ' ');                    

                    })
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
        loadDatabaseCrimsonScales: function() {
            this.classNames = classNames_cs
            this.modifiers = attack_modifiers_categories_cs
            this.abilities = abilities_cs
            this.allGear = allItems_cs
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
            this.cardsInHand = []
            this.abilitiesChosen.forEach(card => {
                card.duration = 0
                this.cardsInHand.push(card)
            })
            this.cardsOnBoard = []
            this.cardsDiscarded = []
            this.cardsDestroyed = []

            this.gearChosen.forEach(item => {
                this.restoreItem(item);
            })

            this.resetBattlegoals()
            this.resetModifiers()

            this.turn = 1
            this.$forceUpdate()

        },
        buildData: function() {
            var data = new Object();
            console.log(this.abilityCategory.name)
            data.abilityCategoryName = this.abilityCategory.name

            data.abilitiesChosen = this.abilitiesChosen.map(card => {
                var cardToSave = new Object()
                cardToSave.name = card.name
                cardToSave.top = card.top
                cardToSave.bottom = card.bottom
                return cardToSave
            })
            data.modifiersChosen = this.modifiersChosen.map(mod => {
                var modifier = new Object()
                modifier.name = mod.name
                return modifier
            })
            data.gearChosen = this.gearChosen.map(gear => {
                var gearToSave = new Object()
                gearToSave.name = gear.name
                return gearToSave
            })

            data.classDisplayed = this.classDisplayed
            data.level = this.level

            data.options = new Object();
            data.options.hasEnabledModifierDisplay = this.hasEnabledModifierDisplay
            data.options.hasEnabledCardExchange = this.hasEnabledCardExchange
            data.options.hasOpenedXEnvelope = this.hasOpenedXEnvelope
            data.options.hasEnabledCurses = this.hasEnabledCurses
            data.options.version = this.version            
            data.options.dark = this.dark
            data.options.hasEnabledSaveGameplayData = this.hasEnabledSaveGameplayData
            
            return data
        }, 
        exportData: function() {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.buildData())));
            element.setAttribute('download', "save.json");          
            element.style.display = 'none';
            document.body.appendChild(element);          
            element.click();          
            document.body.removeChild(element);
        },
        importData: function() {
            $("#import-input").trigger("click")
        },
        readDataFile: async function(event) {
            const file = event.target.files.item(0)
            //const text = await file.text();
            file.text().then(value => {this.loadData(JSON.parse(value))})            
        },
        saveData: function() {
            var data = this.buildData()

            // character
            Cookies.set("class", JSON.stringify(data.abilityCategoryName), { expires: 365})
            Cookies.set("abilities", JSON.stringify(data.abilitiesChosen), { expires: 365 })
            Cookies.set("modifiers", JSON.stringify(data.modifiersChosen), { expires: 365 })
            Cookies.set("gear", JSON.stringify(data.gearChosen), { expires: 365 })
            Cookies.set("classDisplayed", JSON.stringify(data.classDisplayed), { expires: 365 })
            Cookies.set("level", JSON.stringify(data.level), { expires: 365 })
            
            // game options
            Cookies.set("hasEnabledModifierDisplay", JSON.stringify(data.options.hasEnabledModifierDisplay), { expires: 365 })
            Cookies.set("hasEnabledCardExchange", JSON.stringify(data.options.hasEnabledCardExchange), { expires: 365})
            Cookies.set("hasOpenedXEnvelope", JSON.stringify(data.options.hasOpenedXEnvelope), { expires: 365})
            Cookies.set("hasEnabledCurses", JSON.stringify(data.options.hasEnabledCurses), { expires: 365})
            Cookies.set("hasEnabledSaveGameplayData", JSON.stringify(data.options.hasEnabledSaveGameplayData), { expires: 365})
            Cookies.set("version", JSON.stringify(data.options.version), { expires: 365 })
            Cookies.set("darkMode", JSON.stringify(data.options.dark), { expires: 365 })

            if (data.options.hasEnabledSaveGameplayData) {
                this.saveGamePlayData()
            }

            this.showGreenAlert("Data saved!")
        },
        buildCookieData: function() {
            var data = new Object();

            var tmp = Cookies.get("class")
            if (tmp != null) {
                data.abilityCategoryName = JSON.parse(tmp)
            }
            tmp = Cookies.get("abilities")
            if (tmp != null) {
                data.abilitiesChosen = JSON.parse(tmp)
            }
            tmp = Cookies.get("modifiers")
            if (tmp != null) {
                data.modifiersChosen = JSON.parse(tmp)
            }
            tmp = Cookies.get("gear")
            if (tmp != null) {
                data.gearChosen = JSON.parse(tmp)
            }
            tmp = Cookies.get("classDisplayed")
            if (tmp != null) {
                data.classDisplayed = JSON.parse(tmp)
            }
            tmp = Cookies.get("level")
            if (tmp != null) {
                data.level = JSON.parse(tmp)
            }

            data.options = new Object();
            tmp = Cookies.get("hasEnabledModifierDisplay")
            if (tmp != null) {
                data.options.hasEnabledModifierDisplay = JSON.parse(tmp)
            }
            tmp = Cookies.get("hasEnabledCardExchange")
            if (tmp != null) {
                data.options.hasEnabledCardExchange = JSON.parse(tmp)
            }
            tmp = Cookies.get("hasOpenedXEnvelope")
            if (tmp != null) {
                data.options.hasOpenedXEnvelope = JSON.parse(tmp)
            }
            tmp = Cookies.get("hasEnabledCurses")
            if (tmp != null) {
                data.options.hasEnabledCurses = JSON.parse(tmp)
            }
            tmp = Cookies.get("version")
            if (tmp != null) {
                data.options.version = JSON.parse(tmp)
            }
            tmp = Cookies.get("dark")
            if (tmp != null) {
                data.options.dark = JSON.parse(tmp)
            }
            tmp = Cookies.get("hasEnabledSaveGameplayData")
            if (tmp != null) {
                data.options.hasEnabledSaveGameplayData = JSON.parse(tmp)
            }         

            return data
        },
        loadCookieData: function() {
            var data = this.buildCookieData()
            this.loadData(data)
        },
        loadData: function(data) {
            if (data.abilityCategoryName != null) {
                this.abilities.forEach( ability => {
                    if (ability.name == data.abilityCategoryName) {
                        this.displayAbilities(ability)
                        this.abilityCategory.hidden = false
                    }
                })
            }

            if (data.abilitiesChosen != null) {
                data.abilitiesChosen.forEach(ability => {
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

            if (data.modifiersChosen != null) {
                if (data.modifiersChosen != null) {
                    this.modifiersChosen = []
                    data.modifiersChosen.forEach(modifier => {

                        this.modifiersBase.forEach(cat => {
                            cat.cards.forEach(card => {
                                if (card.name === modifier.name) {
                                    this.modifiersChosen.push(card)
                                }
                            })
                        })

                        this.modifiersSpecial.forEach(catModif => {
                            catModif.cards.forEach(card => {
                                if (card.name === modifier.name) {
                                    this.modifiersChosen.push(card)
                                }
                            })
                        })

                        this.modifiers.forEach(catModif => {
                            catModif.cards.forEach(card => {
                                if (card.name === modifier.name) {
                                    this.modifiersChosen.push(card)
                                }
                            })
                        })
                    })
                }
            }

            if (data.gearChosen != null) {
                data.gearChosen.forEach(gear => {
                    this.allGear.forEach(cat => {
                        cat.items.forEach(item => {
                            if (gear.name === item.name) {
                                this.gearChosen.push(item)
                            }
                        })
                    })
                })
            }            

            if (data.classDisplayed != null) {
                this.classDisplayed = data.classDisplayed
                this.abilities.forEach(ab => {
                    if (this.classDisplayed.includes(ab.name)) {
                        ab.hidden = false
                    }
                })
            }
            
            if (data.level != null) {
                this.level = data.level
            }
            
            if (data.options.hasEnabledModifierDisplay != null) {
                this.hasEnabledModifierDisplay = data.options.hasEnabledModifierDisplay
            }
            
            if (data.options.hasEnabledCardExchange != null) {
                this.hasEnabledCardExchange = data.options.hasEnabledCardExchange
            }

            if (data.options.hasOpenedXEnvelope != null) {
                if (data.options.hasOpenedXEnvelope) {
                    this.loadXEnvelope()
                }
            }

            if (data.options.hasEnabledCurses != null) {
                this.hasEnabledCurses = data.options.hasEnabledCurses
            }

            if (data.options.version != null) {
                this.version = data.options.version
            }

            if (data.options.dark != null) {
                this.dark = data.options.dark
                this.initColorMode();
            }

            if (data.options.hasEnabledSaveGameplayData != null) {
                this.hasEnabledSaveGameplayData = data.options.hasEnabledSaveGameplayData
            }

            this.$forceUpdate()
            this.newGame();
        },
        saveGamePlayData: function () {
            Cookies.set("turn", JSON.stringify(this.turn), { expires: 365 })
            this.saveAbilityGameplayData()
            this.saveBattleGoalsGameplayData()
            this.saveModifierGameplayData()
        },
        loadGamePlayData: function () {
            theTurn = Cookies.get("turn")
            if (theTurn != null)
                this.turn = JSON.parse(theTurn)
            this.loadAbilityGameplayData()
            this.loadBattleGoalsGameplayData()
            this.loadGearGameplayData()
            this.loadModifierGamePlayData()
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
            draggableAbilities = []
            this.createSortableAbilities('abilitiesInHandSection', this.cardsInHand, draggableAbilities)
            this.createSortableAbilities('abilitiesOnBoardSection', this.cardsOnBoard, draggableAbilities)
            this.createSortableAbilities('abilitiesDiscardedSection', this.cardsDiscarded, draggableAbilities)
            this.createSortableAbilities('abilitiesDestroyedSection', this.cardsDestroyed, draggableAbilities)
            return draggableAbilities
        },
        createSortableAbilities: function(id, abilities, collection){
            if (document.getElementById(id)) {
                collection.push(
                    new Sortable(document.getElementById(id), {
                        animation: 150,
                        onUpdate: (event) => { this.updateCardPosition(abilities, event.oldIndex, event.newIndex) }
                    })
                )
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
        initColorMode() {
            if (this.dark) {
                document.body.classList.add('bg-dark')
                document.body.classList.remove('bg-light')
            } else {
                document.body.classList.add('bg-light')
                document.body.classList.remove('bg-dark')
            }
            this.$forceUpdate()
        },
        swapMode() {
            this.dark = !this.dark;
            this.initColorMode(); 
        }
    },
    beforeMount(){
        this.loadDatabase()
        this.loadCookieData()
        this.initColorMode()
        if (this.hasEnabledSaveGameplayData) {
            this.loadGamePlayData()
        }
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
