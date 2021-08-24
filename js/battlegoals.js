var battleGoalsManagement = {
    data: {
        /* Battle Goals information */
        battleGoals : [],
        battleGoalsDrawn : [],
        battleGoalPicked : [],
        goalCounter : 0
    },
    methods: {
        saveBattleGoalsGameplayData: function () {
            Cookies.set("battleGoalsDrawn", JSON.stringify(this.battleGoalsDrawn), { expires: 365 })
            Cookies.set("battleGoalPicked", JSON.stringify(this.battleGoalPicked), { expires: 365 })
            Cookies.set("goalCounter", JSON.stringify(this.goalCounter), { expires: 365 })
        },
        loadBattleGoalsGameplayData: function () {
            // Load drawn battle goals
            battleGoalsDrawnCookie = Cookies.get('battleGoalsDrawn')
            if (battleGoalsDrawnCookie != null) {
                this.battleGoalsDrawn = []
                oldBattleGoalsDrawn = JSON.parse(battleGoalsDrawnCookie)
                oldBattleGoalsDrawn.forEach(drawnGoal => {
                    this.battleGoals.forEach(goal => {
                        if (goal.name === drawnGoal.name) {
                            this.battleGoalsDrawn.push(goal)
                        }
                    })
                })
            }

            // Load picked battle goals
            battleGoalPickedCookie = Cookies.get('battleGoalPicked')
            if (battleGoalPickedCookie != null) {
                this.battleGoalPicked = []
                oldBattleGoalPicked = JSON.parse(battleGoalPickedCookie)
                oldBattleGoalPicked.forEach(pickedGoal => {
                    this.battleGoals.forEach(goal => {
                        if (goal.name === pickedGoal.name) {
                            this.battleGoalPicked.push(goal)
                        }
                    })
                })
            }

            // Load battle goal counter
            goalCounterCookie = Cookies.get("goalCounter")
            if (goalCounterCookie != null)
                this.goalCounter = JSON.parse(goalCounterCookie)

            this.$forceUpdate()
        },
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
