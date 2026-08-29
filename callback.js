const { events, createEvent } = require("./events");

// Convención error-first: el callback recibe siempre (error, evento).
function scheduleEvent(event, refTime, callback) {
  setTimeout(() => {
    try {
      callback(null, createEvent(event, refTime));
    } catch (error) {
      callback(error, null);
    }
  }, event.delay);
}

// Callbacks anidados. Cada evento se programa dentro del callback del
// anterior, así que el código crece en horizontal en lugar de hacia abajo y el
// manejo del error debe repetirse nivel por nivel: es el patrón conocido como
// callback hell.
function runCallbacks(onFinish) {
  const refTime = Date.now();
  const register = [];

  scheduleEvent(events[0], refTime, (error, firstEvent) => {
    if (error) return onFinish(error, register);
    register.push(firstEvent);

    scheduleEvent(events[1], refTime, (error, secondEvent) => {
      if (error) return onFinish(error, register);
      register.push(secondEvent);

      scheduleEvent(events[2], refTime, (error, thirdEvent) => {
        if (error) return onFinish(error, register);
        register.push(thirdEvent);

        scheduleEvent(events[3], refTime, (error, fourthEvent) => {
          if (error) return onFinish(error, register);
          register.push(fourthEvent);

          scheduleEvent(events[4], refTime, (error, fifthEvent) => {
            if (error) return onFinish(error, register);
            register.push(fifthEvent);

            scheduleEvent(events[5], refTime, (error, sixthEvent) => {
              if (error) return onFinish(error, register);
              register.push(sixthEvent);

              scheduleEvent(events[6], refTime, (error, seventhEvent) => {
                if (error) return onFinish(error, register);
                register.push(seventhEvent);

                scheduleEvent(events[7], refTime, (error, eighthEvent) => {
                  if (error) return onFinish(error, register);
                  register.push(eighthEvent);

                  onFinish(null, register);
                });
              });
            });
          });
        });
      });
    });
  });
}

module.exports = { runCallbacks };

