## Simulación algoritmo de planificación de procesos FCFS

### Descripción

El algoritmo de planificación de procesos FCFS (First Come, First Served) es un algoritmo de planificación de procesos que asigna a cada proceso un tiempo de CPU en el orden en que llegan. Es el algoritmo de planificación más simple y fácil de implementar. En este algoritmo, el proceso que llega primero es el primero en ser atendido.

### Objetivo

El objetivo de este algoritmo es simular el comportamiento de un planificador de procesos FCFS usando JavaScript.

### Implementación

Para la implementación de este algoritmo se crearon las siguientes clases:
Una clase `Process` se utiliza para representar un proceso con los siguientes atributos:

- `name`: Nombre del proceso.
- `burstTime`: Tiempo de ráfaga del proceso.
- `arrivalTime`: Tiempo de llegada del proceso.
- `startTime`: Tiempo de inicio del proceso.
- `finishTime`: Tiempo de finalización del proceso.
- `waitingTime`: Tiempo de espera del proceso.
- `turnaroundTime`: Tiempo de retorno del proceso.

```javascript
class Process {
  constructor(name, burstTime) {
    this.name = name
    this.burstTime = burstTime
    this.arrivalTime = null
    this.startTime = null
    this.finishTime = null
    this.waitingTime = null
    this.turnaroundTime = null
  }
}
```

Una clase `FCFSScheduler` que se utiliza para simular el algoritmo de planificación de procesos FCFS. Esta clase tiene los siguientes métodos:

- `addProcess(process)`: Agrega un proceso a la cola de listos.
- `printQueueState()`: Imprime el estado actual de la cola de listos, el proceso en ejecución y los procesos completados.
- `drawProgressBar(current, total, barLength)`: Dibuja una barra de progreso para mostrar el estado de ejecución de un proceso.
- `executeProcess(process)`: Ejecuta un proceso y muestra una barra de progreso.
- `run()`: Inicia la simulación del algoritmo FCFS.
- `printResults()`: Imprime los resultados de la simulación, incluidos los tiempos de espera y retorno promedio de los procesos.

```javascript
class FCFSScheduler {
  constructor() {
    this.readyQueue = []
    this.executingProcess = null
    this.completedProcesses = []
    this.currentTime = 0
    this.isRunning = false
  }

  addProcess(process) {
    process.arrivalTime = this.currentTime
    this.readyQueue.push(process)
    console.log(
      `[Tiempo ${this.currentTime}] Proceso ${process.name} añadido a la cola de listos`
    )
    this.printQueueState()

    if (!this.isRunning) {
      this.run()
    }
  }

  printQueueState() {
    console.log('\nEstado actual del sistema:')
    console.log(
      'Cola de listos:',
      this.readyQueue.map(p => p.name).join(' <- ')
    )
    if (this.executingProcess) {
      console.log('En ejecución:', this.executingProcess.name)
    }
    console.log(
      'Procesos terminados:',
      this.completedProcesses.map(p => p.name).join(' <- ')
    )
    console.log('-------------------')
  }

  drawProgressBar(current, total, barLength = 30) {
    const progress = Math.round((current / total) * barLength)
    const filled = '█'.repeat(progress)
    const empty = '░'.repeat(barLength - progress)
    const percent = Math.round((current / total) * 100)
    return `[${filled}${empty}] ${percent}%`
  }

  async executeProcess(process) {
    this.executingProcess = process
    process.startTime = this.currentTime

    console.log(
      `\n[Tiempo ${this.currentTime}] Iniciando ejecución del proceso ${process.name}`
    )
    console.log(`Burst Time: ${process.burstTime} segundos`)
    console.log('\n')

    const frameWidth = 60

    for (let i = 1; i <= process.burstTime; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.currentTime++

      const progressBar = this.drawProgressBar(i, process.burstTime)
      const statusLine = `[Tiempo ${this.currentTime}] ${process.name} ejecutando... ${i}/${process.burstTime} segundos`

      const progressPadded = progressBar.padEnd(frameWidth - 4)
      const statusPadded = statusLine.padEnd(frameWidth - 4)

      console.log(
        '\x1b[36m' + '╔' + '═'.repeat(frameWidth - 2) + '╗' + '\x1b[0m'
      )
      console.log(
        '\x1b[36m' +
          '║ ' +
          '\x1b[33m' +
          progressPadded +
          '\x1b[36m' +
          ' ║' +
          '\x1b[0m'
      )
      console.log(
        '\x1b[36m' +
          '║ ' +
          '\x1b[32m' +
          statusPadded +
          '\x1b[36m' +
          ' ║' +
          '\x1b[0m'
      )
      console.log(
        '\x1b[36m' + '╚' + '═'.repeat(frameWidth - 2) + '╝' + '\x1b[0m'
      )
    }

    process.finishTime = this.currentTime
    process.waitingTime = process.startTime - process.arrivalTime
    process.turnaroundTime = process.finishTime - process.arrivalTime

    this.completedProcesses.push(process)
    this.executingProcess = null
    console.log(
      `\n\n[Tiempo ${this.currentTime}] Proceso: ${process.name} completado ✓`
    )
    this.printQueueState()
  }

  async run() {
    if (this.isRunning) return

    this.isRunning = true
    console.log('\nIniciando simulación FCFS...')

    while (this.readyQueue.length > 0) {
      const nextProcess = this.readyQueue.shift()
      await this.executeProcess(nextProcess)
    }

    this.isRunning = false
    this.printResults()
  }

  printResults() {
    console.log('\n\n====== Resultados de la simulación FCFS ======')
    console.table(
      this.completedProcesses.map(p => ({
        Proceso: p.name,
        'Tiempo de Ráfaga': p.burstTime,
        'Tiempo de Llegada': p.arrivalTime,
        'Tiempo de Inicio': p.startTime,
        'Tiempo de Finalización': p.finishTime,
        'Tiempo de Espera': p.waitingTime,
        'Tiempo de Retorno': p.turnaroundTime,
      }))
    )

    const avgWaitingTime =
      this.completedProcesses.reduce((sum, p) => sum + p.waitingTime, 0) /
      this.completedProcesses.length
    const avgTurnaroundTime =
      this.completedProcesses.reduce((sum, p) => sum + p.turnaroundTime, 0) /
      this.completedProcesses.length

    console.log(
      `\n\nTiempo de espera promedio: ${avgWaitingTime.toFixed(2)} segundos`
    )
    console.log(
      `Tiempo de retorno promedio: ${avgTurnaroundTime.toFixed(2)} segundos`
    )
  }
}
```
### Ejemplo de uso
```javascript
// Crear el planificador
const scheduler = new FCFSScheduler()

// Función para añadir un nuevo proceso
function addNewProcess(name, burstTime) {
  const process = new Process(name, burstTime)
  scheduler.addProcess(process)
}

console.log('Simulador FCFS iniciado!')
console.log("Para añadir procesos usa: addNewProcess('P1', 4)")
console.log(
  "Ejemplo: addNewProcess('P1', 4) - Crea el proceso P1 con tiempo de ráfaga de 4 segundos"
)
```

### Demostración grafica de la simulación

[Demo algoritmo FCFS](https://simulacion-algoritmo-de-planificacion-fcfs.vercel.app/)
