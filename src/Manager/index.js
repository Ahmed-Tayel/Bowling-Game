'use-strict';
const path = require('path')
const Frame = require(path.join(__dirname.split('src')[0], 'src','Models','Frame'))
const Errors = require(path.join(__dirname.split('src')[0], 'src','ErrorCodes'))

class Manager{
    constructor(){
        this.init();
    }

    reset(){
        this.init();
    }

    init(){
        this.frames = [];
        this.frames.push(new Frame(0,0,false,false))
        this.currentFrameNumber = 1;
        this.currentRollNumber = 1;
        this.done = false;
    }

    processInput(userInput){

        //Check if frame exists, otherwise create new frame
        var currentFrame;
        if(this.frames.length < this.currentFrameNumber){
            currentFrame = new Frame(0,0,false,false);
            this.frames.push(currentFrame);
        }
        else{
            currentFrame = this.frames[this.currentFrameNumber - 1]
        }

        //Check if roll is valid for an existed frame, as two non strike rolls must be less than or equall 10
        var frameScore = currentFrame.score + userInput;
        if((currentFrame.rolls == 1) && (currentFrame.score < 10) && (frameScore > 10)){
            throw new Error(Errors.Manager.INVALROLL)
        }

        //Record the roll
        currentFrame.rolls ++;
        currentFrame.score += userInput;
        
        //Enable Spare bonus if needed
        if(currentFrame.rolls == 2 && currentFrame.score == 10){
            currentFrame.spare = true;
        }

        //Enable Strike bonus if needed
        if(currentFrame.rolls == 1 && currentFrame.score == 10){
            currentFrame.strike = true;
        }

        //Add previous frame bonuses if needed
        if(this.currentFrameNumber > 1){
            //check for spare bonus
            if((this.frames[this.currentFrameNumber -2].spare == true) && (currentFrame.rolls == 1)){
                this.frames[this.currentFrameNumber -2].score += userInput;
            }
            //check for strike bonus
            else if((this.frames[this.currentFrameNumber -2].strike == true) && (currentFrame.rolls < 3)){
                this.frames[this.currentFrameNumber -2].score += userInput;
            }
        }

        //Check if the game is done
        if((this.currentFrameNumber == 10)
        && ((this.currentRollNumber == 3) ||
            (this.currentRollNumber == 2 && (currentFrame.spare == false || currentFrame.strike == true))
           )
          )
            {
                this.done = true;
            }

        //Increment rolls/frames
        if(this.currentFrameNumber < 10 && (this.currentRollNumber == 2 || currentFrame.strike == true)){
            this.currentFrameNumber ++
            this.currentRollNumber = 1;
        }
        else{
            this.currentRollNumber ++;
        }
    }

    gameIsDone(){
        return this.done;
    }

    getCurrentFrame(){
        return this.currentFrameNumber;
    }

    getCurrentRoll(){
        return this.currentRollNumber;
    }

    getTotalScore(){
        var finalScore = 0;
        this.frames.forEach((frame)=>{
            finalScore += frame.score
        })
        return finalScore
    }

}

module.exports = Manager