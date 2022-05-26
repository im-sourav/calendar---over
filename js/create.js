import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js";
import {
  getDatabase,
  ref,
  get,
  set,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/9.6.7/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const submitBtn = document.querySelector(".submit_btn");
const confirmBtn = document.querySelector(".confirm_btn");
const out = document.querySelectorAll(".out");
const username = document.getElementById("username");
const fullName = document.getElementById("full_name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const coPassword = document.getElementById("coPassword");
const backBtn = document.getElementById("back_btn");
const reotp = document.getElementById("reotp");
const emailText = document.getElementById("email_text");
const verification = document.getElementById("verification");
const gen = document.querySelectorAll(".gn");
const cover = document.querySelectorAll(".cover");
const outInput = document.querySelectorAll(".Input");
const otpInput = document.querySelectorAll(".otp");
const statusUser = document.querySelectorAll(".status_user");
let gender, otpIs;

outInput.forEach((e, i) => {
  e.addEventListener("input", (event) => {
    if (!event.target.value.length) {
      cover[i].classList.remove("active");
      return;
    }
    cover[i].classList.add("active");
  });
});

let vPass,
  cPass,
  passOneTime,
  allCondition = [0, 0, 0, 0, 0, 0],
  subBtnClickbel,
  conBtnClickbel,
  otpOut;

function remInpUndCls(index) {
  out[index].classList.remove("u1");
  out[index].classList.remove("u2");
}

const underline = (index, color) => {
  let Color = color == "red" ? "u1" : "u2";
  let opoColor = Color == "u1" ? "u2" : "u1";
  out[index].classList.add(Color);
  out[index].classList.remove(opoColor);
};

const valid = (value, i) => {
  if (i == 0) {
    if (/^([a-zA-Zà-úÀ-Ú]{2,})+\s+([a-zA-Zà-úÀ-Ú\s]{2,})+$/.test(value)) {
      underline(0);
      allCondition[0] = 1;
      buttonIsActivet();
    } else {
      underline(0, "red");
      allCondition[0] = 0;
      buttonIsActivet();
    }
  } else if (i == 1) {
    return /^([a-zA-Z0-9]{4,16})+$/.test(value);
  } else if (i == 2) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
  } else if (i == 3) {
  }
};

let userText = [
  ["Username", "Username already exist!"],
  ["Email", "Email already used!"],
];
const findInFirebase = (refChild, value, index) => {
  const db = getDatabase();

  const que = query(ref(db, "users"), orderByChild(refChild), equalTo(value));
  get(que)
    .then((snapshot) => {
      // console.log(index, value, snapshot.exists(), valid(value, index));
      if (!snapshot.exists() && valid(value, index)) {
        underline(index);
        allCondition[index] = 1;
        buttonIsActivet();
        if (!snapshot.exists())
          statusUser[index - 1].innerHTML = userText[index - 1][0];
      } else {
        underline(index, "red");
        allCondition[index] = 0;
        buttonIsActivet();
        if (snapshot.exists())
          statusUser[index - 1].innerHTML = userText[index - 1][1];
      }
    })
    .catch((error) => {
      // console.log(error);
    });
};

const buttonIsActivet = () => {
  try {
    allCondition[5] = 1;
    gender = document.querySelector('input[name="gen"]:checked').value;
  } catch (e) {
    allCondition[5] = 0;
  }
  const every = allCondition.every((e) => e);
  if (every) {
    submitBtn.style.background = "#2819aa";
    subBtnClickbel = true;
  } else {
    submitBtn.style.background = "#2819aa99";
    subBtnClickbel = false;
  }
};

// ------------ chack valid naem ------------
fullName.addEventListener("input", (e) => {
  let val = e.target.value;
  if (!val.length) {
    remInpUndCls(0);
    allCondition[0] = 0;
    return;
  }
  valid(val, 0);
});

// -----------chack valid username -----------
username.addEventListener("input", (e) => {
  let val = e.target.value;
  if (!val.length) {
    remInpUndCls(1);
    allCondition[1] = 0;
    return;
  }
  findInFirebase("username", val, 1);
});

// ----------- email chacking -------------
email.addEventListener("input", (e) => {
  let val = e.target.value;
  if (!val.length) {
    remInpUndCls(2);
    allCondition[2] = 0;
    return;
  }
  findInFirebase("email", val, 2);
});

// -------- chack password and confirm password are same ------
password.addEventListener("input", (e) => {
  if (e.target.value.length < 8 && !passOneTime) {
    remInpUndCls(3);
    remInpUndCls(4);
    allCondition[3] = 0;
    allCondition[4] = 0;
    buttonIsActivet();
    return;
  }
  if (e.target.value.length < 8) {
    underline(3, "red");
    allCondition[3] = 0;
    buttonIsActivet();
    passOneTime = true;
  } else {
    vPass = e.target.value;
    underline(3);
    allCondition[3] = 1;
    buttonIsActivet();
    if (cPass) {
      if (vPass === cPass) {
        underline(4);
        allCondition[4] = 1;
        buttonIsActivet();
      } else {
        remInpUndCls(4);
        allCondition[4] = 0;
        buttonIsActivet();
      }
    }
  }
});

coPassword.addEventListener("input", (e) => {
  if (e.target.value !== vPass) {
    underline(4, "red");
    allCondition[4] = 0;
    buttonIsActivet();
    cPass = 0;
  } else {
    cPass = e.target.value;
    underline(4);
    allCondition[4] = 1;
    buttonIsActivet();
  }
});

// ---------------- gender -------------
gen.forEach((e) => {
  e.addEventListener("change", () => {
    buttonIsActivet();
  });
});

// otp input---------------
otpInput.forEach((E, i) => {
  E.addEventListener("input", (e) => {
    let val = e.target.value;
    if (val.length && i < 3) otpInput[i + 1].select();
    else if (!val.length && i > 0) otpInput[i - 1].select();

    if (val.length && i <= 3) {
      E.style.borderBottom = "2px solid #00ff00";
    } else if (!val.length && i >= 0) {
      E.style.borderBottom = "2px solid #555";
    }
    verityBtnIsActive();
  });
});

// submit button
submitBtn.addEventListener("click", () => {
  if (!subBtnClickbel) return;
  setOTP();
  emailText.innerText = email.value;
  verification.style.display = "block";
});

// confirm button
confirmBtn.addEventListener("click", () => {
  if (!conBtnClickbel) return;
  if (otpOut != b36t10(otpIs)) {
    otpInput.forEach((E) => {
      E.style.borderBottom = "2px solid #f00";
    });
    return;
  } else {
    createAccount(
      fullName.value,
      username.value,
      gender,
      email.value,
      password.value
    );
  }
});

// resend otp
reotp.addEventListener("click", () => {
  setOTP();
  conBtnClickbel = true;
});

// back button
backBtn.addEventListener("click", () => {
  verification.style.display = "none";
});

// create firebase cloud store account
function createAccount(fullName, username, gender, email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      let uid = auth.currentUser.uid;
      saveDatabase(
        uid,
        fullName,
        username,
        email,
        parseInt(password, 36),
        gender
      );
      const date = new Date();
      let userData = [
        {
          whySpecial: "SignUp Day",
          personeName: fullName,
          day: date.getDate(),
          month: date.getMonth()+1,
          year: date.getFullYear(),
          note: `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()} তে তুমি প্রথম sign up করেছো আমাদের এই ক্যালেন্ডার অপপলিকাশনে ।
          এখানে নিজের প্রিয় জনের বিশেষ দিনটি save করে রাখো, আর জেনেনেও তার বিশেষ দিনটির ডিটেলস । Thankyou 😊`,
          colorI: 0,
        },
      ];
      localStorage.setItem("sb-calendar", JSON.stringify(userData));
      buttonIsActivet();
    })
    .catch((error) => {
      console.log(error);
    });
}

// send data in firebase data base
function saveDatabase(userId, name, username, email, password, gender) {
  const database = getDatabase();
  set(ref(database, `users/${userId}`), {
    name: name,
    loginDate: Date.now(),
    email: email,
    username: username,
    userId: userId,
    password: password,
    gender: gender,
  })
    .then(() => {
      location.replace("../index.html");
      console.log("Successful");
    })
    .catch((error) => {
      console.log(error);
    });
}

function sendOtp(mail, otp) {
  Email.send({
    SecureToken: "fc640596-5adb-454f-91c5-1cd89d2643d4",
    To: mail,
    From: "wwwapp.cloud@gmail.com",
    Subject: "Calendar Reminder",
    Body: `<div style="width:100%;height:500px;top:0;left:0;background: linear-gradient(55deg, #212121 0%, #212121 40%, #323232 calc(40% + 1px), #323232 70%, #008F95 calc(70% + 1px), #008F95 80%, #14FFEC calc(80% + 1px), #14FFEC 100%);">
    <h1 style="  display: block;text-align: center;margin: 20px 0;color: #fff;text-shadow: 0 0 1px #000, 0 0 3px #000, 0 0 5px #000;">Calendar Reminde You</h1>
    <h3 style="  display: block;margin: 20px 0;text-align: center;background: #ffffff66;padding: 5px;">Your OTP</h3>
    <span style="display:block;text-align:center;font-size:2rem;font-weight:900;color:#0ff;text-shadow:0 0 2px #000;background: #00000055;margin: -20px 100px;">${otp}
    </span>
  </div>`,
  }).then((message) => console.log());
}

// senter()
function verityBtnIsActive() {
  if (
    otpInput[0].value &&
    otpInput[1].value &&
    otpInput[2].value &&
    otpInput[3].value
  ) {
    confirmBtn.style.background = "#2819aa";
    conBtnClickbel = true;
    otpOut = "";
    otpInput.forEach((e) => {
      otpOut += e.value;
    });
  } else {
    confirmBtn.style.background = "#2819aa99";
    conBtnClickbel = false;
  }
}

function setOTP() {
  makeOTP();
  sendOtp(email.value, b36t10(otpIs));
  otpInput.forEach((e) => {
    e.value = "";
  });
}

// genaret otp
function makeOTP() {
  let OTP = "";
  for (let i = 0; i < 4; i++) {
    let rn = ran();
    if (!i && !rn) {
      makeOTP();
      break;
    }
    OTP += rn;
  }
  otpIs = b10t36(OTP);
}
