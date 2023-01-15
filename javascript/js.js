// Code By Kanwar Adnan
var id = 1;

class ProcessModelResponse {
   constructor(name, arrival_time, burst_time) {
      this.name = name;
      this.arrival_time = arrival_time;
      this.burst_time = burst_time;
      this.remaining_time = burst_time;
      this.response_time = 0;
      this.finish_time = 0;
      this.turn_around_time = 0;
      this.waiting_time = 0;
   }
}


class FCFS {
   constructor() {}
   static execute(processes) {
      let sorted_processes = processes.sort((a, b) => a.arrival_time - b.arrival_time);
      let executed_processes = [];
      let current_time = sorted_processes[0].arrival_time;
      for (let i = 0; i < sorted_processes.length; i++) {
         let process = sorted_processes[i];
         let name = process.name;
         let arrival_time = process.arrival_time;
         let burst_time = process.burst_time;
         let response_time = current_time;
         let finish_time = current_time + process.burst_time;
         let turn_around_time = finish_time - arrival_time;
         let waiting_time = turn_around_time - burst_time;
         current_time = current_time + burst_time;
         let response_object = new ProcessModelResponse(name, arrival_time, burst_time);
         response_object.response_time = response_time;
         response_object.finish_time = finish_time;
         response_object.turn_around_time = turn_around_time;
         response_object.waiting_time = waiting_time;
         executed_processes.push(response_object);
      }
      executed_processes.sort((a, b) => a.name.localeCompare(b.name));
      return executed_processes;
   }
}


function getJobsAt(arrivalTime, sortedProcesses) {
   let jobs = [];
   for (let i = 0; i < sortedProcesses.length; i++) {
      if (sortedProcesses[i].arrival_time <= arrivalTime) {
         jobs.push(sortedProcesses[i]);
      }
   }
   return jobs;
}


class ReadyQueue {
   constructor() {
      this.processes = [];
   }

   append(process) {
      return this.processes.push(process);
   }

   remove(process) {
      return this.processes.splice(this.processes.indexOf(process), 1);
   }

   getMinRemainingTimeProcess() {
      return this.processes.sort((a, b) => a.remaining_time - b.remaining_time)[0];
   }

   getMinBurstTimeProcess() {
      return this.processes.sort((a, b) => a.remaining_time - b.burst_time)[0];
   }

   isEmpty() {
      return this.processes.length === 0;
   }
}

class SRTF {
   constructor() {}

   static execute(interval, processes) {
      let sorted_processes = processes.sort((a, b) => a.arrival_time - b.arrival_time);
      let ready_queue = new ReadyQueue();
      let current_time = sorted_processes[0].arrival_time;
      let executed_processes = [];
      while (sorted_processes.length > 0) {
         ready_queue.processes = getJobsAt(current_time, sorted_processes);
         while (!ready_queue.isEmpty()) {
            let process = ready_queue.getMinRemainingTimeProcess();
            if (!executed_processes.includes(process)) {
               process.response_time = current_time;
               executed_processes.push(process);
            }
            current_time += interval;
            process.remaining_time -= interval;
            if (process.remaining_time <= 0) {
               process.finish_time = current_time;
               process.turn_around_time = process.finish_time - process.arrival_time;
               process.waiting_time = process.turn_around_time - process.burst_time;
               sorted_processes.splice(sorted_processes.indexOf(process), 1);
            }
            ready_queue.processes = [];
         }
      }
      let result = executed_processes.sort((a, b) => a.name.localeCompare(b.name));
      return result;
   }
}

class SJF {
   static execute(processes) {
      let sortedProcesses = processes.sort((a, b) => a.arrival_time - b.arrival_time);
      let readyQueue = new ReadyQueue();
      let currentTime = sortedProcesses[0].arrival_time;
      let executed_processes = []
      while (sortedProcesses.length !== 0) {
         readyQueue.processes = getJobsAt(currentTime, sortedProcesses);
         while (!readyQueue.isEmpty()) {
            let process = readyQueue.getMinBurstTimeProcess();
            process.response_time = currentTime;
            process.finish_time = currentTime + process.burst_time;
            process.turn_around_time = process.finish_time - process.arrival_time;
            process.waiting_time = process.turn_around_time - process.burst_time;
            currentTime += process.burst_time;
            readyQueue.remove(process);
            sortedProcesses.splice(sortedProcesses.indexOf(process), 1);
            let response_object = new ProcessModelResponse(process.name, process.arrival_time, process.burst_time);
            response_object.response_time = process.response_time;
            response_object.finish_time = process.finish_time;
            response_object.turn_around_time = process.turn_around_time;
            response_object.waiting_time = process.waiting_time;
            executed_processes.push(response_object);
         }
      }
      return executed_processes.sort((a, b) => a.name.localeCompare(b.name));
   }
}

function validate_fields() {
   const div_processes = document.querySelectorAll('#div_process');
   for (let i = 0; i < div_processes.length; i++) {
      const processNameInput = div_processes[i].querySelector('#process-name-input');
      const arrivalTimeInput = div_processes[i].querySelector('#arrival-time-input');
      const burstTimeInput = div_processes[i].querySelector('#burst-time-input');

      if (!processNameInput.value) {
         alert(`Please enter the Process Name for process ${i+1}`);
         processNameInput.focus();
         return false;
      }
      if (!arrivalTimeInput.value) {
         alert(`Please enter the Arrival Time for process ${i+1}`);
         arrivalTimeInput.focus();
         return false;
      }
      if (!burstTimeInput.value) {
         alert(`Please enter the Burst Time for process ${i+1}`);
         burstTimeInput.focus();
         return false;
      }
   }
   return true;
}

function calculate_fcfs_and_update_table() {
   if (validate_fields()) {
      document.getElementById("process-table").style.visibility = "visible";
      const tableBody = document.getElementById("process-table-body");

      tableBody.innerHTML = "";
      const div_processes = document.querySelectorAll('#div_process');
      const data = [];
      for (let i = 0; i < div_processes.length; i++) {
         const processNameInput = div_processes[i].querySelector('#process-name-input');
         const arrivalTimeInput = div_processes[i].querySelector('#arrival-time-input');
         const burstTimeInput = div_processes[i].querySelector('#burst-time-input');

         data.push(new ProcessModelResponse(processNameInput.value, parseInt(arrivalTimeInput.value), parseInt(burstTimeInput.value)));
      }
      // determine algo
      const algo = document.getElementById("algorithm-select").value;
      if (algo == "fcfs") {
         let executed_processes = FCFS.execute(data);
         for (let i = 0; i < executed_processes.length; i++) {
            add_row_to_table(executed_processes[i]);
         }
      }
      if (algo == "sjf") {
         let executed_processes = SJF.execute(data);
         for (let i = 0; i < executed_processes.length; i++) {
            add_row_to_table(executed_processes[i]);
         }
      }
      if (algo == "srtf") {
         let executed_processes = SRTF.execute(1, data);
         for (let i = 0; i < executed_processes.length; i++) {
            add_row_to_table(executed_processes[i]);
         }
      }

   }
}

function clear_process() {
   document.getElementById("process-table").style.visibility = "hidden";
   const tableBody = document.getElementById("process-table-body");
   tableBody.innerHTML = "";
   const div_processes = document.getElementById("div_processes");
   div_processes.innerHTML = "";
   id = 1;
   add_process();
}

function add_row_to_table(row) {
   const tableBody = document.getElementById("process-table-body");
   const newRow = document.createElement("tr");
   newRow.innerHTML = `
        <td>${row.name}</td>
        <td>${row.arrival_time}</td>
        <td>${row.burst_time}</td>
        <td>${row.response_time}</td>
        <td>${row.finish_time}</td>
        <td>${row.turn_around_time}</td>
        <td>${row.waiting_time}</td>
   `;
   tableBody.appendChild(newRow);
}

function add_process() {
   let div_process = document.getElementById('div_processes');
   let new_div = document.createElement('div');
   new_div.innerHTML = `
<div class="card">
  <div class="card-header bg-success text-white font-weight-bold">Process No ${id}</div>
  <div class="card-body">
    <table class="table table-bordered table-responsive-sm">
      <tbody>
        <tr>
          <td class="font-weight-bold">Process Name:</td>
          <td><input type="text" id="process-name-input" placeholder="<name>" class="form-control"></td>
        </tr>
        <tr>
          <td class="font-weight-bold">Arrival Time:</td>
          <td><input type="text" id="arrival-time-input" placeholder="<time>" class="form-control"></td>
        </tr>
        <tr>
          <td class="font-weight-bold">Burst Time:</td>
          <td><input type="text" id="burst-time-input" placeholder="<time>" class="form-control"></td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
   `
   new_div.id = "div_process"
   div_process.appendChild(new_div);
   id++;
}


function del_process() {
   div_process = document.querySelectorAll('#div_process');
   if (div_process.length > 1) {
      div_process = div_process[div_process.length - 1];
      div_process.remove();
      id--;
      return;
   }
   alert('Atleast one process is required to compute the results');
}