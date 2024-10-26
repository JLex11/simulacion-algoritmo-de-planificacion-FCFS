export default class Process {
  constructor(name, burstTime, arrivalTime = 0) {
    this.__id = `${name}_${Math.random().toString(36)}`
    this.name = name
    this.burstTime = burstTime
    this.arrivalTime = arrivalTime
    this.startTime = 0
    this.finishTime = 0
    this.waitingTime = 0
    this.turnaroundTime = 0
    this.status = 'waiting' // waiting, running, completed
  }

  ramdon(arrivalTime) {
    // Generate a random process
    const randomInt = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min
    const randomName = `Proceso ${randomInt(1, 100)}`
    const randomArrivalTime = randomInt(0, 10)
    const randomBurstTime = randomInt(1, 10)
    return new Process(
      randomName,
      randomBurstTime,
      arrivalTime ?? randomArrivalTime
    )
  }
}
