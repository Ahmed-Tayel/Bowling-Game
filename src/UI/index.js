'use-strict';
const path = require('path')
const Errors = require(path.join(__dirname.split('src')[0], 'src','ErrorCodes'))
const messages = require('./UiMessages')
const Manager = require(path.join(__dirname.split('src')[0],'src','Manager','index'))

var prompt = require('prompt-promise');

class UI{
    
    constructor(){
        this.manager = new Manager();
        this.frame = 1;
        this.roll = 1;
        this.userInput = 0;
    }

    async startGame(){
        
        //Print welcome message
        console.log(messages.welcomeMsg);

        //Init Manager
        this.manager.reset();

        //Start the Game Rounds
        while(true){
            try{
                //Printing current game status
                console.log(" ")
                console.log(messages.gameStatusFrame + this.frame);
                console.log(messages.gameStatusRoll + this.roll);

                //Recieving user input, validating it, and changing it to a number
                this.userInput = await prompt(messages.userInput)
                this.validate(this.userInput);
                this.userInput = Number(this.userInput);

                //Send user input to the Manager
                this.manager.processInput(this.userInput);

                //Check if the game is finished to terminate, otherwise, play the next roll/round
                if(this.manager.gameIsDone()){
                    break;
                }
                else{
                    this.frame = this.manager.getCurrentFrame();
                    this.roll = this.manager.getCurrentRoll();
                }

            }
            catch(error){
                console.log("error: " + error.message);
            }
        }
        await prompt.done();

        //Print The final result
        console.log(messages.finalScore + this.manager.getTotalScore());
    }

    validate(userInput){
        const pattern = /^([0-9]|10)$/;
        const result = pattern.test(userInput);
        if(result == false){
            throw new Error(Errors.UI.INVALINPUT);
        }
    }
}

module.exports = UI