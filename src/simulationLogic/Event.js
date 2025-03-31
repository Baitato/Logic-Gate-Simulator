import { Heap } from "../utils/heap";

class Event {
  constructor(wire, time, value) {
    this.wire = wire;
    this.time = time;
    this.value = value;
  }
}

export const eventQueue = new Heap();

export const scheduleEvent = (event) => {
  Heap.push(event);
};
