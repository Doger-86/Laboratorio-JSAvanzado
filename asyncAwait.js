const { events } = require("./events");
// Se reutiliza el temporizador de promesas: async/await consume las mismas
// promesas, solo que con otra sintaxis.
const { scheduleEvent } = require("./promises");

async function runAsyncAwait() {
  const refTime = Date.now();
  const register = [];

  // for...of y no map porque cada evento debe esperar a que termine el
  // anterior; map dispararía los ocho temporizadores en paralelo.
  for (const event of events) {
    register.push(await scheduleEvent(event, refTime));
  }

  return register;
}

module.exports = { runAsyncAwait };


