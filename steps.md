## Simulación algoritmo de planificación de procesos FCFS

### Descripción

El algoritmo de planificación de procesos FCFS (First Come, First Served) es un algoritmo de planificación de procesos que asigna a cada proceso un tiempo de CPU en el orden en que llegan. Es el algoritmo de planificación más simple y fácil de implementar. En este algoritmo, el proceso que llega primero es el primero en ser atendido.

### Objetivo

El objetivo de este algoritmo es simular el comportamiento de un planificador de procesos FCFS usando JavaScript.

### Implementación

Para la implementación de este algoritmo se creó una clase `FCFS` que contiene los siguientes métodos:

- `constructor()`: Inicializa la cola de procesos.
- `addProcess(process)`: Agrega un proceso a la cola.
- `run()`: Ejecuta el algoritmo de planificación de procesos FCFS.
- `print()`: Imprime el resultado de la simulación.

```javascript
class Process {
  constructor(name, arrivalTime, burstTime) {
    // Nombre del proceso
    this.name = name
    // Tiempo de llegada
    this.arrivalTime = arrivalTime
    // Tiempo de ráfaga (tiempo que necesita el proceso para completarse)
    this.burstTime = burstTime
    // Tiempo de inicio
    this.startTime = 0
    // Tiempo de finalización
    this.finishTime = 0
    // Tiempo de espera
    this.waitingTime = 0
    // Tiempo de retorno (tiempo que tarda el proceso en completarse desde su llegada)
    this.turnaroundTime = 0
  }
}
```

```javascript
class FCFS {
  constructor() {
    this.processes = []
  }

  addProcess(process) {
    this.processes.push(process)
  }

  run() {
    // Ordenar los procesos por tiempo de llegada
    this.processes.sort((a, b) => a.arrivalTime - b.arrivalTime)

    let currentTime = 0
    for (let i = 0; i < this.processes.length; i++) {
      const process = this.processes[i]

      // Calcular el tiempo de inicio
      process.startTime = Math.max(currentTime, process.arrivalTime)

      // Calcular el tiempo de finalización
      process.finishTime = process.startTime + process.burstTime

      // Calcular el tiempo de espera
      process.waitingTime = process.startTime - process.arrivalTime

      // Calcular el tiempo de retorno
      process.turnaroundTime = process.finishTime - process.arrivalTime

      currentTime = process.finishTime
    }
  }

  print() {
    console.table(this.processes)
  }
}
```

### Ejemplo

```javascript
const fcfs = new FCFS()
fcfs.addProcess(new Process('P1', 0, 5))
fcfs.addProcess(new Process('P2', 2, 3))
fcfs.addProcess(new Process('P3', 4, 1))
fcfs.run()
fcfs.print()
```
