const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {
  // 7 tests here!
  test("constructor sets position and default values for mode and generatorWatts", function() {
    let testRover = new Rover(98382);
    expect(testRover).toEqual({position: 98382, mode: "NORMAL", generatorWatts: 110});
  });

  test("response returned by receiveMessage contains the name of the message", function() {
    let testCommands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("STATUS_CHECK")];
    let testMessage = new Message("Test message with two commands", testCommands);
    let testRover = new Rover(98382);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.message).toBe("Test message with two commands");
  });

  test("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let testCommands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("STATUS_CHECK")];
    let testMessage = new Message("Test message with two commands", testCommands);
    let testRover = new Rover(98382);
    let testResponse = testRover.receiveMessage(testMessage);
    expect(testResponse.results).toBe(testCommands);
  });

  test("responds correctly to the status check command", function() {
    let testCommands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("STATUS_CHECK")];
    let testMessage = new Message("Test message with two commands", testCommands);
    let testRover = new Rover(98382);
    let testResponse = testRover.receiveMessage(testMessage);
    let result =  {
      completed: true, 
      roverStatus: { mode: 'LOW_POWER', generatorWatts: 110, position: 98382 }
   };
    expect(testResponse.results[1]).toEqual(result);
  });

  test("responds correctly to the mode change command", function() {
    let testCommands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("STATUS_CHECK")];
    let testMessage = new Message("Test message with two commands", testCommands);
    let testRover = new Rover(98382);
    let testResponse = testRover.receiveMessage(testMessage);
    let result =  [
      { completed: true },
      {
        completed: true,
        roverStatus: { mode: 'LOW_POWER', generatorWatts: 110, position: 98382 }
      }
    ]
    expect(testResponse.results).toEqual(result);
  });

  test("responds with a false completed value when attempteding to move in LOW_POWER mode", function() {
    let testCommands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE")];
    let testMessage = new Message("Test message with two commands", testCommands);
    let testRover = new Rover(98382);
    let testResponse = testRover.receiveMessage(testMessage);
    let result = [ { completed: true }, { completed: false } ];
    expect(testResponse.results).toEqual(result);
  });

  test("responds with the position for the move command", function() {
    let testCommands = [new Command("MOVE", 4321), new Command('STATUS_CHECK')];
    let testMessage = new Message("Test message with two commands", testCommands);
    let testRover = new Rover(98382);
    let testResponse = testRover.receiveMessage(testMessage);
    let result = [
      { completed: true },
      {
        completed: true,
        roverStatus: { mode: 'NORMAL', generatorWatts: 110, position: 4321 }
      }
    ]
    expect(testResponse.results).toEqual(result);
  });

});
