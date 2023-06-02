let monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
let DateObj = new Date();
let currentYear = DateObj.getFullYear();
let currentMonth = DateObj.getMonth();
let currentMonthEl = document.getElementById("currentMonth");
let currentYearEl = document.getElementById("currentYear");
let calenderDates = document.getElementById("calenderDates");
let eventContainer = document.getElementById("eventContainer");
let focusedDate = null;
let addEventInputEl = document.getElementById("addEventInputEl");
let addEventList = document.getElementById("addEventList");

let createDates = (dateInfo) => {
    dateInfo.isSunday = ((dateInfo.day) == 0) ? true : false;
    let {year,month,date,day,isSunday,isCurrentMonth,isprevMonth,isNextMonth,isPublicHoliday} = dateInfo;
    let dateEl = document.createElement("li");
    let dateElId = "" + year + month + date;
    dateEl.setAttribute("id",dateElId);
    dateEl.textContent = date;
    let eventList = null;
    //Focused prev and nextdates
    if(focusedDate !== null && dateElId === focusedDate.id) {
        focusedDate.classList.remove("focused-date");
        dateEl.classList.add("focused-date");
        focusedDate = dateEl;
    }

    let currentEventDate = document.getElementById("currentEventDate");
    dateEl.addEventListener("click",(event) => {
        if(focusedDate != null &&  event.target.id !== focusedDate.id) {
            focusedDate.classList.toggle("focused-date");
            event.target.classList.toggle("focused-date");
            focusedDate = event.target;
            eventList = getEvents(focusedDate.id);
            createEvents(eventList);
        } 
        if(isprevMonth) {
            prevBtnFun();
        } else if(isNextMonth) {
            nextBtnFun();
        } 
        addEventInputEl.setAttribute("placeholder",`Add event on ${focusedDate.textContent} ${monthName[month]}`);
    });

    if(isCurrentMonth === false) {
        dateEl.classList.add("prev-dates");
    } else {
        dateEl.classList.add("current-month-dates");
    }
    if(date === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
        if(focusedDate == null) {
            dateEl.classList.add("focused-date");
            focusedDate = dateEl;
        }
        dateEl.classList.add("current-date");
    }
    if(isSunday === true && isCurrentMonth === false) {
        dateEl.classList.add("next-month-sunday");
        
    } else if(isSunday === true) {
        dateEl.classList.add("sunday");
    }
    if(focusedDate !== null) {
        addEventInputEl.setAttribute("placeholder",`Add event on  ${focusedDate.textContent} ${monthName[new Date().getMonth()]}`);
    }
    calenderDates.appendChild(dateEl);

    // adding Events
    // let eventList = getEvents(focusedDate.id);
    // console.log(focusedDate.id);
    if(focusedDate !== null) {
        eventList = getEvents(focusedDate.id);
        createEvents(eventList);
    }
}

let loadDates = (year,month) => {
    calenderDates.textContent = "";
    currentMonthEl.textContent =  monthName[month];
    currentYearEl.textContent = year;
    let startDate = 1;
    let endDate = new Date(year,month+1,0).getDate();
    let startDay = new Date(year,month,startDate).getDay();
    let endDay = new Date(year,month,endDate).getDay();
    let prev = null;
    if(startDay > 1) { 
        prev = 2 - startDay;
    }
    else {
        prev = -5;
    }
    let prevStartDate = new Date(year,month,prev).getDate();
    let prevStartDay = 0;
    
    // previous Month Dates
    while(prevStartDay != startDay-1 && prevStartDay < 6) {
        let dateInfo = {
            year : (month == 0)? year -1 : year,
            month: month > 0 ? month-1: 11,
            date: prevStartDate + prevStartDay,
            day:prevStartDay + 1,
            isSunday:false,
            isCurrentMonth:false,
            isprevMonth:true,
            isNextMonth:false,
            isPublicHoliday: false
        };
        createDates(dateInfo);
        prevStartDay++;
    }
    
    // present month dates
    for(let i = startDate;i <= endDate; i++) {
        let dateInfo = {
            year:year,
            month:month,
            date:i,
            day:new Date(year,month,i).getDay(),
            isSunday:false,
            isCurrentMonth:true,
            isprevMonth:false,
            isNextMonth:false,
            isPublicHoliday : false
        };
        createDates(dateInfo);
    }

    // next Month Dates
    let nextStartDate = 1;
    if(endDay != 0) {
        while(endDay < 7) {
            let dateInfo = {
                year:(month == 11) ? (year + 1) : year,
                month: month < 11 ? month+1 : 0,
                date:nextStartDate,
                day:new Date(year,month+1,nextStartDate).getDay(),
                isSunday:false,
                isCurrentMonth:false,
                isprevMonth:false,
                isNextMonth:true,
                isPublicHoliday : false
            };
            createDates(dateInfo);
            nextStartDate++;
            endDay++;
        }
    }
}
loadDates(currentYear,currentMonth);
// prev month navigation button
function prevBtnFun() {
    if(currentMonth === 0) {
        currentYear--;
        currentMonth = 11;
    } else {
        currentMonth--;
    }
    console.log(focusedDate);
    loadDates(currentYear,currentMonth);
}
let prevBtn = document.getElementById("prevBtn");
prevBtn.addEventListener("click",prevBtnFun);

// next month navigation button
function nextBtnFun(){
    if(currentMonth === 11) {
        currentYear++;
        currentMonth = 0;
    } else {
        currentMonth++;
    }
    console.log(focusedDate);
    loadDates(currentYear,currentMonth);
}
let nextBtn = document.getElementById("nextBtn");
nextBtn.addEventListener("click", nextBtnFun);

// Keyboard event for navigation months 
function navigate(event) {
    if(event.key === "ArrowLeft") {
        prevBtnFun();
    }
    else if(event.key === "ArrowRight") {
        nextBtnFun();
    }
}

let inputDate = document.getElementById("inputDate");
inputDate.addEventListener("focus", () => {
    window.removeEventListener("keydown",navigate);
});

inputDate.addEventListener("blur", () => {
    window.addEventListener("keydown",navigate);
});
window.addEventListener("keydown",navigate);

function inputDateValidation() {
    if(inputDate.value === "") {
        alert("Enter");
    } else {
        let userDate = new Date(`${inputDate.value}`);
        if(userDate == "Invalid Date") {
            alert("Invalid Date");
            inputDate.value = "";
        } else if(userDate.getFullYear() < 1000 || userDate.getFullYear() > 5000) {
            alert("Out of range");
        } else {
            let inputYear = userDate.getFullYear();
            let inputMonth = userDate.getMonth();
            currentYear = inputYear;
            currentMonth = inputMonth;
            loadDates(currentYear,currentMonth);
        }
    }
}
let navigateDatesFormContainer = document.getElementById("navigateDatesFormContainer");
navigateDatesFormContainer.addEventListener("submit",(event) => {
    event.preventDefault();
    inputDateValidation();
});

let todayBtn = document.getElementById("todayBtn");
todayBtn.addEventListener("click",() => {
    currentYear = DateObj.getFullYear();
    currentMonth = DateObj.getMonth();
    if(focusedDate != null) {
        focusedDate.classList.remove("focused-date");
        focusedDate = null;
    }
    loadDates(currentYear,currentMonth);
});

// Handling Events

function loadEvent(eventInput) {
    let events = localStorage.getItem(eventInput.eventId);
    events = (events == null) ? [] : JSON.parse(events);
    events.push(eventInput.title);
    localStorage.setItem(eventInput.eventId,JSON.stringify(events));
}
function createEvents(events) {
    addEventList.textContent = "";

    events.forEach((event) => {
        let eventEl = document.createElement("li");
        eventEl.textContent = event;
        addEventList.appendChild(eventEl);
    });
}
function getEvents(eventId) {
    let event = localStorage.getItem(eventId);
    if(event == null) return [];
    else return JSON.parse(event);
}
let addEventPlusIcon = document.getElementById("addEventPlusIcon");
let confirmEventCheckIcon = document.getElementById("confirmEventCheckIcon");

let addEventFormContainer = document.getElementById("addEventFormContainer");

addEventFormContainer.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("submit");
    console.log(addEventList);
    if((addEventInputEl.value).trim() !== "") {
        let eventInput = {
            title: addEventInputEl.value,
            eventId:focusedDate.id
        };
        let userEvent = document.createElement("li");
        userEvent.textContent = addEventInputEl.value;
        addEventList.appendChild(userEvent);
        addEventInputEl.value = "";
        loadEvent(eventInput);
    } else {
        alert("Invalid Event!");
    }
    
    console.log(`${focusedDate.id} : ${addEventInputEl.value}`);
    console.log(addEventInputEl.value);
    
});
addEventInputEl.addEventListener("blur", (event) => {
    addEventPlusIcon.classList.toggle("hide-element");
    confirmEventCheckIcon.classList.toggle("hide-element");
});
addEventInputEl.addEventListener("focusin",(event) => {
    if((event.target.value).trim() === "") {
        confirmEventCheckIcon.classList.add("confirm-event-check-btn-disabled");
    } else {
        confirmEventCheckIcon.classList.remove("confirm-event-check-btn-disabled");
    }
    addEventPlusIcon.classList.toggle("hide-element");
    confirmEventCheckIcon.classList.toggle("hide-element");
});

addEventInputEl.addEventListener("input", (event) => {
    if((event.target.value).trim() === "") {
        confirmEventCheckIcon.classList.add("confirm-event-check-btn-disabled");
    } else  {
        confirmEventCheckIcon.classList.remove("confirm-event-check-btn-disabled");
    }
});