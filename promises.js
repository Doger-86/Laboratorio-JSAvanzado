const { events, createEvent } = require("./events");

function scheduleEvent(event, refTime) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(createEvent(event, refTime)), event.delay);
  });
}

// Promesas encadenadas: cada .then devuelve la promesa del siguiente evento,
// así que la ejecución queda secuencial. Un único .catch al final cubre el
// fallo de cualquiera de los ocho eventos de la cadena.
function runPromises() {
  const refTime = Date.now();
  const register = [];

  return events
    .reduce(
      (chain, event) =>
        chain
          .then(() => scheduleEvent(event, refTime))
          .then((record) => register.push(record)),
      Promise.resolve(),
    )
    .then(() => register)
    .catch((error) => {
      console.error("Error en la simulación de promesas:", error.message);
      return register;
    });
}

module.exports = { scheduleEvent, runPromises };
