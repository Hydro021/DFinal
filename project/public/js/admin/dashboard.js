const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});



  // TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

// Apply the saved state immediately to avoid flicker
const savedState = localStorage.getItem('sidebarState');
if (savedState === 'hide') {
    sidebar.classList.add('hide');
}

// Toggle the sidebar and save the state
menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
    if (sidebar.classList.contains('hide')) {
        localStorage.setItem('sidebarState', 'hide');
    } else {
        localStorage.setItem('sidebarState', 'show');
    }
});



// sidebar in cp
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const menuButton = document.querySelector(".bx-menu");

  menuButton.addEventListener("click", function () {
      sidebar.classList.toggle("show");
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const menuList = document.querySelector('.menu-list');
  const items = menuList.querySelectorAll('.menu-item');
  const wrapper = document.querySelector('.menu-scroll-wrapper');

  if (items.length < 5) {
    wrapper.style.overflowX = 'hidden';
  } else {
    wrapper.style.overflowX = 'auto';
  }
});
function toggleFullscreen(video) {
  if (!document.fullscreenElement) {
      video.requestFullscreen().catch(err => {
          console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
  } else {
      document.exitFullscreen();
  }
}
function toggleDropdown() {
  const filterBox = document.querySelector('.filter-box');
  const dropdown = document.querySelector('.filter-dropdown');

  filterBox.classList.toggle('active'); 
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('click', function (event) {
  const filterBox = document.querySelector('.filter-box');
  const dropdown = document.querySelector('.filter-dropdown');

  if (!filterBox.contains(event.target)) {
      dropdown.style.display = 'none';
      filterBox.classList.remove('active');
  }
});


// Toggle the profile dropdown when clicking the profile icon
function toggleProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.classList.toggle('show');
}

document.addEventListener('click', function(event) {
  const dropdown = document.getElementById('profileDropdown');
  const profileLink = document.querySelector('.nav-profile');
  
  if (!profileLink.contains(event.target) && !dropdown.contains(event.target)) {
    if (dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  }
});

 function viewProfile() {
   const profileContainer = document.getElementById('profileContainer');
   const dropdown = document.getElementById('profileDropdown');

   dropdown.classList.remove('show');
   profileContainer.classList.add('active');
 }
 document.querySelector('#viewProfile').addEventListener('click', viewProfile);







function toggleProfile() {
  const modal = document.getElementById('profileModal');
  const profileDropdown = document.getElementById('profileDropdown'); // Profile dropdown in navbar
  
  // If the modal is being opened, close the profile dropdown
  if (modal.classList.contains('hidden')) {
    profileDropdown.style.display = 'none';  // Close dropdown when opening the modal
    modal.classList.remove('hidden');       // Show the modal
  }
}

function toggleProfileDropdown() {
  const profileDropdown = document.getElementById('profileDropdown');
  const modal = document.getElementById('profileModal');
  
  // Close the profile dropdown if the modal is open
  if (!modal.classList.contains('hidden')) {
    profileDropdown.style.display = 'none';  // Close dropdown when modal is visible
  } else {
    // Toggle the visibility of the profile dropdown
    profileDropdown.style.display = (profileDropdown.style.display === 'block') ? 'none' : 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('profileModal');
  const closeIcon = document.querySelector('.close-icon');
  const profileDropdown = document.getElementById('profileDropdown');
  
  // Close modal on clicking the "x" icon
  closeIcon.addEventListener('click', () => {
    modal.classList.add('hidden'); // Hide the modal when close button is clicked
    profileDropdown.style.display = 'none';  // Ensure dropdown is closed when modal closes
  });

  // Optional: Close modal when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');  // Hide the modal if clicked outside
      profileDropdown.style.display = 'none';  // Ensure dropdown is closed when modal closes
    }
  });
});







function toggleSettings() { 
  const modal = document.getElementById('settingsModal');
  const profileDropdown = document.getElementById('profileDropdown'); // Profile dropdown in navbar

  // If the modal is being opened, close the profile dropdown
  if (modal.classList.contains('settingshidden')) {
    profileDropdown.style.display = 'none';  // Close dropdown when opening the modal
    modal.classList.remove('settingshidden');  // Show the modal
  } else {
    modal.classList.add('settingshidden');  // Hide the modal if it was visible
  }
}

function toggleProfileDropdown() {
  const profileDropdown = document.getElementById('profileDropdown');
  const modal = document.getElementById('settingsModal');

  // If the modal is visible, close the dropdown
  if (!modal.classList.contains('settingshidden')) {
    profileDropdown.style.display = 'none';  // Close dropdown when modal is open
  } else {
    // Toggle the visibility of the profile dropdown
    profileDropdown.style.display = (profileDropdown.style.display === 'block') ? 'none' : 'block';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('settingsModal');
  const closeIcon = document.querySelector('.settings-close-icon');
  const profileDropdown = document.getElementById('profileDropdown');

  // Close modal on clicking the "x" icon
  closeIcon.addEventListener('click', () => {
    modal.classList.add('settingshidden');  // Hide the modal when close button is clicked
    profileDropdown.style.display = 'none';  // Ensure dropdown is closed when modal closes
  });

  // Optional: Close modal when clicking outside the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('settingshidden');  // Hide the modal if clicked outside
      profileDropdown.style.display = 'none';  // Ensure dropdown is closed when modal closes
    }
  });
});





function toggleProfile() {
  const profileContainer = document.querySelector('.profile-container');
  
  if (profileContainer.classList.contains('show')) {
      profileContainer.classList.remove('show');
  } else {
      profileContainer.classList.add('show');
  }
}

function editProfileImage() {
  alert("You can upload a new profile image!");
}


function toggleProfile() {
	const profileContainer = document.getElementById('profileContainer');
	const mainContent = document.querySelector('.main-content');
	
	profileContainer.classList.toggle('active');
	mainContent.classList.toggle('profile-active');
}



// Edit Profile Logic
const editBtn = document.querySelector('.edit-profile-btn');
const inputs = document.querySelectorAll('.readonly-input');
const passwordInput = document.getElementById('password');
const confirmPasswordRow = document.querySelector('.confirm-password-row');
const confirmPasswordInput = document.getElementById('confirm-password');

let isEditing = false;
let originalPassword = passwordInput.value;

// Create error spans below each detail-row
inputs.forEach(input => {
    const detailRow = input.closest('.detail-row');
    if (detailRow && !detailRow.querySelector('.error-message')) {
        const errorSpan = document.createElement('span');
        errorSpan.classList.add('error-message');
        errorSpan.style.color = 'red';
        errorSpan.style.fontSize = '12px';
        errorSpan.style.display = 'block';
        errorSpan.style.marginTop = '5px';
        detailRow.appendChild(errorSpan);
    }
});

editBtn.addEventListener('click', () => {
    if (isEditing) {
        let hasError = false;

        inputs.forEach(input => {
            const errorSpan = input.closest('.detail-row').querySelector('.error-message');

            // Skip confirm password here and handle separately
            if (input === confirmPasswordInput) return;

            if (input.offsetParent !== null && input.value.trim() === '') {
                errorSpan.textContent = 'This field is required.';
                hasError = true;
            } else {
                errorSpan.textContent = '';
            }
        });

        // Confirm password validation if password changed
        if (passwordInput.value !== originalPassword) {
            const confirmError = confirmPasswordInput.closest('.detail-row').querySelector('.error-message');

            if (confirmPasswordInput.value.trim() === '') {
                confirmError.textContent = 'Please confirm your password.';
                hasError = true;
            } else if (confirmPasswordInput.value !== passwordInput.value) {
                confirmError.textContent = 'Passwords do not match.';
                hasError = true;
            } else {
                confirmError.textContent = '';
            }
        }

        if (hasError) {
            return;
        }
    }

    isEditing = !isEditing;

    inputs.forEach(input => {
        if (isEditing) {
            input.removeAttribute('readonly');
            input.classList.add('editable');
            input.style.pointerEvents = 'auto';
        } else {
            input.setAttribute('readonly', true);
            input.classList.remove('editable');
            input.style.pointerEvents = 'none';
        }
    });

    // Handle confirm password show/hide
    if (isEditing && passwordInput) {
        passwordInput.addEventListener('input', handlePasswordEdit);
    } else {
        confirmPasswordRow.classList.add('hidden');
        confirmPasswordInput.setAttribute('readonly', true);
        confirmPasswordInput.classList.remove('editable');
        confirmPasswordInput.style.pointerEvents = 'none';
        confirmPasswordInput.value = '';
        confirmPasswordInput.closest('.detail-row').querySelector('.error-message').textContent = '';
    }

    if (!isEditing) {
        originalPassword = passwordInput.value;
    }

    editBtn.textContent = isEditing ? 'Save' : 'Edit Profile';
});

// Show confirm password only when password changes
function handlePasswordEdit() {
    if (passwordInput.value !== originalPassword) {
        confirmPasswordRow.classList.remove('hidden');
        confirmPasswordInput.removeAttribute('readonly');
        confirmPasswordInput.classList.add('editable');
        confirmPasswordInput.style.pointerEvents = 'auto';
    } else {
        confirmPasswordRow.classList.add('hidden');
        confirmPasswordInput.setAttribute('readonly', true);
        confirmPasswordInput.classList.remove('editable');
        confirmPasswordInput.style.pointerEvents = 'none';
        confirmPasswordInput.value = '';
        confirmPasswordInput.closest('.detail-row').querySelector('.error-message').textContent = '';
    }
}





// settings edit
const settingsEditBtn = document.querySelector('.change-setting-btn');
const settingsInputs = document.querySelectorAll('.input-field');
const settingsNameDisplay = document.querySelector('.logo-name');
const settingsLocationDisplay = document.querySelector('.logo-location');

let isSettingsEditing = false;

// Add error styling if needed
settingsInputs.forEach(input => {
    const errorContainer = input.parentElement.querySelector('.error');
    if (errorContainer) {
        errorContainer.style.color = 'red';
        errorContainer.style.fontSize = '12px';
        errorContainer.style.marginTop = '5px';
    }
});

settingsEditBtn.addEventListener('click', () => {
    if (isSettingsEditing) {
        let hasSettingsError = false;

        settingsInputs.forEach(input => {
            const errorBox = input.parentElement.querySelector('.error');

            if (input.type !== "file" && input.offsetParent !== null && input.value.trim() === '') {
                errorBox.textContent = 'This field is required.';
                hasSettingsError = true;
            } else {
                errorBox.textContent = '';
            }
        });

        if (hasSettingsError) return;

        // Update text above form
        const newWebsiteName = document.getElementById('website-name').value;
        const newLocation = document.getElementById('restaurant-location').value;
        settingsNameDisplay.textContent = newWebsiteName;
        settingsLocationDisplay.textContent = newLocation;
    }

    isSettingsEditing = !isSettingsEditing;

    settingsInputs.forEach(input => {
        if (input.type !== "file") {
            input.readOnly = !isSettingsEditing;
            input.classList.toggle('editable', isSettingsEditing);
            input.style.pointerEvents = isSettingsEditing ? 'auto' : 'none';
        }
    });

    settingsEditBtn.textContent = isSettingsEditing ? 'Save' : 'Change Settings';
});

