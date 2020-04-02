var gearManagement = {
    data: {
        allGear : [],
        gearCategory : null,
        gearChosen: [],
        gearAlertMessage: "",
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

            if (item.type === "consumable") {
                // check with level
                var numberOfConsumableWore = this.gearChosen.filter(chosenItem => chosenItem.type === "consumable").length
                if (numberOfConsumableWore < Math.ceil(this.level / 2)) {
                    this.gearChosen.push(item)
                } else {                    
                    this.gearAlert("You cannot hold more than "+Math.ceil(this.level / 2)+" consumables.")
                }
            } else if (item.type === "2H") {      
                if (this.gearChosen.filter(chosenItem => chosenItem.type === "2H").length == 0 && this.gearChosen.filter(chosenItem => chosenItem.type === "1H") == 0){
                    this.gearChosen.push(item)
                } else {
                    this.gearAlert("You are already using a weapon.")
                }
            } else if (item.type === "1H") {
                if (this.gearChosen.filter(chosenItem => chosenItem.type === "1H").length < 2 && this.gearChosen.filter(chosenItem => chosenItem.type === "2H").length == 0) {
                    this.gearChosen.push(item)
                } else {
                    this.gearAlert("You cannot hold more than two 1-handed weapons, or one 2-handed weapon.")
                }
            } else if (this.gearChosen.filter(chosenItem => chosenItem.type === item.type).length == 0) {
                this.gearChosen.push(item)
            } else {
                this.gearAlert("You cannot hold more than one item of this kind.")
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

        }
    }
}
