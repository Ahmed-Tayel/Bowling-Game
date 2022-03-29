'use-strict';
const path = require('path')
const UI = require(path.join(__dirname.split('src')[0], 'src','UI','index'))

async function main(){
    var userInterface = new UI();
    await userInterface.startGame();
}

main();
