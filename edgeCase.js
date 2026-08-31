const { createEvent } = require("./events");
const { printReport } = require("./eventLog");
 

const SHARED_DELAY = 1000;
 
const alerts = [
  { eventName: "alertaEvacuacion", eventType: "emergencia", delay: SHARED_DELAY },
  { eventName: "alertaSeguridad", eventType: "emergencia", delay: SHARED_DELAY },
  { eventName: "alertaPuntoEncuentro", eventType: "emergencia", delay: SHARED_DELAY },
];
 

const FAILING_ALERT = "alertaSeguridad";
 
function confirmAlert(alert) {
  return Promise.resolve().then(() => {
    if (alert.eventName === FAILING_ALERT) {
      throw new Error(`sin canal disponible para ${alert.eventName}`);
    }
  });
}
 
function runSimultaneousAlerts(orderedAlerts) {
  const refTime = Date.now();
  const register = [];
  const trace = [];
 
  return new Promise((resolve) => {
    orderedAlerts.forEach((alert) => {
      setTimeout(() => {
        trace.push(`macrotarea: ${alert.eventName}`);
 
        confirmAlert(alert)
          .then(() => {
            register.push(createEvent(alert, refTime));
            trace.push(`microtarea: confirmada ${alert.eventName}`);
          })
          .catch((error) => {
            register.push(createEvent(alert, refTime, "fallido"));
            trace.push(`microtarea: fallo de ${alert.eventName} (${error.message})`);
          })
          .then(() => {
            if (register.length === orderedAlerts.length) {
              resolve({ register, trace });
            }
          });
      }, alert.delay);
    });
  });
}
 
function printTrace(title, trace) {
  console.log(`\n${title}`);
  trace.forEach((step, index) => console.log(`${index + 1}. ${step}`));
}
 
function runEdgeCase() {
  console.log("\n--- CASO LIMITE ---");
  console.log("Tres alertas comparten el mismo tiempo programado y la confirmación");
  console.log(`de ${FAILING_ALERT} falla dentro de su microtarea.`);
 
  return runSimultaneousAlerts(alerts)
    .then(({ register, trace }) => {
      printTrace("Orden real de vaciado de las colas:", trace);
      printReport("Caso límite", register);
 

      return runSimultaneousAlerts([...alerts].reverse());
    })
    .then(({ register, trace }) => {
      console.log("\n--- CONTROL: mismo caso con el orden de registro invertido ---");
      printTrace("Orden real de vaciado de las colas:", trace);
      console.log(
        "Orden de ejecución:",
        register.map((event) => event.eventName).join(" -> "),
      );
 
      return register;
    });
}
 
module.exports = { runEdgeCase };