var gearManagement = {
    data: {
        allGear : [],
        gearCategory : null,
        gearChosen: []
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
            this.gearChosen.push(item)
        },
        removeGear: function(item) {
            var indexOfItemToRemove = this.gearChosen.indexOf(item)
            this.gearChosen.splice(indexOfItemToRemove, 1)
        },
        looseItem: function(item) {
            item.played = true
            item.lost = true
            this.$forceUpdate()

        },
        tapItem: function(item) {
            item.played = true
            item.lost = false
            this.$forceUpdate()

        },
        restoreItem: function(item) {
            item.played = false
            item.lost = false
            this.$forceUpdate()
        }
    }
}