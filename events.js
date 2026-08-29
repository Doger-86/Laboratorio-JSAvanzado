// Los ocho avisos del simulador. El orden de la lista no sigue el orden de los
// retardos, para que la bitácora pueda mostrar eventos fuera de orden.
const events = [
  { eventName: "eventOne", eventType: "aviso largo", delay: 500 },
  { eventName: "eventTwo", eventType: "aviso largo", delay: 530 },
  { eventName: "eventThree", eventType: "aviso corto", delay: 300 },
  { eventName: "eventFour", eventType: "aviso largo", delay: 450 },
  { eventName: "eventFive", eventType: "aviso largo", delay: 470 },
  { eventName: "eventSix", eventType: "aviso largo", delay: 1200 },
  { eventName: "eventSeven", eventType: "aviso largo", delay: 600 },
  { eventName: "eventEight", eventType: "aviso corto", delay: 150 },
];

function createEvent(event, refTime, status = "completado") {
  return {
    eventName: event.eventName,
    eventType: event.eventType,
    scheduledTime: refTime + event.delay,
    realTime: Date.now(),
    status,
  };
}

module.exports = { events, createEvent };
