let events = [];
let totalProbability = 0;
let isDarkMode = false;

function addEvent() {
  const name = document.getElementById('eventName').value.trim();
  const probability = parseFloat(document.getElementById('eventProbability').value);

  if (!name || isNaN(probability) || probability <= 0) {
    alert("Please enter a valid event name and probability.");
    return;
  }

  if (totalProbability + probability > 100) {
    alert("Total probability cannot exceed 100%.");
    return;
  }

  events.push({ name, probability });
  totalProbability += probability;

  const eventList = document.getElementById('eventList');
  eventList.innerHTML = events.map(e => `<li>${e.name}: ${e.probability}%</li>`).join('');
  document.getElementById('totalProbability').innerText = `Total Probability: ${totalProbability}%`;

  document.getElementById('eventName').value = '';
  document.getElementById('eventProbability').value = '';
}

function resetData() {
  events = [];
  totalProbability = 0;
  document.getElementById('eventList').innerHTML = '';
  document.getElementById('totalProbability').innerText = '';
  document.getElementById('result').innerText = '';
  document.getElementById('slotDisplay').innerText = '';
  document.getElementById('timer').innerText = '';
}

function spinSlot() {
  if (totalProbability === 0) {
    alert("Please add at least one event before spinning.");
    return;
  }

  if (totalProbability < 100) {
    const remainingProbability = 100 - totalProbability;
    events.push({ name: "Random Event", probability: remainingProbability });
    totalProbability = 100;

    const eventList = document.getElementById('eventList');
    eventList.innerHTML = events.map(e => `<li>${e.name}: ${e.probability}%</li>`).join('');
    document.getElementById('totalProbability').innerText = `Total Probability: ${totalProbability}%`;
  }

  let cumulativeProbabilities = [];
  let cumulativeSum = 0;
  events.forEach(event => {
    cumulativeSum += event.probability;
    cumulativeProbabilities.push(cumulativeSum);
  });

  const randomValue = Math.random() * 100;
  let selectedEvent;
  for (let i = 0; i < cumulativeProbabilities.length; i++) {
    if (randomValue < cumulativeProbabilities[i]) {
      selectedEvent = events[i];
      break;
    }
  }

  const slotDisplay = document.getElementById('slotDisplay');
  const timer = document.getElementById('timer');
  let currentIndex = 0;
  let intervalTime = 100;
  let remainingTime = 10;

  timer.innerText = `Showing decision in ${remainingTime} seconds`;

  const countdownInterval = setInterval(() => {
    remainingTime -= 1;
    timer.innerText = `Showing decision in ${remainingTime} seconds`;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);

  const spinInterval = setInterval(() => {
    slotDisplay.innerHTML = `<center width="100%">${events[currentIndex].name}</center>`;
    currentIndex = (currentIndex + 1) % events.length;

    if (remainingTime <= 3) {
      intervalTime += 20;
    }

    if (remainingTime <= 0) {
      clearInterval(spinInterval);
      slotDisplay.innerHTML = `<center width="100%">${selectedEvent.name}</center>`;
      document.getElementById('result').innerText = `Result: ${selectedEvent.name}`;
    }
  }, intervalTime);
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.className = isDarkMode ? ' dark-mode' : ' light-mode';
  document.getElementById('toggleModeButton').innerText = isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
}
