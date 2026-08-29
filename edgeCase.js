const { createEvent } = require("./events");

// Ambas alertas quedan programadas para el mismo instante: es el escenario que
// pone a prueba el criterio de desempate del event loop.
const SHARED_DELAY = 1000;

const evacuationAlert = {
  eventName: "alertaEvacuacion",
  eventType: "emergencia",
  delay: SHARED_DELAY,
};

const securityAlert = {
  eventName: "alertaSeguridad",
  eventType: "emergencia",
  delay: SHARED_DELAY,
};

function runEdgeCase() {
  const refTime = Date.now();
  const register = [];
  const executionTrace = [];

  console.log("\n--- CASO LIMITE ---");
  console.log("Dos alertas comparten exactamente el mismo tiempo programado.");

  return new Promise((resolve) => {
    // La macrotarea registra el evento y la microtarea encadenada confirma la
    // alerta, para observar en qué momento se drena cada cola.
    function schedule(alert, done) {
      setTimeout(() => {
        const event = createEvent(alert, refTime);
        register.push(event);
        executionTrace.push(`macrotarea: ${event.eventName}`);

        Promise.resolve().then(() => {
          executionTrace.push(`microtarea: confirmacion de ${event.eventName}`);
          done();
        });
      }, alert.delay);
    }

    function checkCompletion() {
      if (register.length === 2) {
        resolve({ register, executionTrace });
      }
    }

    schedule(evacuationAlert, checkCompletion);
    schedule(securityAlert, checkCompletion);
  }).then(({ register: log, executionTrace: trace }) => {
    console.log("\nResultado del caso limite:");

    console.table(
      log.map((event, index) => ({
        executionOrder: index + 1,
        eventName: event.eventName,
        scheduledTime: event.scheduledTime,
        realTime: event.realTime,
        deviation: event.realTime - event.scheduledTime,
      })),
    );

    console.log("\nOrden real de vaciado de las colas:");
    trace.forEach((step, index) => console.log(`${index + 1}. ${step}`));

    console.log("\nPrimera alerta ejecutada:", log[0].eventName);
    console.log("Segunda alerta ejecutada:", log[1].eventName);

    return log;
  });
}

module.exports = { runEdgeCase };