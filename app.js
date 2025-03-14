const form = document.querySelector("form");
const transactionList = document.querySelector("#transaction-list");

const transacciones = [];

function getDataFromForm() {
  const formData = new FormData(form);
  const description = formData.get("description");
  const amount = formData.get("amount");
  const type = formData.get("type");

  return {
    description,
    amount,
    type,
  };
}

function createMovement(movement) {
  const nuevoMovimiento = new Movimiento(
    movement.type,
    movement.amount,
    movement.description
  );

  const validacion = nuevoMovimiento.validarMovimiento();

  if (validacion.ok) {
    transacciones.push(nuevoMovimiento);
    nuevoMovimiento.render();
    alert(validacion.message);
    form.reset();
  } else {
    alert(validacion.message);
  }
}

// escuchamos el evento submit
form.addEventListener("submit", function (event) {
  // ejecutamos los pasos para guardar la información
  event.preventDefault();

  const newMovement = getDataFromForm();
  createMovement(newMovement);
});

// 1 -> Ingreso
// 2 -> Egreso
function Movimiento(tipo, monto, descripcion) {
  this.tipo = tipo;
  this.monto = monto;
  this.descripcion = descripcion;
  this.fecha = new Date();
}

Movimiento.prototype.render = function () {
  const esEgreso = this.tipo === "expense";
  const colorTexto = esEgreso ? "text-red-600" : "text-green-600";
  const colorFondo = esEgreso ? "bg-red-50" : "bg-green-50";
  const signo = esEgreso ? "-" : "+";

  const newRow = `
    <tr class="hover:${colorFondo} ${colorFondo}/30 transition-colors duration-200">
      <td class="px-4 py-3 font-medium">${this.descripcion}</td>
      <td class="px-4 py-3 ${colorTexto} font-bold">${signo}$${Math.abs(
    this.monto
  ).toFixed(2)}</td>
      <td class="px-4 py-3 text-gray-500">${this.fecha}</td>
      <td class="px-4 py-3">
        <span class="inline-block rounded-full px-3 py-1 text-xs ${colorFondo} ${colorTexto}">
          ${this.tipo}
        </span>
      </td>
    </tr>
  `;
  transactionList.innerHTML += newRow;
};

// Retorne un boolean (true | false)
Movimiento.prototype.validarMovimiento = function () {
  // validar que el monto sea > 0
  if (this.monto <= 0) {
    return {
      ok: false,
      message: "El monto debe ser mayor a 0",
    };
  }

  // validar que descripcion no este vacio
  // vacio === ""
  // trim() remover espacios "hola como estas"
  if (this.descripcion.trim() === "") {
    return {
      ok: false,
      message: "Debe completar la descripcion",
    };
  }
  // solo aceptamos 1 y 2
  if (!["income", "expense"].includes(this.tipo)) {
    return {
      ok: false,
      message: "El valor tipo es erroneo",
    };
  }

  return {
    ok: true,
    message: "Moviento validado correctamente",
  };
};

// function registrarIngresoOEgreso() {
//   while (true) {
//     const descripcion = prompt("Ingrese la nueva transacción");
//     const tipoDeTransaccion = prompt(
//       "Escoja el tipo de transacción \n1) Ingreso\n2) Egreso\n\n Solo debe poner el número de la opción"
//     );
//     const monto = prompt("Ingrese el monto de la transacción");
//     // antes de insertar el moviento al arreglo debo crear el objeto y ejecutar la validacion
//     const moviento = new Movimiento(
//       tipoDeTransaccion,
//       Number(monto),
//       descripcion
//     );

//     const validacion = moviento.validarMovimiento();

//     if (!validacion.ok) {
//       alert(validacion.message);
//     } else {
//       // si es true entonces agregamo el moviento a transacciones
//       transacciones.push(moviento);
//       // llamar a movieminto.render()
//     }

//     // transacciones.push({
//     //   transaccion,
//     //   tipoDeTransaccion,
//     //   monto,
//     //   fechaDeCreacion: new Date(),
//     // });

//     const confirmacion = confirm("Desea agregar otra transacción?");
//     // ok => true: continuar con otra transaccion
//     // cancel => false: terminar la transaccion
//     // en que caso deberiamos detener el while
//     if (confirmacion === false) {
//       // detener el while
//       break;
//     }
//   }
// }

// function mapTransactionNames() {
//   const names = transacciones.map(function (transaccion) {
//     return transaccion.transaccion;
//   });
//   console.log(names);
// }

// function filterTransactions() {
//   // condiciones egreso y > 100
//   const filtroDeDatos = transacciones.filter(
//     (transaccion) =>
//       transaccion.monto > 100 && transaccion.tipoDeTransaccion === "2"
//   );
//   console.log(filtroDeDatos);
// }

// registrarIngresoOEgreso();