var enhancementManagement = {
    data: {
        cardToEnhance: null,
        plus1: null,
        baseEnhancements: [],
        elementEnhancements: [],
        debuffEnhancements: [],
        buffEnhancements: [],
        hex: null,
        jump: null,
        plus1top: false,
        plus1bottom: false,
        enhancementDisplay: '',
        enhancementMode: ''
    },
    methods: {
        addEnhancement : function(enhancement) {
            if (this.enhancementMode === 'top') {
                if (this.cardToEnhance.top == null) {
                    this.cardToEnhance.top = []                                        
                }
                this.cardToEnhance.top.push(enhancement)
                console.log(JSON.stringify(this.cardToEnhance))
            } 
            if (this.enhancementMode === 'bottom') {
                if (this.cardToEnhance.bottom == null) {
                    this.cardToEnhance.bottom = []
                }
                this.cardToEnhance.bottom.push(enhancement)
            }        
            this.$forceUpdate()

        },
        removeEnhancement: function(enhancement) {
            if (this.cardToEnhance.top != null) {
                var indexOfEnhancementToRemove = this.cardToEnhance.top.indexOf(enhancement)
                if (indexOfEnhancementToRemove >= 0) {
                    this.cardToEnhance.top.splice(indexOfEnhancementToRemove,1)
                }
            }
            
            if (this.cardToEnhance.bottom != null) {
                indexOfEnhancementToRemove = this.cardToEnhance.bottom.indexOf(enhancement)
                if (indexOfEnhancementToRemove >= 0) {
                    this.cardToEnhance.bottom.splice(indexOfEnhancementToRemove,1)
                }
            }          
            this.$forceUpdate()
  
        },
        setTopEnhancement : function(enhancement) {
            if (this.enhancementMode != 'Top') {
                this.enhancementMode = 'Top';
            } else {
                this.enhancementMode = ''
            }            
        },
        setBottomEnhancement : function(enhancement) {
            if (this.enhancementMode != 'Bottom') {
                this.enhancementMode = 'Bottom'
            } else {
                this.enhancementMode = ''
            }            
        }
    },
    beforeMount() {        
         
        enhancementsCategories.forEach(cat => {
            if (cat.name === "plus1") {
                this.plus1 = cat.enhancements[0]
            } else if (cat.name === "base") {
                this.baseEnhancements = cat.enhancements
            } else if (cat.name === "buffs") {
                this.buffEnhancements = cat.enhancements
            } else if (cat.name === "debuffs") {
                this.debuffEnhancements = cat.enhancements
            } else if (cat.name === "elements") {
                this.elementEnhancements = cat.enhancements
            } else if (cat.name === "hex") {
                this.hex = cat.enhancements[0]
            } else if (cat.name === "jump") {
                this.jump = cat.enhancements[0]
            }
        })    

        console.log(this.baseEnhancements)
    }
}
