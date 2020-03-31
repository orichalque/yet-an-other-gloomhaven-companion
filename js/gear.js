var gearManagement = {
    data: {
        allGear : [],
        gearCategory : null
    },
    methods: {
        displayGearCategory: function(cat) {
            if (this.gearCategory == null) {
                this.gearCategory = cat
            } else {
                this.gearCategory = null
            }             
        }
    }
}