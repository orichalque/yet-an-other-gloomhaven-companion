var gearManagement = {
    data: {
        allGear : [],
        gearCategory : null,
        gearChosen: [],
        gearAlertMessage: "",
        idToAdd: null,
        filteredGear: [],
        gearSearchExp: ""
    },
    methods: {
        loadGearGameplayData: function () {
            gearCookie = Cookies.get('gear')
            if (gearCookie != null) {
                oldGear = JSON.parse(gearCookie)
                oldGear.forEach(gear => {
                    this.gearChosen.forEach(item => {
                        if (gear.name === item.name) {
                          item.played = gear.played
                          item.lost = gear.lost
                          item.used = gear.used
                        }
                    })
                })
            }
            this.$forceUpdate()
        },
        displayGearCategory: function(cat) {
            if (this.gearCategory == null) {
                this.gearCategory = cat
            } else {
                this.gearCategory = null
            }
        },
        addGear: function(item) {
            this.restoreItem(item)
            if (! this.gearChosen.includes(item)) {
                this.gearChosen.push(item)
            } else {
                this.removeGear(item)
            }

        },
        gearAlert: function(message) {
            showGreenAlert(message)
        },
        removeGear: function(item) {
            var indexOfItemToRemove = this.gearChosen.indexOf(item)
            this.gearChosen.splice(indexOfItemToRemove, 1)
        },
        looseItem: function(item) {
            item.played = true
            item.lost = true
            item.used = 0
            this.$forceUpdate()

        },
        tapItem: function(item) {
            item.played = true
            item.lost = false
            item.used = 0
            this.$forceUpdate()

        },
        restoreItem: function(item) {
            item.played = false
            item.lost = false
            item.used = 0
            this.$forceUpdate()
        },
        useItem: function(item) {
            if (item.used == null)
                item.used = 1
            else
                item.used += 1

            this.$forceUpdate()

        },
        addItemById: function() {
            var id = parseInt(this.idToAdd)
            var found = false
            this.allGear.forEach(cat => cat.items.forEach(item => {
                if ((item.points +1) == id) {
                    this.addGear(item)
                    found = true;
                }
            }))
            if(!found) {
                this.showRedAlert('Invalid ID')
            }
            this.idToAdd = ""
        },
        updateGearPosition: function(oldIndex, newIndex) {
            this.gearChosen.move(oldIndex, newIndex)
        },
        filterGear: function(evt) {
            
            this.filteredGear = []
            this.gearCategory = null

            if (this.gearSearchExp != "" && this.gearSearchExp != null) {
                this.allGear.forEach(cat => {
                    cat.items.forEach(item => {
                        if (item.name.includes(this.gearSearchExp)) {
                            this.filteredGear.push(item);
                        }
                    })
                })
            }
            
        }
    }
}
