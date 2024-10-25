import React, { useEffect, useState } from 'react'

class Process {
  constructor(name, arrivalTime, burstTime) {
    this.name = name
    this.arrivalTime = arrivalTime
    this.burstTime = burstTime
    this.startTime = 0
    this.finishTime = 0
    this.waitingTime = 0
    this.turnaroundTime = 0
    this.status = 'waiting' // waiting, running, completed
  }

  ramdon() {
    // Generate a random process
    const randomInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min
    const randomName = `Proceso ${randomInt(1, 100)}`
    const randomArrivalTime = randomInt(0, 10)
    const randomBurstTime = randomInt(1, 10)
    return new Process(randomName, randomArrivalTime, randomBurstTime)
  }
}

const FCFSVisualization = () => {
  const [processes, setProcesses] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1000) // milliseconds per tick

  // Initialize processes
  useEffect(() => {
    const initialProcesses = [
      new Process('Proceso 1', 0, 5),
      new Process('Proceso 2', 2, 3),
      new Process('Proceso 3', 4, 1),
    ]
    setProcesses(initialProcesses)
  }, [])

  // Animation loop
  useEffect(() => {
    let timer
    if (isRunning) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          const newTime = prev + 1
          updateProcessesStatus(newTime)
          return newTime
        })
      }, speed)
    }

    return () => clearInterval(timer)
  }, [isRunning, speed])

  const addRamdonProcess = () => {
    setProcesses(prev =>
      [...prev, new Process().ramdon()].toSorted(
        (a, b) => a.arrivalTime - b.arrivalTime
      )
    )
  }

  const updateProcessesStatus = time => {
    setProcesses(prevProcesses => {
      const updatedProcesses = [
        ...prevProcesses.toSorted((a, b) => a.arrivalTime - b.arrivalTime),
      ]
      let currentRunning = false

      updatedProcesses.forEach(process => {
        if (process.status === 'completed') return

        if (process.arrivalTime <= time) {
          if (!currentRunning && process.status !== 'completed') {
            if (process.status !== 'running') {
              process.startTime = time
              process.finishTime = time + process.burstTime
            }
            process.status = 'running'
            currentRunning = true
          } else {
            process.status = 'waiting'
          }
        }

        if (process.status === 'running' && time >= process.finishTime) {
          process.status = 'completed'
          currentRunning = false
        }
      })

      return updatedProcesses
    })
  }

  const resetSimulation = () => {
    setIsRunning(false)
    setCurrentTime(0)
    setProcesses(prev =>
      prev.map(p => ({
        ...p,
        status: 'waiting',
        startTime: 0,
        finishTime: 0,
      }))
    )
  }

  const getProcessesByStatus = status => {
    return processes.filter(p => p.status === status)
  }

  return (
    <div className='p-4 space-y-6 w-full max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <div className='space-x-2'>
          <button
            onClick={() => setIsRunning(!isRunning)}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button
            onClick={resetSimulation}
            className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600'
          >
            Reiniciar
          </button>
          <button
            onClick={() => addRamdonProcess()}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            Agregar proceso
          </button>
        </div>
        <div className='text-lg font-semibold'>Tiempo: {currentTime}</div>
      </div>

      <div className='grid grid-cols-3 gap-4 min-h-80'>
        {/* Cola de procesos */}
        <div className='border p-4 rounded-lg bg-yellow-50 h-fit'>
          <h2 className='text-lg font-semibold mb-3 text-yellow-800'>
            Cola de procesos
          </h2>
          <div className='space-y-2'>
            {getProcessesByStatus('waiting').map(process => (
              <div
                key={process.name}
                className='p-3 bg-yellow-100 border border-yellow-200 rounded shadow-sm transition-all'
              >
                <div className='font-medium'>{process.name}</div>
                <div className='text-sm'>Llegada: {process.arrivalTime}</div>
                <div className='text-sm'>Duración: {process.burstTime}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Proceso en ejecución */}
        <div className='border p-4 rounded-lg bg-green-50 execution_container h-40'>
          <h2 className='text-lg font-semibold mb-3 text-green-800'>
            En ejecución
          </h2>
          <div className='space-y-2'>
            {getProcessesByStatus('running').map(process => (
              <div
                key={process.name}
                className='p-3 bg-green-100 bg-opacity-95 border border-green-200 rounded shadow-sm transition-all'
              >
                <div className='font-medium'>{process.name}</div>
                <div className='text-sm'>
                  Progreso: {currentTime - process.startTime}/
                  {process.burstTime}
                </div>
                <div className='w-full bg-gray-200 rounded h-2 mt-2'>
                  <div
                    className='bg-green-500 rounded h-2 transition-all duration-1000'
                    style={{
                      width: `${Math.min(
                        100,
                        ((currentTime - process.startTime) /
                          process.burstTime) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Procesos terminados */}
        <div className='border p-4 rounded-lg bg-blue-50 h-fit'>
          <h2 className='text-lg font-semibold mb-3 text-blue-800'>
            Procesos terminados
          </h2>
          <div className='space-y-2'>
            {getProcessesByStatus('completed').map(process => (
              <div
                key={process.name}
                className='p-3 bg-blue-100 border border-blue-200 rounded shadow-sm transition-all'
              >
                <div className='font-medium'>{process.name}</div>
                <div className='text-sm'>Inicio: {process.startTime}</div>
                <div className='text-sm'>Fin: {process.finishTime}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FCFSVisualization
