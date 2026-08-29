const { createEvent } = require("./events");

function runEdgeCase() {
  const refTime = Date.now();

  const eventA = {
    eventName: "alertaEvacuacion",
    eventType: "emergencia",
    delay: 1000,
  };

  const eventB = {
    eventName: "alertaSeguridad",
    eventType: "emergencia",
    delay: 1000,
  };

  console.log("\n--- CASO LÍMITE ---");
  console.log("Dos eventos tienen exactamente el mismo tiempo programado.");

  return new Promise((resolve) => {
    const register = [];

    setTimeout(() => {
      const event = createEvent(eventA, refTime);
      register.push(event);

      console.log("Ejecutado:", event.eventName);

      if (register.length === 2) {
        resolve(register);
      }
    }, eventA.delay);

    setTimeout(() => {
      const event = createEvent(eventB, refTime);
      register.push(event);

      console.log("Ejecutado:", event.eventName);

      if (register.length === 2) {
        resolve(register);
      }
    }, eventB.delay);
  }).then((register) => {
    console.log("\nResultado del caso límite:");

    console.table(
      register.map((event, index) => ({
        ordenEjecucion: index + 1,
        eventName: event.eventName,
        scheduledTime: event.scheduledTime,
        realTime: event.realTime,
        deviation: event.realTime - event.scheduledTime,
      }))
    );

    console.log(
      "\nPrimer evento ejecutado:",
      register[0].eventName
    );

    console.log(
      "Segundo evento ejecutado:",
      register[1].eventName
    );

    return register;
  });
}

module.exports = { runEdgeCase };