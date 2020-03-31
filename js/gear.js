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
            this.gearChosen.push(item)
        },
        removeGear: function(item) {
            var indexOfItemToRemove = this.gearChosen.indexOf(item)
            this.gearChosen.splice(indexOfItemToRemove, 1)
        }
    }
}