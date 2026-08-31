const { events } = require("./events");

const { scheduleEvent } = require("./promises");
 
async function runAsyncAwait() {
  const refTime = Date.now();
  const register = [];
 

  try {

    for (const event of events) {
      register.push(await scheduleEvent(event, refTime));
    }
  } catch (error) {
    console.error("Error en la simulación de async/await:", error.message);
  }
 
  return register;
}
 
module.exports = { runAsyncAwait };
