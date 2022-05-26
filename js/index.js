import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
  child,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkCookie() {
  let user = getCookie("sb-calendar");
  if (user != "") {
    user = user.split("-");
    signInWithEmailAndPassword(auth, user[0], user[1]).then(
      (userCredential) => {
        location.replace("../html/home.html");
      }
    );
  }
}
checkCookie();

const submitBtn = document.querySelector(".submit_btn");
const out = document.querySelectorAll(".out");
const userOrEmail = document.getElementById("user_or_email");
const password = document.getElementById("password");
const cover = document.querySelectorAll(".cover");
const outInput = document.querySelectorAll(".Input");
let email, user;

outInput.forEach((e, i) => {
  e.addEventListener("input", (event) => {
    if (!event.target.value.length) {
      cover[i].classList.remove("active");
      return;
    }
    cover[i].classList.add("active");
  });
});

let allCondition = [0, 0],
  subBtnClickbel;

const remInpUndCls = (index) => {
  out[index].classList.remove("u1");
  out[index].classList.remove("u2");
};

const underline = (index, color) => {
  let Color = color == "red" ? "u1" : "u2";
  let opoColor = Color == "u1" ? "u2" : "u1";
  out[index].classList.add(Color);
  out[index].classList.remove(opoColor);
};

const valid = (value, i) => {
  if (i == 0) {
    return /[a-zA-Z0-9]{4,16}/.test(value);
  } else {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  }
};
const findInFirebase = (refChild, value, index) => {
  const db = getDatabase();

  const que0 = query(
    ref(db, "users"),
    orderByChild(refChild[0]),
    equalTo(value)
  );
  const que1 = query(
    ref(db, "users"),
    orderByChild(refChild[1]),
    equalTo(value)
  );

  get(que0)
    .then((snapshot) => {
      let data = snapshot.val();
      for (const key in data) data = data[key];
      if (snapshot.exists() && valid(value, 0)) email = data.email;
    })
    .catch((error) => {
      console.log(error);
    });

  get(que1)
    .then((snapshot) => {
      if (snapshot.exists() && valid(value, 1)) email = value;
      updateSetup();
    })
    .catch((error) => {
      console.log(error);
    });

  function updateSetup() {
    if (email) {
      underline(index);
      allCondition[index] = 1;
      buttonIsActivet();
    } else {
      underline(index, "red");
      allCondition[index] = 0;
      buttonIsActivet();
    }
  }
};

const buttonIsActivet = () => {
  const every = allCondition.every((e) => e);
  if (every) {
    submitBtn.style.background = "#2819aa";
    subBtnClickbel = true;
  } else {
    submitBtn.style.background = "#2819aa99";
    subBtnClickbel = false;
  }
};

// -----------chack valid userOrEmail -----------
userOrEmail.addEventListener("input", (e) => {
  let val = e.target.value;
  email = undefined;
  if (!val.length) {
    remInpUndCls(0);
    allCondition[0] = 0;
    return;
  }
  findInFirebase(["username", "email"], val, 0);
});

// -------- chack password and confirm password are same ------
password.addEventListener("input", (e) => {
  if (e.target.value.length < 8) {
    remInpUndCls(1);
    allCondition[1] = 0;
    buttonIsActivet();
    return;
  } else {
    underline(1);
    allCondition[1] = 1;
    buttonIsActivet();
  }
});

// submit button
submitBtn.addEventListener("click", () => {
  if (!subBtnClickbel) return;
  signInWithEmailAndPassword(auth, email, password.value)
    .then((userCredential) => {
      setCookie("sb-calendar", `${email}-${password.value}`, 30);

      const userId = auth.currentUser.uid;
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${userId}/saveData`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const value = snapshot.val();
            localStorage.setItem("sb-calendar", JSON.stringify(value));
          } else {
            localStorage.setItem("sb-calendar", JSON.stringify(""));
          }
          get(child(dbRef, `users/${userId}`)).then((snapshot) => {
            localStorage.setItem("sb-calendar-userName", snapshot.val().name);
            location.replace("../html/home.html");
          });
        })
        .catch((error) => {});
    })
    .catch((err) => {
      console.log(err);
      underline(0, "red");
      underline(1, "red");
    });
});
