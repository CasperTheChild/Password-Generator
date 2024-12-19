//  Variables
 
let CopyIcon = document.querySelector("#CopyIcon");
let CopiedMessage = document.querySelector(".CopiedMessage");
let Password = document.querySelector("#Password");

let PassWordLength = 10;

// PassWord Length Input

let LengthInput = document.querySelector("#length");
let LengthInfo = document.querySelector(".PassWordLength");

//  CheckBox

let CheckBox = document.querySelectorAll(".CheckBox");
let ImgBox = document.querySelectorAll(".ImgBox");

//  Generate Button

let GenerationButton = document.querySelector("#GenerationButton");

//  Strength

let Strong = document.querySelector(".Strong");
let Medium = document.querySelector(".Medium");
let Weak = document.querySelector(".Weak");
let TooWeak = document.querySelector(".TooWeak");

let GraphBox = document.querySelectorAll(".GraphBox");

Strong.style.display = "none";
Medium.style.display = "none";
Weak.style.display = "none";
TooWeak.style.display = "none";

//  Colors

const root = document.documentElement;

const computedStyle = getComputedStyle(root);

const LightMintGreen = computedStyle.getPropertyValue('--Light-Mint-Green').trim();
const VeryDarkGrayishPurple = computedStyle.getPropertyValue('--Very-Dark-Grayish-Purple').trim();

//  Functions

function CheckBoxToggle(index) { 
    let associatedImgBox = ImgBox[index];
    let Image = ImgBox[index].querySelector("img");

    associatedImgBox.classList.toggle("active");
    Image.classList.toggle("active");
}

function CheckBoxAdd(index) { 
    let associatedImgBox = ImgBox[index];
    let Image = ImgBox[index].querySelector("img");

    associatedImgBox.classList.add("active");
    Image.classList.add("active");
}

function CheckBoxRemove(index) { 
    let associatedImgBox = ImgBox[index];
    let Image = ImgBox[index].querySelector("img");

    associatedImgBox.classList.remove("active");
    Image.classList.remove("active");
}

function UpdateLength() { 
    PassWordLength = LengthInput.value > 15? 15: LengthInput.value;
    LengthInfo.innerHTML = PassWordLength;

    let percentage = 100 * (PassWordLength - 5) / 10;

    LengthInput.style.background = `linear-gradient(to right, ${LightMintGreen} ${percentage}%, ${VeryDarkGrayishPurple} ${percentage}%)`;
}

//  AddEventListener

Password.addEventListener("input", function () {
    //let PreviousLength = 0;

    if (Password.value.length === 0 || PreviousLength > Password.value.length) { 
        for (let i = 0; i < ImgBox.length; i++) { 
            CheckBoxRemove(i);
        }
    }

    if (/[A-Z]/.test(Password.value)) {
        CheckBoxAdd(0);
    }
    
    if (/[a-z]/.test(Password.value)) {
        CheckBoxAdd(1);
    }
    
    if (/\d/.test(Password.value)) {
        CheckBoxAdd(2);
    }
    
    if (/[!@#$%^&*(),.?":{}|<>]/.test(Password.value)) {
        CheckBoxAdd(3);
    }

    //PreviousLength = Password.value.length;     "I thought I could make it check when the Password.value.length is shortened"

    // Strength Checker

    let countdownTime = 2;  // 2 seconds

    UpdateLength();         //  It doesn't work anyway. It should change when users enter their own passwords
    StrengthCalculator();   
})

document.querySelector('input[type="text"]').addEventListener('contextmenu', function (e) {     /*      Doesn't work        */
    e.preventDefault();
});

CopyIcon.addEventListener("click", function () {    // Copy Button
    CopiedMessage.classList.add("active");
    CopyIcon.classList.add("active");

    //  Copy

    Password.select();
    Password.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(Password.value);    //  Is catching error necessary?

    //  Timer

    let countdownTime = 1;  // 1 seconds

    let timerInterval = setInterval(function () {
        if (countdownTime <= 0) {
            clearInterval(timerInterval);
            CopiedMessage.classList.remove("active");
            CopyIcon.classList.remove("active");
        } else {
            countdownTime--; 
        }
    }, 1000);
});

LengthInput.addEventListener("input", UpdateLength())     //  Password Range

CheckBox.forEach((checkbox, index) => {                     // Checkbox
    checkbox.addEventListener("click", function () {
        CheckBoxToggle(index)
    });
});

GenerationButton.addEventListener("mouseup", function () {          // Generates a new password
    StrengthCalculator()


    const UpperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const Digits = '0123456789';
    const SpecialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let AllChars = "";
    
    //  Function

    for (let i = 0; i < ImgBox.length; i++) { 
        if (ImgBox[i].classList.contains("active")) { 
            switch (i) { 
                case 0:
                    AllChars += UpperCase;
                    break;
                case 1:
                    AllChars += LowerCase;
                    break;
                case 2:
                    AllChars += Digits;
                    break;
                case 3:
                    AllChars += SpecialChars;
                    break;     
            }
        }
    }

    if (AllChars === "") {
        alert("Password symbols should be chosen");     // I had to write it as there were no any design in figma
        return;
    }

    let password = "";

    for (let i = 0; i < PassWordLength; i++) {
        password += AllChars[Math.floor(Math.random() * AllChars.length)];
    }

    Password.value = password;

    //  Style

    let children = Array.from(GenerationButton.children);

    children.forEach(child => { 
        child.classList.toggle("clicked");
    });

    GenerationButton.classList.toggle("clicked");
});


function StrengthCalculator() {     // Calculates the strength of the password
    Strong.style.display = "none";
    Medium.style.display = "none";
    Weak.style.display = "none";
    TooWeak.style.display = "none";

    for (let i = 0; i < GraphBox.length; i++) { 
        GraphBox[i].className = "";
        GraphBox[i].classList.add("GraphBox");
    }
    
    let Strength = 0;

    Strength += /[A-Z]/.test(Password.value) ? 1 : 0;
    Strength += /[a-z]/.test(Password.value) ? 1 : 0;
    Strength += /\d/.test(Password.value) ? 1 : 0;
    Strength += /[!@#$%^&*(),.?":{}|<>]/.test(Password.value) ? 1 : 0;
    
    if (PassWordLength > 12) {
        Strength += 2;
    }
    else if (PassWordLength > 8) {
        Strength += 1;
    }

    if (PassWordLength > 5) {
        if (Strength == 6) {
            Strong.style.display = "block";

            for (let i = 0; i < GraphBox.length; i++) { 
                GraphBox[i].classList.add("green");
            }
        }
        else if (Strength > 3) {
            Medium.style.display = "block";

            for (let i = 0; i < GraphBox.length - 1; i++) { 
                GraphBox[i].classList.add("yellow");
            }
        }
        else if (Strength > 1) {
            Weak.style.display = "block";

            for (let i = 0; i < GraphBox.length - 2; i++) { 
                GraphBox[i].classList.add("orange");
            }
        }
        else { 
            TooWeak.style.display = "block";

            for (let i = 0; i < GraphBox.length - 3; i++) { 
                GraphBox[i].classList.add("red");
            }
        }
    }
}