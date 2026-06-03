/**
 * CommuniLink Event Portal - JavaScript Logic Implementation
 * Satisfying Checkpoints 1 to 14
 */

// ==========================================
// 1. JavaScript Basics & Setup
// ==========================================
// Checkpoint 1: Log message to the console on load
console.log("Welcome to the Community Portal");

// Checkpoint 1: Use alert when fully loaded
window.addEventListener('load', () => {
  alert("Welcome to the Community Portal! Page fully loaded.");
  init();
});

// ==========================================
// 2. Syntax, Data Types, and Operators
// ==========================================
// Checkpoint 2: Use const for event details and let for seat count
const demoEventName = "Symphony Under the Stars";
const demoEventDate = "2026-07-15";
let demoSeats = 45;

// Checkpoint 2: Concatenate event info using template literals
const demoOutput = `Demo -> Event: ${demoEventName} is scheduled on ${demoEventDate} with ${demoSeats} available seats.`;
console.log(demoOutput);

// ==========================================
// 5. Objects and Prototypes
// ==========================================
// Checkpoint 5: Define Event constructor
function Event(id, name, date, category, location, seatsAvailable, maxSeats, description) {
  this.id = id;
  this.name = name;
  this.date = date;
  this.category = category;
  this.location = location;
  this.seatsAvailable = Number(seatsAvailable);
  this.maxSeats = Number(maxSeats);
  this.description = description;
}

// Checkpoint 5: Add checkAvailability to prototype
Event.prototype.checkAvailability = function() {
  return this.seatsAvailable > 0;
};

// ==========================================
// 4. Functions, Scope, Closures, Higher-Order Functions
// ==========================================
let allEvents = []; // Global events array
let userRegisteredEventIds = []; // Registered events for session

// Checkpoint 4: Use closure to track total registrations for a category
function makeCategoryTracker() {
  const counts = { music: 0, workshop: 0, community: 0, sports: 0 };
  
  return {
    adjust(category, val) {
      if (category in counts) {
        counts[category] += val;
        if (counts[category] < 0) counts[category] = 0;
      }
      return counts[category];
    },
    getCounts() {
      // Returns a shallow clone
      return { ...counts };
    }
  };
}
const regTracker = makeCategoryTracker();

// Checkpoint 4: Create addEvent()
function addEvent(eventObj) {
  // Checkpoint 6: Push new items to array
  allEvents.push(eventObj);
  console.log(`Pushed new event to array: ${eventObj.name}`);
  renderPortal();
}

// Checkpoint 4: Create registerUser()
function registerUser(eventId, name, email) {
  console.log(`[registerUser] Attempting to register ${name} (${email}) for event ${eventId}`);
  completeRegistration(eventId);
}

// Checkpoint 4 & 10: Create filterEventsByCategory() with Default Parameters
function filterEventsByCategory(category = "all", callback) {
  // Checkpoint 4: Pass callbacks to filter functions for dynamic search
  const filterCallback = callback || ((event) => event.category === category || category === "all");
  return filterEvents(filterCallback);
}

// Higher-order function: accepts a filter callback (Checkpoint 10 Default Parameters)
function filterEvents(callback = (event) => true) {
  // Checkpoint 10: Use spread operator to clone event list before filtering
  const cloned = [...allEvents];
  return cloned.filter(callback); // Checkpoint 6: Use .filter()
}

// ==========================================
// 3. Conditionals, Loops, and Error Handling
// ==========================================
function renderPortal() {
  // Checkpoint 7: Access DOM elements using querySelector()
  const gridContainer = document.querySelector("#eventsGrid"); 
  const noEventsMsg = document.querySelector("#noEventsMessage");
  gridContainer.innerHTML = "";

  const selectedCategory = document.querySelector("#categoryFilter").value;
  const searchTerm = document.querySelector("#eventSearchInput").value.toLowerCase();

  // Checkpoint 6: Use .filter() to show only music events (demonstrated in console)
  const musicOnly = allEvents.filter(e => e.category === 'music');
  console.log("Checkpoint 6 - Filtered Music Events:", musicOnly);

  // Filter portal events
  const filteredEvents = filterEvents(event => {
    // Checkpoint 3 User Story: Only upcoming events (date >= current portal date '2026-06-03') with seats
    const isUpcoming = event.date >= "2026-06-03";
    const hasSeats = event.seatsAvailable > 0;
    
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesSearch = event.name.toLowerCase().includes(searchTerm);

    // Checkpoint 3: Use if-else to hide past or full events
    if (isUpcoming && hasSeats) {
      return matchesCategory && matchesSearch;
    } else {
      return false; 
    }
  });

  // Checkpoint 6: Use .map() to format display card details/titles
  const mappedTitles = filteredEvents.map(e => `${e.category.toUpperCase()}: ${e.name}`);
  console.log("Checkpoint 6 - Formatted titles using .map():", mappedTitles);

  if (filteredEvents.length === 0) {
    noEventsMsg.classList.remove("hidden");
  } else {
    noEventsMsg.classList.add("hidden");
  }

  // Checkpoint 3: Loop through the event list and display using forEach()
  filteredEvents.forEach(event => {
    // Checkpoint 10: Use destructuring to extract event details
    const { id, name, date, category, location, seatsAvailable, maxSeats } = event;
    
    // Checkpoint 7: Create and append event cards using createElement()
    const cardEl = document.createElement("article");
    cardEl.className = "glass-panel event-card";
    
    const isRegistered = userRegisteredEventIds.includes(id);

    cardEl.innerHTML = `
      <div class="card-header-img">
        <span class="category-tag">${category}</span>
        <i class="fa-solid ${getCategoryIcon(category)} category-icon"></i>
      </div>
      <div class="card-body">
        <div class="card-date"><i class="fa-regular fa-clock"></i> ${date}</div>
        <h3>${name}</h3>
        <p class="card-desc">${event.description}</p>
        <div class="card-meta">
          <span class="card-location"><i class="fa-solid fa-location-dot"></i> ${location}</span>
          <span class="card-seats"><i class="fa-solid fa-ticket"></i> ${seatsAvailable} / ${maxSeats} seats</span>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-full ${isRegistered ? 'btn-danger' : 'btn-primary'}" id="btn-${id}">
          ${isRegistered ? '<i class="fa-solid fa-user-minus"></i> Cancel' : '<i class="fa-solid fa-user-plus"></i> Register'}
        </button>
      </div>
    `;

    // Checkpoint 8: Use onclick for "Register" buttons
    const actionBtn = cardEl.querySelector(`#btn-${id}`);
    actionBtn.onclick = () => {
      if (isRegistered) {
        cancelRegistration(id);
      } else {
        openRegisterModal(id);
      }
    };

    gridContainer.appendChild(cardEl); // Checkpoint 7: Append event card
  });

  // Load portal statistics & prototype inspection checks
  updateInsights();
}

// Category icon helper
function getCategoryIcon(cat) {
  if (cat === "music") return "fa-music";
  if (cat === "workshop") return "fa-chalkboard-user";
  if (cat === "community") return "fa-users";
  return "fa-person-running";
}

// Checkpoint 3: Wrap registration logic in try-catch to handle errors
function cancelRegistration(eventId) {
  try {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found.");

    const index = userRegisteredEventIds.indexOf(eventId);
    if (index === -1) throw new Error("Not registered.");

    userRegisteredEventIds.splice(index, 1);
    
    // Checkpoint 2: Use ++ to increment seat count on cancel
    event.seatsAvailable++;

    // Adjust closure state counts
    regTracker.adjust(event.category, -1);

    renderPortal(); // Checkpoint 7: Update UI
  } catch (error) {
    alert(`Cancellation error: ${error.message}`);
  }
}

// ==========================================
// 8. Event Handling & 14. jQuery Integration
// ==========================================
function setupUIListeners() {
  const categoryFilter = document.querySelector("#categoryFilter");
  const searchInput = document.querySelector("#eventSearchInput");
  const resetBtn = document.querySelector("#resetFiltersBtn");

  // Checkpoint 8: Use onchange to filter events by category
  categoryFilter.onchange = () => {
    // Checkpoint 14: Use .fadeIn() and .fadeOut() for event cards transition
    $("#eventsGrid").fadeOut(150, () => {
      renderPortal();
      $("#eventsGrid").fadeIn(200);
    });
  };

  // Checkpoint 8: Use keydown to allow quick search by name
  searchInput.onkeydown = () => {
    // Timeout to wait for keypress registry
    setTimeout(() => {
      renderPortal();
    }, 0);
  };

  resetBtn.onclick = () => {
    searchInput.value = "";
    categoryFilter.value = "all";
    renderPortal();
  };

  // Checkpoint 14: Use jQuery click handlers for close/cancel actions
  $("#closeModalBtn").click(() => {
    closeRegisterModal();
  });
  
  $("#cancelRegisterBtn").click(() => {
    closeRegisterModal();
  });

  // Checkpoint 14: Use $('#registerBtn').click(...) to handle click events on the submission button
  $("#registerBtn").click(() => {
    console.log("Submit button clicked via jQuery click handler.");
  });
}

// ==========================================
// 9. Async JS, Promises, Async/Await
// ==========================================
// Checkpoint 9: Promise chain demo fetch with .then() and .catch()
function fetchWithPromisesDemo() {
  fetch('events.json')
    .then(response => response.json())
    .then(data => console.log("Promises API fetch loaded:", data))
    .catch(error => console.error("Promises API fetch error:", error));
}

// Checkpoint 9: Async/await event fetching with spinner toggle
async function loadEventsAsync() {
  const spinner = document.querySelector("#loadingSpinner");
  const grid = document.querySelector("#eventsGrid");

  spinner.classList.remove("hidden");
  grid.classList.add("hidden");

  try {
    const response = await fetch('events.json');
    const data = await response.json();
    
    // Checkpoint 5: Instantiate events via constructor
    allEvents = data.map(item => new Event(
      item.id, item.name, item.date, item.category, item.location, item.seatsAvailable, item.maxSeats, item.description
    ));
  } catch (error) {
    console.warn("Async fetch failed, using memory fallback.", error);
    // Fallback data
    allEvents = [
      new Event("music-01", "Symphony Under the Stars", "2026-07-15", "music", "Central Community Park", 45, 100, "Live symphony under the sky."),
      new Event("workshop-01", "Artisanal Baking Masterclass", "2026-08-05", "workshop", "Community Kitchen", 12, 15, "Learn sourdough baking secrets."),
      new Event("community-01", "Eco Gardening Drive", "2026-06-20", "community", "Urban Roots Garden", 0, 30, "Fully booked gardening program.")
    ];
  } finally {
    spinner.classList.add("hidden");
    grid.classList.remove("hidden");
  }
}

// ==========================================
// 11. Working with Forms & 12. AJAX & Fetch API
// ==========================================
function openRegisterModal(eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event) return;

  document.querySelector("#regEventId").value = event.id;
  document.querySelector("#modalEventTitle").textContent = `Register: ${event.name}`;
  document.querySelector("#modalSeatsCount").textContent = event.seatsAvailable;
  
  // Progress bar
  const percentUsed = ((event.maxSeats - event.seatsAvailable) / event.maxSeats) * 100;
  document.querySelector("#modalSeatsProgress").style.width = `${percentUsed}%`;

  // Reset error markers and fields
  document.querySelector("#err-regUserName").textContent = "";
  document.querySelector("#err-regUserEmail").textContent = "";
  document.querySelector("#regUserName").classList.remove("input-invalid");
  document.querySelector("#regUserEmail").classList.remove("input-invalid");
  document.querySelector("#formFeedback").className = "form-feedback hidden";

  $("#registerModal").removeClass("hidden").css("display", "flex");
}

function closeRegisterModal() {
  $("#registerModal").addClass("hidden");
}

async function setupRegistrationForm() {
  const form = document.querySelector("#registrationForm");
  
  form.onsubmit = async (event) => {
    // Checkpoint 11: Prevent default form behavior
    event.preventDefault();

    // Checkpoint 13: Log form submission steps and check request payload
    console.group("Registration Form Submission Logs");
    console.log("Step 1: Caught submit event.");

    // Checkpoint 11: Capture elements using form.elements
    const nameInput = form.elements['userName'];
    const emailInput = form.elements['email'];
    const eventId = form.elements['eventId'].value;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    console.log(`Step 2: Captured elements: Name="${name}", Email="${email}"`);

    // Checkpoint 11: Validate inputs and show errors inline
    let isValid = true;
    const nameErr = document.querySelector("#err-regUserName");
    const emailErr = document.querySelector("#err-regUserEmail");

    nameErr.textContent = "";
    emailErr.textContent = "";
    nameInput.classList.remove("input-invalid");
    emailInput.classList.remove("input-invalid");

    if (!name) {
      nameErr.textContent = "Please enter your name.";
      nameInput.classList.add("input-invalid");
      isValid = false;
    }

    if (!email || !email.includes("@")) {
      emailErr.textContent = "Please enter a valid email address.";
      emailInput.classList.add("input-invalid");
      isValid = false;
    }

    if (!isValid) {
      console.warn("Step 3: Validation failed. Cancelling API submit.");
      console.groupEnd();
      return;
    }

    const payload = { name, email, eventId };
    console.log("Step 4: Request payload compiled:", payload);

    const feedback = document.querySelector("#formFeedback");
    feedback.className = "form-feedback form-feedback-info";
    feedback.textContent = "Submitting registration to mock server...";
    feedback.classList.remove("hidden");

    // Checkpoint 12: Use fetch() to POST user data to a mock API
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();

      if (!response.ok) throw new Error(resData.error || "Server error.");

      // Checkpoint 12: Show success message after submission
      feedback.className = "form-feedback form-feedback-success";
      feedback.textContent = `Success! ${resData.message}`;

      // Checkpoint 4: registerUser function handles the state update
      registerUser(eventId, name, email);

    } catch (err) {
      // Checkpoint 12: Show failure message or fallback local success if using file:// protocol
      if (window.location.protocol === 'file:') {
        feedback.className = "form-feedback form-feedback-success";
        feedback.textContent = `Success (Local Static Mock): Registered ${name}!`;
        registerUser(eventId, name, email);
      } else {
        feedback.className = "form-feedback form-feedback-error";
        feedback.textContent = `Error: ${err.message}`;
      }
    } finally {
      console.groupEnd();
    }
  };
}

function completeRegistration(eventId) {
  // Checkpoint 3: Wrap registration logic in try-catch to handle errors
  try {
    const eventObj = allEvents.find(e => e.id === eventId);
    if (!eventObj) throw new Error("Event not found.");

    // Checkpoint 2: Use -- to decrement seat count on registration
    eventObj.seatsAvailable--;
    userRegisteredEventIds.push(eventId);

    // Adjust category tracker stats
    regTracker.adjust(eventObj.category, 1);

    // Close modal after artificial delayed response using setTimeout (Checkpoint 12)
    setTimeout(() => {
      closeRegisterModal();
      renderPortal(); // Checkpoint 7: Update UI
    }, 1200);

  } catch (err) {
    alert(err.message);
  }
}

// Add New Event Form trigger (Pushing new events)
function setupAddEventForm() {
  const form = document.querySelector("#addEventForm");
  
  form.onsubmit = (e) => {
    e.preventDefault();
    
    const name = document.querySelector("#newEventName").value;
    const category = document.querySelector("#newEventCategory").value;
    const seats = Number(document.querySelector("#newEventSeats").value);
    const date = document.querySelector("#newEventDate").value;
    const location = document.querySelector("#newEventLocation").value;
    const desc = document.querySelector("#newEventDesc").value;

    const newObj = new Event(`event-${Date.now()}`, name, date, category, location, seats, seats, desc);
    
    addEvent(newObj);
    form.reset();
  };
}

// ==========================================
// PORTAL STATISTICS DISPLAY HANDLERS
// ==========================================
function updateInsights() {
  // Update Current Date
  const d = new Date();
  document.querySelector('#currentDateBadge').innerHTML = `<i class="fa-regular fa-calendar-days"></i> ${d.toDateString()}`;

  // Update Closures tracked counts in sidebar
  const counts = regTracker.getCounts();
  document.querySelector('#stat-music').textContent = counts.music;
  document.querySelector('#stat-workshop').textContent = counts.workshop;
  document.querySelector('#stat-community').textContent = counts.community;
  document.querySelector('#stat-sports').textContent = counts.sports;

  // Checkpoint 5: Verify Prototype Method availability
  const verifyEl = document.querySelector('#prototypeVerification');
  const hasConstructor = typeof Event === 'function';
  const hasProtoMethod = typeof Event.prototype.checkAvailability === 'function';
  if (hasConstructor && hasProtoMethod) {
    verifyEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> Prototype active`;
    verifyEl.style.color = "var(--color-success)";
  }

  populateInspectorSelector();
}

function populateInspectorSelector() {
  const selector = document.querySelector("#objectSelector");
  const currentVal = selector.value;
  selector.innerHTML = "";

  allEvents.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.id;
    opt.textContent = e.name;
    selector.appendChild(opt);
  });

  if (currentVal && allEvents.some(e => e.id === currentVal)) {
    selector.value = currentVal;
    inspectObject(currentVal);
  } else if (allEvents.length > 0) {
    selector.value = allEvents[0].id;
    inspectObject(allEvents[0].id);
  }

  selector.onchange = (e) => inspectObject(e.target.value);
}

// Checkpoint 5: List object keys and values using Object.entries()
function inspectObject(eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event) return;

  const entries = Object.entries(event);
  let output = `Object.entries(selectedEvent) output:\n[\n`;
  entries.forEach(([key, val]) => {
    if (typeof val !== 'function') {
      output += `  ["${key}", "${val}"],\n`;
    }
  });
  output += `]`;

  document.querySelector("#objectEntriesCode").textContent = output;
}

// ==========================================
// PORTAL INITIALIZATION
// ==========================================
async function init() {
  await loadEventsAsync();
  fetchWithPromisesDemo();
  setupUIListeners();
  setupRegistrationForm();
  setupAddEventForm();
  renderPortal();
}
