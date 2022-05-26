let userData = [];

// // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
let userId;
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    location.replace("../index.html");
  } else {
    userId = firebase.auth().currentUser.uid;
  }
});

let logout = () => {
  firebase.auth().signOut();
};
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
document.getElementById("logout").addEventListener("click", () => {
  setCookie("sb-calendar", ``, 0);
  firebase
    .database()
    .ref(`users/${userId}/saveData`)
    .set(userData)
    .then(() => {
      logout();
    });
});

const section = document.querySelector("section");
const monthYearTitle = document.getElementById("month-year-title");
const leftMonth = document.getElementById("left-month");
const rightMonth = document.getElementById("right-month");
const monthInput = document.getElementById("month-input");
const yearInput = document.getElementById("year-input");
const memberList = document.getElementById("scroll");
const openTab = document.getElementById("open-tab");
const main = document.querySelector("main");
const addNewInput = document.getElementById("add-new-input");
const close_flot_tab = document.getElementById("close");
const colorPickeer = document.getElementById("color-pickeer");
const openNewMT = document.getElementById("open-new-m-t");
const addMemberFlotingWindow = document.getElementById(
  "add-member-floting-window"
);
const dayInfCloseBtn = document.getElementById("day-inf-close-btn");
const inputWhySpecial = document.getElementById("input-why-special");
const scrollCard = document.getElementById("scroll-card");
const inputPersonName = document.getElementById("input-person-name");
const colorsSelect = document.querySelectorAll("#color-pickeer span");
const addMB_span = document.querySelector("#add-member-button span");
const inputNote = document.getElementById("input-note");
const dayInfDate = document.getElementById("day-inf-date");
const showDayName = document.getElementById("show-day-name");
const fullScreen = document.getElementById("fullScreen");
const welcomeUser = document.getElementById("welcome-user");

const dayInformation = document.getElementById("day-information");
const showDate = document.getElementById("show-date");
const openNewMoment = document.getElementById("open-new-whyspecial");
const scrollBox = document.getElementById("scroll-box");
const title_p = document.querySelector("#title p");

/* -------------- inmportant function ------------- */
// chack year is lepe year
const isLepeYear = (year) => !(year % 4);

// get  age start to end
const getAge = (startDate, endDate, inMonth = false) => {
  let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let ms = endDate.getTime() - startDate.getTime();
  let days = ms / (1000 * 3600 * 24);
  let _years = startDate.getFullYear();
  let _months = startDate.getMonth();
  let yy = 0,
    mn = 0,
    mm = (days % Math.floor(days)) * 24 * 60,
    dd = Math.floor(days),
    hh = 0;

  while (mm >= 60) {
    hh++;
    mm -= 60;
  }

  while (
    !inMonth &&
    ((isLepeYear(_years) && dd > 365) || (!isLepeYear(_years) && dd > 364))
  ) {
    if (isLepeYear(_years) && dd > 365) dd -= 366;
    else if (dd > 364) dd -= 365;
    _years++;
    yy++;
  }
  while (
    (isLepeYear(_years) && _months === 1 && dd > months[_months]) ||
    ((!isLepeYear(_years) || _months !== 1) && dd >= months[_months])
  ) {
    if (_months === 1 && isLepeYear(_years) && dd > 28) dd -= 29;
    else if (dd >= months[_months]) dd -= months[_months];
    _months = (_months + 1) % 11;
    mn++;
  }

  return {
    years: yy,
    months: mn,
    days: Math.floor(dd),
    hours: hh,
    minutes: Math.floor(mm) + 1,
  };
};

let Delete;
addNewInput.defaultValue = "2001-07-07";
let _d = new Date();
let currentMonth = _d.getMonth();
let currentYear = _d.getFullYear();
let currentDate = _d.getDate();
let currentHour = _d.getHours();
let currentMinute = _d.getMinutes();
let currentSecond = _d.getSeconds();
let selectedColorI = 0;
let tabOpenIs = false;
let months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

let tudayDate = {
  year: currentYear,
  month: currentMonth,
  day: currentDate,
  hour: currentHour,
  minute: currentMinute,
  second: currentSecond,
};
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
  "December",
];
let daysName = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let sortDayName = ["SUN", "MON", "TUE", "WED", "THD", "FRI", "SAT"];

// -----------------------------------------------------
// ------ first time initilizion -----
if (JSON.parse(localStorage.getItem("sb-calendar"))) {
  userData = JSON.parse(localStorage.getItem("sb-calendar"));
}

let userName = localStorage.getItem("sb-calendar-userName");
welcomeUser.innerHTML = `<h1>Welcome</h1><div class="nm">${userName}</div>
  <br>
  <p style="padding: 5px 0">Please Scroll Down</p>
  <span id="d1"></span><span id="d2"></span>
  <span id="d3"></span><span id="d4"></span>
  <span id="d5"></span>
  `;

setBord(currentMonth, currentYear);
monthInput.value = monthName[currentMonth];
yearInput.value = currentYear;

// ------- left right month event hendaler -------
leftMonth.addEventListener("click", goLeft);
rightMonth.addEventListener("click", goRight);

// ----- go left right to use touch ---- //
let sx = 0;
const sence = 100;
const lrStart = (e) => {
  sx = e.touches[0].clientX;
}
const lrMove = (e) => {
  let n = sx - e.touches[0].clientX;
  if (n > sence) {
    goLeft();
  } else if (n < -sence) {
    goRight();
  }
}

section.addEventListener("touchstart", lrStart);
section.addEventListener("touchmove", lrMove);
document.body.addEventListener("touchstart", lrStart);
document.body.addEventListener("touchmove", lrMove);

function goLeft() {
  if (currentMonth == 0) {
    currentMonth = 11;
    if (currentYear > 0) {
      currentYear--;
      setYearInInput(currentYear);
    }
  } else if (currentYear > 0) {
    currentMonth--;
    monthInput.value = monthName[currentMonth];
  }
  setBord(currentMonth, currentYear);
}
function goRight() {
  if (currentMonth == 11) {
    currentMonth = 0;
    if (currentYear < 9001) {
      currentYear++;
      setYearInInput(currentYear);
    }
  } else {
    currentMonth++;
    monthInput.value = monthName[currentMonth];
  }
  setBord(currentMonth, currentYear);
}

// -------- input event hendale -----------
monthInput.addEventListener("focusout", (e) => {
  monthInput.setAttribute("type", "text");
  e.target.value = monthName[currentMonth];
});
monthInput.addEventListener("click", (e) => {
  monthInput.setAttribute("type", "number");
  e.target.value =
    currentMonth + 1 < 10 ? `0${currentMonth + 1}` : currentMonth + 1;
  monthInput.select();
});
monthInput.addEventListener("input", (e) => {
  monthInput.setAttribute("type", "number");
  let val = Number(e.target.value);
  if (val > 0 && val < 13) currentMonth = val - 1;
  e.target.value = val;
  setBord(currentMonth, currentYear);
});

//------------------------------------
yearInput.addEventListener("focusout", (e) => {
  setYearInInput(currentYear);
});
yearInput.addEventListener("click", (e) => {
  yearInput.select();
});
yearInput.addEventListener("input", (e) => {
  yearInput.setAttribute("type", "number");
  if (e.target.value > 0 && e.target.value < 9001)
    currentYear = parseInt(e.target.value);
  setBord(currentMonth, currentYear);
});

let wy,
  sy = 0,
  olrady = false;
const touchStart = (e) => {
  wy = e.touches[0].clientY;
  welcomeUser.style.transition = `none`;
};
const touchMove = (e) => {
  if (olrady) return;
  let ny = e.touches[0].clientY;
  let y = wy - ny;
  sy += y * 2;
  if (sy > 200) {
    olrady = true;
    fullScreen.style.top = "-140vh";
  }
  welcomeUser.style.transform = `translateY(${-sy}px)`;
  wy = ny;
};
const touchEnd = (e) => {
  fullScreenPag();
  sy = 0;
  olrady = false;
  welcomeUser.style.transition = `linear 0.3s`;
  welcomeUser.style.transform = `translateY(${-sy}px)`;
};
function getFullScreen() {
  return (
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullscreenElement ||
    document.msFullscreenElement
  );
}
document.addEventListener("fullscreenchange", (e) => {
  if (getFullScreen() === undefined) {
    fullScreen.style.top = 0;
  }
});

function fullScreenPag() {
  if (getFullScreen()) document.exitFullscreen();
  else document.documentElement.requestFullscreen().catch(() => {});
}

welcomeUser.addEventListener("touchstart", touchStart);
welcomeUser.addEventListener("touchmove", touchMove);
welcomeUser.addEventListener("touchend", touchEnd);

colorsSelect.forEach((e, i) => {
  e.addEventListener("click", () => {
    colorsSelect.forEach((E) => {
      if (E.classList.contains("select")) {
        E.classList.remove("select");
      }
    });
    selectedColorI = i;
    e.classList.add("select");
  });
});
addMB_span.addEventListener("click", () => {
  let DATE = addNewInput.value.split("-");
  let spl = inputWhySpecial.value;
  let nm = inputPersonName.value;
  let not = inputNote.value;
  userData.push({
    whySpecial: spl,
    personeName: nm,
    day: DATE[2],
    month: DATE[1],
    year: DATE[0],
    note: not,
    colorI: selectedColorI,
  });
  localStorage.setItem("sb-calendar", JSON.stringify(userData));
  firebase.database().ref(`users/${userId}/saveData`).set(userData);
  setMemberData();
  setBord(currentMonth, currentYear);
  addNewInput.value = "2001-07-07";
  inputNote.value = "";
  inputWhySpecial.value = "";
  inputPersonName.value = "";
  selectedColorI = 0;
  main.style.top = `calc(100vh - ${main.clientHeight}px)`;
  openTab.style.bottom = `${main.clientHeight}px`;
  addMemberFlotingWindow.classList.remove("active");
});

//------------------------------------------------
close_flot_tab.addEventListener("click", () => {
  addMemberFlotingWindow.classList.remove("active");
});
openNewMT.addEventListener("click", () => {
  addMemberFlotingWindow.classList.add("active");
});
function setYearInInput(year) {
  yearInput.value =
    year < 10
      ? `000${year}`
      : year < 100
      ? `00${year}`
      : year < 1000
      ? `0${year}`
      : year;
}

//---------------------------------------------------
dayInformation.style.display = `grid`;
dayInfCloseBtn.addEventListener("click", () => {
  dayInformation.style.background = `transparent`;
  setTimeout(() => {
    dayInformation.style.transform = `scale(0)`;
  }, 100);
  setTimeout(() => {
    scrollCard.innerHTML = "";
    dayInformation.style.transform = `scale(0)`;
  }, 300);
});

// --------------------------------------------------
function setBord(month, year) {
  section.innerHTML = "";

  // set days name
  sortDayName.forEach((e) => {
    const n = document.createElement("div");
    n.innerText = e;
    n.classList.add("day-name");
    section.appendChild(n);
  });

  let gapDays = new Date(year, month).getDay();

  for (i = 0; i < gapDays; i++) {
    const n = document.createElement("div");
    n.innerText = "";
    n.classList.add("_gap");
    section.appendChild(n);
  }

  // set when lipyer and month is feb
  let newMonth = isLepeYear(year) && month === 1 ? 29 : months[month];
  for (let i = 1; i <= newMonth; i++) {
    const n = document.createElement("div");
    n.innerText = i;
    n.classList.add("days");

    userData.forEach((e) => {
      if (
        year >= parseInt(e.year) &&
        parseInt(e.day) == i &&
        parseInt(e.month) == month + 1
      ) {
        n.classList.add(`bg${e.colorI}`);
        n.classList.add(`glow`);
        createDayInfo(n, e);
        n.addEventListener("click", () => {
          dayInformation.style.display = `scale(1)`;
          setTimeout(() => {
            dayInformation.style.background = `rgba(0, 0, 0, 0.6)`;
          }, 200);
        });
      }
    });
    if (
      year === tudayDate.year &&
      month === tudayDate.month &&
      tudayDate.day == i
    ) {
      n.classList.add("tuday");
      n.classList.add("glow");
    } else if (i % 2 && !n.classList.contains("glow")) {
      n.classList.add("odd");
    }
    section.appendChild(n);
  }
}

function giveMeName(str) {
  let s = "";
  str.split(" ").forEach((e) => {
    s += `<p>${e}</p>`;
  });
  return s;
}

function createDayInfo(element, obj) {
  element.addEventListener("click", () => {
    dayInformation.style.transform = `scale(1)`;
    setTimeout(() => {
      dayInformation.style.background = `rgba(0, 0, 0, 0.6)`;
    }, 200);

    let _year = parseInt(obj.year),
      _months = parseInt(obj.month) - 1,
      _days = parseInt(obj.day);
    let y;

    if (!isLepeYear(_d.getFullYear()) && _months == 1) {
      y = _d.getFullYear() + (4 - (_d.getFullYear() % 4));
    } else if (_months > _d.getMonth()) {
      y = _d.getFullYear();
    } else {
      y = _d.getFullYear() + 1;
    }

    let nextAge = new Date(y, _months, _days);
    let age = new Date(_year, _months, _days);
    let currentAge = new Date(currentYear, currentMonth, _days);

    let totalAge = getAge(age, _d);
    let leftAge = getAge(_d, nextAge, true);

    dayInfDate.innerHTML = `${obj.day}-${obj.month}-${currentYear}`;
    showDayName.innerHTML = daysName[currentAge.getDay()];
    scrollCard.innerHTML += `<div class="card bg${obj.colorI}">
    <div class="card-inset"> 
      <div class="-card-back"></div>
      <div class="why-special">${obj.whySpecial}</div> 
      <div class="start-date-dayname">
        ${obj.day}-${obj.month}-${obj.year}  ${daysName[age.getDay()]}
      </div>
      <div class="person-name">
         ${giveMeName(obj.personeName)}
      </div>
      <div class="note">
        <p>
        ${obj.note}
        </p>
      </div>
      <div class="time-left">
        <legend><p>Time Left</p></legend>
        <div class="-block">
          <div class="-months flex">
            <div class="key">Months:</div>
            <div class="value">${leftAge.months}</div>
          </div>
          <div class="-day flex">
            <div class="key">Day:</div>
            <div class="value">${leftAge.days}</div>
          </div>
          <div class="-hours flex">
            <div class="key">Hours:</div>
            <div class="value">${leftAge.hours}</div>
          </div>
          <div class="-minutes flex">
            <div class="key">Minutes:</div>
            <div class="value">${leftAge.minutes}</div>
          </div>
        </div>
      </div>
      <div class="total-time">
        <legend><p>Total Time</p></legend>
        <div class="-block">
          <div class="-years flex">
            <div class="key">Year:</div>
            <div class="value">${totalAge.years}</div>
          </div>
          <div class="-months flex">
            <div class="key">Months:</div>
            <div class="value">${totalAge.months}</div>
          </div>
          <div class="-day flex">
            <div class="key">Day:</div>
            <div class="value">${totalAge.days}</div>
          </div>
          <div class="-hours flex">
            <div class="key">Hours:</div>
            <div class="value">${totalAge.hours}</div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
  });
}

openTab.addEventListener("click", () => {
  if (tabOpenIs) {
    main.style.top = "100vh";
    openTab.style.bottom = 0;
    openTab.classList.remove("active");
  } else {
    main.style.top = `calc(100vh - ${main.clientHeight}px)`;
    openTab.style.bottom = `${main.clientHeight}px`;
    openTab.classList.add("active");
  }
  tabOpenIs = tabOpenIs ? false : true;
});

setMemberData();
function setMemberData() {
  memberList.innerHTML = "";
  userData.forEach((e) => {
    memberList.innerHTML += `
      <div class="members">
        <span>
          <p>${e.personeName}</p>
          <small>${e.day}/${e.month}/${e.year}</small>
        </span>
        <div class="delete">Delete</div>
      </div>
    `;
  });
  Delete = document.querySelectorAll(".delete");
  // ----------- delete member ------------
  Delete.forEach((e, i) => {
    e.addEventListener("click", () => {
      userData.splice(i, 1);
      setMemberData();
      firebase.database().ref(`users/${userId}/saveData`).set(userData);
      localStorage.setItem("sb-calendar", JSON.stringify(userData));
      setBord(currentMonth, currentYear);
      main.style.top = `calc(100vh - ${main.clientHeight}px)`;
      openTab.style.bottom = `${main.clientHeight}px`;
    });
  });
}
const FPS = 2 / 60;
function update() {
  _d = new Date();
  setTimeout(update, 1000 / FPS);
}
update();
