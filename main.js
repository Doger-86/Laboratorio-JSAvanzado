const { runAsyncAwait } = require("./asyncAwait");
const { runCallbacks } = require("./callback");
const { runEdgeCase } = require("./edgeCase");
const { printReport } = require("./eventLog");
const { runPromises } = require("./promises");

// El simulador de callbacks se envuelve en una promesa solo aquí, para poder
// esperar las cuatro simulaciones con la misma sintaxis.
function runCallbacksAsPromise() {
  return new Promise((resolve, reject) => {
    runCallbacks((error, register) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(register);
    });
  });
}

async function main() {
  try {
    printReport("Callbacks", await runCallbacksAsPromise());
    printReport("Promesas", await runPromises());
    printReport("Async/Await", await runAsyncAwait());
    await runEdgeCase();
  } catch (error) {
    console.error("Error en la simulación:", error.message);
  }
}

main();
