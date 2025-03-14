const form = document.querySelector("#transaction-form");
const transactionList = document.querySelector("#transaction-list");
const balanceEl = document.querySelector("#balance");
const incomeEl = document.querySelector("#income");
const expenseEl = document.querySelector("#expense");

let transacciones = [];

function getDataFromForm() {
  const description = document.querySelector("#description").value;
  const amount = parseFloat(document.querySelector("#amount").value);
  const type = document.querySelector("input[name='type']:checked").value;
  return { description, amount, type };
}

function createMovement(movement) {
  const nuevoMovimiento = new Movimiento(movement.type, movement.amount, movement.description);
  const validacion = nuevoMovimiento.validarMovimiento();
  
  if (validacion.ok) {
    transacciones.push(nuevoMovimiento);
    updateTransactionList();
    updateTotals();
    form.reset();
  } else {
    alert(validacion.message);
  }
}

function updateTotals() {
  let totalIncome = 0;
  let totalExpense = 0;
  
  transacciones.forEach(transaccion => {
    if (transaccion.tipo === "income") {
      totalIncome += transaccion.monto;
    } else {
      totalExpense += transaccion.monto;
    }
  });
  
  let balance = totalIncome - totalExpense;
  
  balanceEl.textContent = `$${balance.toFixed(2)}`;
  incomeEl.textContent = `$${totalIncome.toFixed(2)}`;
  expenseEl.textContent = `$${totalExpense.toFixed(2)}`;
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  const newMovement = getDataFromForm();
  createMovement(newMovement);
});

function Movimiento(tipo, monto, descripcion) {
  this.tipo = tipo;
  this.monto = monto;
  this.descripcion = descripcion;
  const now = new Date();
  this.fecha = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} - ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

Movimiento.prototype.render = function (index) {
  const esEgreso = this.tipo === "expense";
  const colorTexto = esEgreso ? "text-red-600" : "text-green-600";
  const fondoFila = esEgreso ? "bg-red-100" : "bg-green-100";
  const signo = esEgreso ? "-" : "+";
  
  return `
    <tr class="${fondoFila} transition duration-300">
      <td class="px-4 py-3 font-medium">${this.descripcion}</td>
      <td class="px-4 py-3 ${colorTexto} font-bold">${signo}$${Math.abs(this.monto).toFixed(2)}</td>
      <td class="px-4 py-3 text-gray-500">${this.fecha}</td>
      <td class="px-4 py-3 text-right">
        <button class="text-blue-500 hover:text-blue-700" onclick="editTransaction(${index})">✏️</button>
        <button class="text-red-500 hover:text-red-700 ml-2" onclick="deleteTransaction(${index})">✖</button>
      </td>
    </tr>
  `;
};

Movimiento.prototype.validarMovimiento = function () {
  if (this.monto <= 0 || isNaN(this.monto)) {
    return { ok: false, message: "El monto debe ser un número mayor a 0" };
  }
  if (this.descripcion.trim() === "") {
    return { ok: false, message: "Debe completar la descripción" };
  }
  if (!["income", "expense"].includes(this.tipo)) {
    return { ok: false, message: "El tipo de movimiento es inválido" };
  }
  return { ok: true, message: "Movimiento agregado correctamente" };
};

function deleteTransaction(index) {
  transacciones.splice(index, 1);
  updateTransactionList();
  updateTotals();
}

function editTransaction(index) {
  const movimiento = transacciones[index];
  const newDescription = prompt("Editar descripción:", movimiento.descripcion);
  const newAmount = parseFloat(prompt("Editar monto:", movimiento.monto));
  
  if (newDescription !== null && newAmount > 0) {
    movimiento.descripcion = newDescription;
    movimiento.monto = newAmount;
    updateTransactionList();
    updateTotals();
  } else {
    alert("Valores inválidos.");
  }
}

function updateTransactionList() {
  transactionList.innerHTML = transacciones.map((mov, index) => mov.render(index)).join("");
}


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