const DEVIATION_LIMIT = 100;

function deviation(event) {
  return event.realTime - event.scheduledTime;
}

function averageLatency(register) {
  const total = register.reduce((sum, event) => sum + deviation(event), 0);
  return total / register.length;
}

function delayedEventNames(register) {
  return register
    .filter((event) => deviation(event) > DEVIATION_LIMIT)
    .map((event) => event.eventName);
}

function firstOutOfOrderEvent(register) {
  // Se ordena una copia para no mutar la bitácora original.
  const expectedOrder = [...register].sort((a, b) => a.scheduledTime - b.scheduledTime);
  return register.find((event, index) => expectedOrder[index].eventName !== event.eventName);
}

function printReport(styleName, register) {
  const outOfOrder = firstOutOfOrderEvent(register);

  console.log(`\n--- Bitácora Final (${styleName}) ---`);
  console.table(register.map((event) => ({ ...event, deviation: deviation(event) })));
  console.log(`Latencia promedio: ${averageLatency(register).toFixed(2)} ms`);
  console.log(`Eventos con desvío mayor a ${DEVIATION_LIMIT} ms:`, delayedEventNames(register).join(", "));
  console.log("Primer evento fuera de orden:", outOfOrder ? outOfOrder.eventName : "ninguno");
}

module.exports = { printReport };
