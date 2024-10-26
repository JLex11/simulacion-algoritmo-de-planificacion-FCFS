import React from 'react'
import SimpleButton from './components/SimpleButton'
import useFCFS from './hooks/useFCFS'

const FCFSVisualization = () => {
  const {
    currentTime,
    isRunning,
    setIsRunning,
    resetSimulation,
    addRamdonProcess,
    getProcessesByStatus,
  } = useFCFS()

  return (
    <div className='p-4 space-y-6 w-full max-w-4xl mx-auto'>
      <div className='flex items-center justify-between mb-4'>
        <div className='space-x-2'>
          <SimpleButton onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pausar' : 'Iniciar'}
          </SimpleButton>
          <SimpleButton onClick={resetSimulation} className='bg-gray-500'>
            Reiniciar
          </SimpleButton>
          <SimpleButton onClick={() => addRamdonProcess()}>
            Agregar proceso
          </SimpleButton>
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
                key={process.__id}
                style={{ viewTransitionName: `process_card_${process.__id}` }}
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
                key={process.__id}
                style={{ viewTransitionName: `process_card_${process.__id}` }}
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
                key={process.__id}
                style={{ viewTransitionName: `process_card_${process.__id}` }}
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
