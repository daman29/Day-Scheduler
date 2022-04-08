// Variable declaration
var now = moment(); // Save moment as a local variable
var saveBtn = $(".saveBtn"); // Get all save buttons
var timeBlocks = $("[data-hour]"); // Get all timeBlocks
const currentDay = $("#currentDay"); // Get top date line
var savedNotes = [...Array(timeBlocks.length)]; // Create empty array to store scheduler notes

// Initialising function
function init() {
  // Receives last save date from local storage
  var lastDate = localStorage.getItem("lastSaveDate");
  var currentDate = now.format("DD MM");
  var retrievedNotes = JSON.parse(localStorage.getItem("notes"));

  // If the last save date is not the same as the current date then clear the local storage
  if (lastDate !== currentDate) {
    localStorage.clear();
  }
  // If local storage is not empty then set the saved notes from the local storage
  if (retrievedNotes !== null) {
    savedNotes = retrievedNotes;
  }
  // Call setLayout and setRunnerLine functions
  setLayout();
  setRunnerLine();
}

// Set starting layout, data and visuals
function setLayout() {
  currentDay.text(now.format("dddd, MMMM Do"));
  for (const block of timeBlocks) { // Loop through all blocks in timeBlocks
    if (block.dataset.hour < now.hours()) { //If the data-hour attribute is less than the current hour then assign the block the past class
      $(block).addClass("past");
    } else if (block.dataset.hour == now.hours()) { // If same then assign the present class
      $(block).addClass("present");
    } else { //If the data-hour attribute is greater than the current hour then assign the block the future class
      $(block).addClass("future");
    }
  }
  // Loop through length of timeBlocks and if savedNotes exists then assign the value to the timeBlock
  for (var i = 0; i < timeBlocks.length; i++) {
    if (savedNotes[i] !== null || savedNotes[i] !== "") {
      $(timeBlocks[i]).children().children("input").val(savedNotes[i]);
    }
  }
}

// Function to save the notes and save date to local storage
function saveNotes(hour, input) {
  var index = hour - 9;
  var lastSaveDate = now.format("DD MM");

  // Remove spaces from the input string and save to local storage also save the current date as the lastSaveDate
  savedNotes[index] = input.trim();
  localStorage.setItem("notes", JSON.stringify(savedNotes));
  localStorage.setItem("lastSaveDate", lastSaveDate);
}

// Function to calculate and set progress bar position
function setRunnerLine() {
  // Divide the container div into percentage of the runner line width and assign position in % depending on current time
  var currentProgress = ((now.hour() + now.minutes() / 60 - 9) / 9) * 10000;
  var currentProgressPercentage = currentProgress + "%";

  // If the current progress is in the container div height (meaning between 9AM and 6PM), then transform the runner line with the value
  if (currentProgress < 10000 && currentProgress >= 0) {
    $(".runner-line").css(
      "transform",
      "translateY(" + currentProgressPercentage + ")"
    );
    // Else hide the runner line
  } else {
    $(".runner-line").css("display", "none");
  }
}

// Click list the saveBtn
saveBtn.click(function (event) {
  event.preventDefault();
  var parentDiv = $(event.target.parentNode); // Get the parent of the clicked saveBtn
  var parentHour = Number(event.target.parentNode.dataset.hour); // Get the current hour clicked
  var notesInput = parentDiv.children().children("input").val(); // Set the current notes input value as notesInput variable

  saveNotes(parentHour, notesInput); // Send the hour saved and notes input to the saveNotes function
  setRunnerLine(); // Update the runner line position
});

init(); // Initialize the Application
