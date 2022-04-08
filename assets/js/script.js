var saveBtn = $(".saveBtn");
var now = moment();
var timeBlocks = $("[data-hour]");
const currentDay = $("#currentDay");
var savedNotes = [...Array(timeBlocks.length)];

function init() {
  var lastDate = localStorage.getItem("lastSaveDate");
  var currentDate = now.format("DD MM");
  var retrievedNotes = JSON.parse(localStorage.getItem("notes"));

  if (lastDate !== currentDate) {
    localStorage.clear();
  }
  if (retrievedNotes !== null) {
    savedNotes = retrievedNotes;
  }
  setLayout();
}

function setLayout() {
  currentDay.text(now.format("dddd, MMMM Do"));
  for (const block of timeBlocks) {
    if (block.dataset.hour < now.hours()) {
      $(block).addClass("past");
    } else if (block.dataset.hour == now.hours()) {
      $(block).addClass("present");
    } else {
      $(block).addClass("future");
    }
  }
  for (var i = 0; i < timeBlocks.length; i++) {
    if (savedNotes[i] !== null || savedNotes[i] !== "") {
      $(timeBlocks[i]).children().children("input").val(savedNotes[i]);
    }
  }
}

function saveNotes(hour, input) {
  var index = hour - 9;
  var lastSaveDate = now.format("DD MM");

  savedNotes[index] = input.val().trim();
  localStorage.setItem("notes", JSON.stringify(savedNotes));
  localStorage.setItem("lastSaveDate", lastSaveDate);
}

saveBtn.click(function (event) {
  event.preventDefault();
  var parentDiv = $(event.target.parentNode);
  var parentHour = Number(event.target.parentNode.dataset.hour);
  var notesInput = parentDiv.children().children("input");

  saveNotes(parentHour, notesInput);
});

init();
