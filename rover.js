const Message = require('./message.js');
const Command = require('./command.js');

class Rover {
   // Write code here!
   constructor(position) {
      this.position = position;
      this.mode = "NORMAL";
      this.generatorWatts = 110;
   }

   receiveMessage(message) {
      let finalResult = {
         message: message.name,
         results: message.commands
      };

      // new Command('STATUS_CHECK')
      let resultOne = {
         completed: true, 
         roverStatus: {
            mode: this.mode,
            generatorWatts: this.generatorWatts,
            position: this.position
         }
      };
      let resultTwo = {completed: true};
      let resultThree = {completed: false};

      for (let i = 0; i < finalResult.results.length; i++) {
         if (finalResult.results[i].commandType === 'STATUS_CHECK') {
            finalResult.results.splice(i, 1, resultOne);
         } else if (finalResult.results[i].commandType === 'MODE_CHANGE' && finalResult.results[i].value === 'NORMAL') {
            resultOne.roverStatus.mode = "NORMAL";
            finalResult.results.splice(i, 1, resultTwo);
         } else if (finalResult.results[i].commandType === 'MODE_CHANGE' && finalResult.results[i].value === 'LOW_POWER') {
            resultOne.roverStatus.mode = "LOW_POWER";
            finalResult.results.splice(i, 1, resultTwo);
         } else if (finalResult.results[i].commandType === 'MOVE' && resultOne.roverStatus.mode === "NORMAL") {
            resultOne.roverStatus.position = finalResult.results[i].value;;
            finalResult.results.splice(i, 1, resultTwo);
         } else if (finalResult.results[i].commandType === 'MOVE' && resultOne.roverStatus.mode === "LOW_POWER") {
            finalResult.results.splice(i, 1, resultThree);
         }
      }
      
      return finalResult;
   }
}

module.exports = Rover;

let commands = [new Command('MOVE', 4321), new Command('STATUS_CHECK')];
let message = new Message('Test message with two commands', commands);
let rover = new Rover(98382);    // Passes 98382 as the rover's position.
let response = rover.receiveMessage(message);

console.log(response.results);