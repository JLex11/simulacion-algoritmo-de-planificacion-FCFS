import { useEffect, useState } from 'react'
import Process from '../lib/process'

export default function useFCFS() {
  const [processes, setProcesses] = useState([])
  const [currentTime, setCurrentTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(1000) // milliseconds per tick

  useEffect(() => {
    const initialProcesses = [
      new Process('Proceso 1', 5),
      new Process('Proceso 2', 3),
      new Process('Proceso 3', 1),
    ]
    setProcesses(initialProcesses)
  }, [])

  // Animation loop
  useEffect(() => {
    let timer

    if (isRunning) {
      timer = setInterval(() => {
        const processWaitingOrRunning = processes.filter(
          p => p.status === 'waiting' || p.status === 'running'
        )
        if (processWaitingOrRunning.length === 0) {
          setIsRunning(false)
          return
        }

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
    setProcesses(prev => [...prev, new Process().ramdon(currentTime)])
  }

  const updateProcessesStatus = time => {
    setProcesses(prevProcesses => {
      let currentRunning = false

      prevProcesses.forEach(process => {
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

      return prevProcesses
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

  return {
    processes,
    currentTime,
    isRunning,
    speed,
    setIsRunning,
    addRamdonProcess,
    updateProcessesStatus,
    resetSimulation,
    getProcessesByStatus,
  }
}
