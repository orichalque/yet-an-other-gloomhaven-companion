var gearManagement = {
    data: {
        allGear : [],
        gearCategory : null,
        gearChosen: [],
        gearAlertMessage: "",
        idToAdd: 0
    },
    methods: {
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
            this.gearAlertMessage = message
            $("#gearAlert").show()
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
            console.log(item.used)
            if (item.used == null) 
                item.used = 1
            else 
                item.used += 1
                
            this.$forceUpdate()

        },
        addItemById: function() {
            var id = parseInt(this.idToAdd)
            this.allGear.forEach(cat => cat.items.forEach(item => {
                if ((item.points +1) == id) {
                    this.addGear(item)
                }
            }))
        }
    }
}
