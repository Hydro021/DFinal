const pageBox = document.querySelector('.page-box');
const btnNext = document.querySelector('.btn-next');
const btnBack = document.querySelector('.btn-back');
const checkboxPass = document.querySelector('.checkbox-pass');
const passwordInput = document.querySelector('.password');
const loginTitle = document.querySelector('.loginTitle-text');
const userEmail = document.querySelector('.user-email');
const emailInput = document.querySelector('.email');

// Create validation message element
const validationMessage = document.createElement('p');
validationMessage.innerText = 'Please enter your username';
validationMessage.style.color = 'red';
validationMessage.style.fontSize = '14px';
validationMessage.style.marginTop = '5px';
validationMessage.style.display = 'none'; // Hide initially
emailInput.parentNode.appendChild(validationMessage); // Add below the input

// Handle "Next" button click
btnNext.onclick = (e) => {
    e.preventDefault();

    if (emailInput.value.trim() === '') {
        validationMessage.style.display = 'block'; // Show message only when clicking "Next"
        return; // Stop execution if input is empty
    }

    // Hide validation message and proceed to password input
    validationMessage.style.display = 'none';
    pageBox.classList.add('active-pass');
    setTimeout(() => passwordInput.focus(), 500);
    loginTitle.innerHTML = 'Welcome';
    userEmail.innerHTML = emailInput.value;
};

// Handle "Back" button click
btnBack.onclick = (e) => {
    e.preventDefault();
    pageBox.classList.remove('active-pass');
    loginTitle.innerHTML = 'Login';
    userEmail.innerHTML = 'Please login to use the admin panel';
    emailInput.focus();
};

// Toggle password visibility
checkboxPass.onclick = () => {
    passwordInput.type = checkboxPass.checked ? 'text' : 'password';
};
document.addEventListener("DOMContentLoaded", function () {
    // Check if there's a stored username in localStorage
    const savedUsername = localStorage.getItem("rememberedUsername");
    if (savedUsername) {
        document.getElementById("username").value = savedUsername;
        document.getElementById("rememberMe").checked = true; // Keep checkbox checked
    }
});

// Store username when "Remember Me" is checked
document.getElementById("rememberMe").addEventListener("change", function () {
    if (this.checked) {
        const usernameValue = document.getElementById("username").value;
        localStorage.setItem("rememberedUsername", usernameValue);
    } else {
        localStorage.removeItem("rememberedUsername");
    }
});

function clearError() {
    let errorMessage = document.getElementById("error-message");
    if (errorMessage) {
        errorMessage.style.display = "none";
    }
}