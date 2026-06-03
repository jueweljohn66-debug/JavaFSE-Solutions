// ============================================================
//  main.js – Local Community Event Portal
//  Covers: Exercises 1 through 14
// ============================================================

// ============================================================
// EXERCISE 1 – JavaScript Basics & Setup
// ============================================================
console.log("Welcome to the Community Portal");

window.addEventListener("load", () => {
  alert("Welcome! The Community Portal has loaded successfully.");
});

// ============================================================
// EXERCISE 2 – Syntax, Data Types, and Operators
// ============================================================
const portalName = "Local Community Event Portal";  // const – won't change
const portalCity = "Idukki, Kerala";

// Template literal to concatenate info
const portalInfo = `${portalName} | City: ${portalCity}`;
console.log(portalInfo);

// Seat count managed with let (++ / -- used during registration)
let totalSeatsRegistered = 0;

// ============================================================
// EXERCISE 5 – Objects and Prototypes (Event Constructor)
// ============================================================
function Event(id, name, category, location, date, seats) {
  this.id       = id;
  this.name     = name;
  this.category = category;
  this.location = location;
  this.date     = new Date(date);
  this.seats    = seats;
}

// checkAvailability added to prototype
Event.prototype.checkAvailability = function () {
  return this.seats > 0 && this.date >= new Date();
};

Event.prototype.toString = function () {
  return `${this.name} (${this.category}) – ${this.location}`;
};

// ============================================================
// EXERCISE 6 – Arrays and Methods (Initial event data)
// ============================================================
let events = [
  new Event(1, "Jazz in the Park",       "music",    "Park",           "2026-07-10", 30),
  new Event(2, "Workshop on Baking",      "workshop", "Community Hall", "2026-07-15", 20),
  new Event(3, "5K Community Run",        "sports",   "Downtown",       "2026-07-20", 100),
  new Event(4, "Street Food Festival",    "food",     "Downtown",       "2026-07-25", 200),
  new Event(5, "Web Dev Bootcamp",        "tech",     "Online",         "2026-08-01", 50),
  new Event(6, "Rock Night Live",         "music",    "Downtown",       "2026-08-05", 40),
  new Event(7, "Pottery for Beginners",   "workshop", "Community Hall", "2026-08-10", 15),
  new Event(8, "Yoga at Sunrise",         "sports",   "Park",           "2026-08-12", 25),
  new Event(9, "Vintage Music Festival",  "music",    "Park",           "2025-01-01", 0),  // past+full
  new Event(10,"AI & Future Tech Talk",   "tech",     "Online",         "2026-08-20", 60),
];

// EXERCISE 6: .push() to add a new event dynamically
function addEvent(name, category, location, date, seats) {
  const newId = events.length + 1;
  const newEvent = new Event(newId, name, category, location, date, seats);
  events.push(newEvent);   // .push()
  console.log(`Event added: ${newEvent}`);
  refreshEventDisplay();
  populateEventDropdown();
}

// EXERCISE 6: .filter() – only music events
function getMusicEvents() {
  return events.filter(e => e.category === "music");
}

// EXERCISE 6: .map() – format card title strings
function getFormattedTitles() {
  return events.map(e => `${e.category.charAt(0).toUpperCase() + e.category.slice(1)}: ${e.name}`);
}
console.log("Formatted Titles:", getFormattedTitles());

// ============================================================
// EXERCISE 4 – Functions, Closures, Higher-Order Functions
// ============================================================

// Closure: tracks registrations per category
function makeCategoryTracker() {
  const counts = {};   // private via closure
  return {
    register(category) {
      counts[category] = (counts[category] || 0) + 1;
    },
    getCount(category) {
      return counts[category] || 0;
    },
    getAll() {
      return { ...counts };
    }
  };
}
const categoryTracker = makeCategoryTracker();

// Higher-order function: filter with a callback predicate
function filterEventsByCategory(category, callback) {
  return events.filter(e => callback(e, category));
}

// ============================================================
// EXERCISE 3 – Conditionals, Loops, Error Handling
// ============================================================

// Filter: only upcoming events with seats available
function getValidEvents(category = "all", location = "all", query = "") {
  return events
    .filter(e => {
      // if-else to hide past or full events
      if (!e.checkAvailability()) return false;
      if (category !== "all" && e.category !== category) return false;
      if (location !== "all" && e.location.toLowerCase() !== location) return false;
      if (query && !e.name.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
}

// Registration logic wrapped in try-catch
function registerUser(eventId, userName, userEmail) {
  try {
    const event = events.find(e => e.id === eventId);
    if (!event) throw new Error("Event not found.");
    if (!event.checkAvailability()) throw new Error("Event is full or has passed.");
    if (!userName || !userEmail) throw new Error("Name and email are required.");

    // EXERCISE 2: ++ to manage seat count
    event.seats--;
    totalSeatsRegistered++;

    // Closure tracker
    categoryTracker.register(event.category);

    console.log(`Registered: ${userName} for ${event.name}`);
    console.log(`Category registrations:`, categoryTracker.getAll());

    refreshEventDisplay();
    populateEventDropdown();
    return { success: true, message: `You have been registered for "${event.name}"!` };
  } catch (err) {
    console.error("Registration error:", err.message);
    return { success: false, message: err.message };
  }
}

// ============================================================
// EXERCISE 7 – DOM Manipulation
// ============================================================

function getCategoryColor(category) {
  const map = { music: "#7c3aed", workshop: "#0891b2", sports: "#16a34a", food: "#ea580c", tech: "#1d4ed8" };
  return map[category] || "#6b7280";
}

function createEventCard(event) {
  // createElement()
  const col = document.createElement("div");
  col.className = "col-md-6 col-lg-4 event-col";
  col.dataset.id = event.id;

  const seatsClass = event.seats <= 5 ? "seat-count low" : "seat-count";

  col.innerHTML = `
    <div class="card event-card h-100">
      <div class="card-header" style="background:${getCategoryColor(event.category)}">
        <i class="bi bi-tag-fill me-1"></i>${event.category.toUpperCase()}
      </div>
      <div class="card-body">
        <h5 class="card-title">${event.name}</h5>
        <p class="card-text text-muted mb-1"><i class="bi bi-geo-alt me-1"></i>${event.location}</p>
        <p class="card-text text-muted mb-2"><i class="bi bi-calendar me-1"></i>${event.date.toDateString()}</p>
        <p class="${seatsClass}"><i class="bi bi-people me-1"></i>${event.seats} seats left</p>
      </div>
      <div class="card-footer bg-white border-0 pb-3">
        <button class="btn btn-primary btn-sm w-100 register-btn" data-id="${event.id}">
          <i class="bi bi-check-circle me-1"></i>Register
        </button>
      </div>
    </div>`;

  return col;
}

function renderEvents(filtered) {
  const container = document.querySelector("#eventsContainer");  // querySelector()
  const noEvents  = document.getElementById("noEvents");
  container.innerHTML = "";

  // EXERCISE 3: forEach loop through event list
  if (filtered.length === 0) {
    noEvents.classList.remove("d-none");
    return;
  }
  noEvents.classList.add("d-none");

  filtered.forEach(event => {
    const card = createEventCard(event);
    container.appendChild(card);  // append
  });

  // Attach register button listeners (Exercise 8)
  attachRegisterListeners();
}

function refreshEventDisplay() {
  const category = document.getElementById("categoryFilter").value;
  const location = document.getElementById("locationFilter").value;
  const query    = document.getElementById("searchInput").value;
  const filtered = getValidEvents(category, location, query);
  renderEvents(filtered);
}

// Populate event dropdown in registration form
function populateEventDropdown() {
  const select = document.getElementById("regEvent");
  select.innerHTML = '<option value="">-- Choose an Event --</option>';
  getValidEvents().forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.id;
    opt.textContent = e.name;
    select.appendChild(opt);
  });
}

// ============================================================
// EXERCISE 8 – Event Handling
// ============================================================

// onclick for Register buttons
function attachRegisterListeners() {
  document.querySelectorAll(".register-btn").forEach(btn => {
    btn.onclick = function () {
      const id = parseInt(this.dataset.id);
      const event = events.find(e => e.id === id);
      document.getElementById("regEvent").value = id;
      document.getElementById("regEvent").scrollIntoView({ behavior: "smooth" });
      document.getElementById("regName").focus();
    };
  });
}

// onchange to filter events by category
document.getElementById("categoryFilter").onchange = refreshEventDisplay;
document.getElementById("locationFilter").onchange = refreshEventDisplay;

// keydown for quick search by name (Exercise 8)
document.getElementById("searchInput").addEventListener("keydown", function () {
  setTimeout(refreshEventDisplay, 100);
});

// ============================================================
// EXERCISE 9 – Async JS, Promises, Async/Await
// ============================================================

// Mock JSON endpoint (using a local data function as mock API)
function mockFetchEvents() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(events), 800); // simulate network delay
  });
}

// Promise .then() / .catch()
function loadEventsWithPromise() {
  const spinner = document.getElementById("loadingSpinner");
  spinner.classList.remove("d-none");
  document.getElementById("eventsContainer").innerHTML = "";

  mockFetchEvents()
    .then(data => {
      spinner.classList.add("d-none");
      const valid = data.filter(e => e.checkAvailability());
      renderEvents(valid);
      populateEventDropdown();
    })
    .catch(err => {
      spinner.classList.add("d-none");
      console.error("Failed to load events:", err);
    });
}

// Async/Await version (also loads events on first call)
async function loadEventsAsync() {
  const spinner = document.getElementById("loadingSpinner");
  spinner.classList.remove("d-none");  // show loading spinner
  document.getElementById("eventsContainer").innerHTML = "";

  try {
    const data = await mockFetchEvents();  // await the promise
    spinner.classList.add("d-none");
    renderEvents(getValidEvents());
    populateEventDropdown();
  } catch (err) {
    spinner.classList.add("d-none");
    console.error("Async load failed:", err);
  }
}

// ============================================================
// EXERCISE 10 – Modern JavaScript Features (ES6+)
// ============================================================

// Default parameters
function greetUser(name = "Guest", role = "Visitor") {
  return `Hello, ${name}! Role: ${role}`;
}
console.log(greetUser());
console.log(greetUser("Arjun", "Member"));

// Destructuring to extract event details
function printEventDetails(event) {
  const { name, category, location, seats } = event;  // destructuring
  console.log(`Event: ${name} | Category: ${category} | Location: ${location} | Seats: ${seats}`);
}

// Spread operator to clone event list before filtering
function safeFilter(category) {
  const cloned = [...events];   // spread clone
  return cloned.filter(e => e.category === category);
}
console.log("Tech events:", safeFilter("tech"));

// Log details of first event using destructuring
printEventDetails(events[0]);

// Object.entries() (Exercise 5)
console.log("Event object entries:", Object.entries(events[0]));

// ============================================================
// EXERCISE 11 – Working with Forms
// ============================================================

const registrationForm = document.getElementById("registrationForm");

registrationForm.addEventListener("submit", function (e) {
  e.preventDefault();  // prevent default

  // Access form elements
  const name  = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const eventId = parseInt(document.getElementById("regEvent").value);

  // Clear previous errors
  ["regName","regEmail","regEvent"].forEach(id => {
    document.getElementById(id).classList.remove("is-invalid");
  });

  // Inline validation
  let valid = true;
  if (!name) {
    document.getElementById("regName").classList.add("is-invalid");
    document.getElementById("nameError").textContent = "Name is required.";
    valid = false;
  }
  if (!email || !email.includes("@")) {
    document.getElementById("regEmail").classList.add("is-invalid");
    document.getElementById("emailError").textContent = "Enter a valid email.";
    valid = false;
  }
  if (!eventId) {
    document.getElementById("regEvent").classList.add("is-invalid");
    document.getElementById("eventError").textContent = "Please select an event.";
    valid = false;
  }
  if (!valid) return;

  // EXERCISE 12: POST via fetch (mock)
  submitRegistration({ name, email, eventId });
});

// ============================================================
// EXERCISE 12 – AJAX & Fetch API
// ============================================================

function submitRegistration(data) {
  const btn = document.getElementById("registerBtn");
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Submitting...';

  // Simulate POST to a mock API (JSONPlaceholder as mock)
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: `Registration: ${data.name}`,
      body:  `Email: ${data.email}`,
      userId: data.eventId
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("Server error");
    return res.json();
  })
  .then(json => {
    console.log("Server response:", json);

    // Also update local seat count
    const result = registerUser(data.eventId, data.name, data.email);

    // setTimeout to simulate delayed confirmation (Exercise 12)
    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Register Now';

      if (result.success) {
        showToast(result.message, "success");
        registrationForm.reset();
      } else {
        showToast(result.message, "danger");
      }
    }, 500);
  })
  .catch(err => {
    console.error("Fetch error:", err);
    btn.disabled = false;
    btn.innerHTML = '<i class="bi bi-check-circle me-1"></i>Register Now';
    showToast("Network error. Please try again.", "danger");
  });
}

// ============================================================
// EXERCISE 13 – Debugging Helpers
// ============================================================
// Use Chrome DevTools: Console, Network tab, Breakpoints
// Added console.log at key steps for debugging

function debugFormSubmission(data) {
  console.group("Form Submission Debug");
  console.log("Step 1: Form data captured", data);
  console.log("Step 2: Sending fetch POST request...");
  // Add breakpoint here in DevTools to inspect 'data'
  console.log("Step 3: Check Network tab → XHR → jsonplaceholder.typicode.com");
  console.groupEnd();
}

// ============================================================
// EXERCISE 14 – jQuery
// ============================================================

$(document).ready(function () {
  // jQuery click for register button
  $("#registerBtn").click(function () {
    console.log("jQuery: Register button clicked");
  });

  // Fade in event cards using jQuery after render
  $(document).on("DOMNodeInserted", ".event-col", function () {
    $(this).hide().fadeIn(400);  // .fadeIn()
  });

  // jQuery: Add event modal save button
  $("#saveEventBtn").click(function () {
    const name     = $("#newEventName").val().trim();
    const category = $("#newEventCategory").val();
    const location = $("#newEventLocation").val().trim();
    const date     = $("#newEventDate").val();
    const seats    = parseInt($("#newEventSeats").val());

    if (!name || !location || !date || !seats) {
      alert("Please fill in all fields.");
      return;
    }

    addEvent(name, category, location, date, seats);
    bootstrap.Modal.getInstance(document.getElementById("addEventModal")).hide();
    $("#addEventForm")[0].reset();
    showToast(`Event "${name}" added successfully!`, "success");
  });
});

// Benefit of React/Vue: Component-based architecture allows reusable UI pieces,
// virtual DOM for efficient updates, and state management — far more scalable
// than manual DOM manipulation as the app grows.

// ============================================================
// UTILITY: Toast Notification
// ============================================================
function showToast(message, type = "success") {
  const toast   = document.getElementById("toastMsg");
  const toastText = document.getElementById("toastText");
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toastText.textContent = message;
  const bsToast = new bootstrap.Toast(toast, { delay: 3500 });
  bsToast.show();
}

// ============================================================
// INITIALISE: Load events on page (using async/await – Exercise 9)
// ============================================================
loadEventsAsync();
