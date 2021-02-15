var battleGoalsManagement = {
    data: {
        /* Battle Goals information */
        battleGoals : [],
        battleGoalsDrawn : [],
        battleGoalPicked : [],
        goalCounter : 0  
    },
    methods: { 
        drawBattleGoals: function() {
            this.battleGoalsDrawn = []
            this.battleGoalPicked = []

            var randomint = getRandomInt(this.battleGoals.length)
            var randomint2 = getRandomInt(this.battleGoals.length)
            while (randomint == randomint2) {
                randomint2 = getRandomInt(this.battleGoals.length)
            }
            this.battleGoalsDrawn.push(this.battleGoals[randomint])
            this.battleGoalsDrawn.push(this.battleGoals[randomint2])
        },
        pickBattleGoal: function(battleGoal) {
            this.battleGoalsDrawn = []
            this.battleGoalPicked = []

            this.battleGoalPicked.push(battleGoal)
            this.goalCounter = 0
        },
        incrementGoalCounter: function(){
            this.goalCounter+=1;
        },
        resetBattlegoals: function() {            
            this.battleGoalsDrawn = []
            this.battleGoalPicked = []
            this.goalCounter = 0
        }
    }
}