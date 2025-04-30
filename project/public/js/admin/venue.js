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



// Sidebar elements
const sidebar = document.getElementById('sidebar');
const menuButton = document.querySelector('#content nav .bx.bx-menu');
const closeSidebarBtn = document.getElementById('closeSidebarBtn'); // Close button inside the sidebar for mobile

// Apply the saved state immediately to avoid flicker
const savedState = localStorage.getItem('sidebarState');
if (savedState === 'hide') {
    sidebar.classList.add('hide');
} else {
    sidebar.classList.remove('hide');
}

// Toggle the sidebar on mobile and desktop based on the menu button click
menuButton.addEventListener('click', function () {
    // For desktop, just toggle the sidebar visibility without hiding it entirely
    if (window.innerWidth > 768) {
        sidebar.classList.toggle('hide');
    } else {
        // For mobile, toggle show/hide the sidebar
        sidebar.classList.toggle('show');
    }

    // Save the sidebar state (show or hide) in localStorage for future use
    if (sidebar.classList.contains('show') || sidebar.classList.contains('hide')) {
        localStorage.setItem('sidebarState', 'show');
    } else {
        localStorage.setItem('sidebarState', 'hide');
    }
});

// Close sidebar on mobile when close button is clicked
if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', function () {
        sidebar.classList.remove('show');
        localStorage.setItem('sidebarState', 'hide');
    });
}

// Apply the sidebar state when the page loads
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('sidebarState') === 'hide') {
        sidebar.classList.add('hide');
    } else {
        sidebar.classList.remove('hide');
    }
});

// edit btn and checkbox option in menutable
document.addEventListener("DOMContentLoaded", function () {
    let checkboxes = document.querySelectorAll(".checkbox-column");
    let editBtn = document.getElementById("edit-btn");
    let deleteBtn = document.getElementById("delete-btn");
    let selectAllCheckbox = document.getElementById("select-all");
  
    let isEditing = false;
  
    // Hide checkboxes & delete button on load
    checkboxes.forEach(col => col.classList.add("hidden"));
    deleteBtn.classList.add("hidden");
  
    // Toggle checkboxes visibility when clicking Edit button
    editBtn.addEventListener("click", function () {
        isEditing = !isEditing;
        
        if (isEditing) {
            checkboxes.forEach(col => col.classList.remove("hidden")); // Show checkboxes
        } else {
            checkboxes.forEach(col => col.classList.add("hidden")); // Hide checkboxes
            deleteBtn.classList.add("hidden"); // Hide delete button
            selectAllCheckbox.checked = false; // Uncheck Select All
            uncheckAll(); // Uncheck all items
        }
    });
  
    // Handle Select All functionality
    selectAllCheckbox.addEventListener("change", function () {
        let itemCheckboxes = document.querySelectorAll(".item-checkbox");
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
  
        // Trigger change event to update buttons
        updateButtons();
    });
  
    // Listen for individual checkbox changes
    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("item-checkbox")) {
            updateButtons();
        }
    });
  
    // Function to update button visibility based on checkbox selection
    function updateButtons() {
        let checkedItems = document.querySelectorAll(".item-checkbox:checked").length;
        let totalItems = document.querySelectorAll(".item-checkbox").length;
  
        if (checkedItems > 0) {
            editBtn.classList.add("hidden"); // Hide Edit button
            deleteBtn.classList.remove("hidden"); // Show Delete button
        } else {
            editBtn.classList.remove("hidden"); // Show Edit button
            deleteBtn.classList.add("hidden"); // Hide Delete button
        }
  
        // Update Select All checkbox
        selectAllCheckbox.checked = (checkedItems === totalItems);
    }
  
    // Function to uncheck all checkboxes
    function uncheckAll() {
        let itemCheckboxes = document.querySelectorAll(".item-checkbox");
        itemCheckboxes.forEach(checkbox => checkbox.checked = false);
        updateButtons();
    }
});

// Function to delete venues (both single and multiple)
function deleteVenues(venueNames) {
    if (!Array.isArray(venueNames)) {
        venueNames = [venueNames];
    }

    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${venueNames.length > 1 ? 'these venues' : 'this venue'}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch('/admin/venue/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ venueNames })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove rows from table
                    venueNames.forEach(name => {
                        const row = document.querySelector(`tr[data-name="${name}"]`);
                        if (row) row.remove();
                    });

                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: data.message || 'Venue(s) deleted successfully'
                    });

                    // Reset UI for multiple deletes
                    if (venueNames.length > 1) {
                        document.getElementById('select-all').checked = false;
                        document.getElementById('delete-btn').classList.add('hidden');
                        document.getElementById('edit-btn').classList.remove('hidden');
                    }
                } else {
                    throw new Error(data.message || 'Failed to delete venue(s)');
                }
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.message || 'Something went wrong while deleting'
                });
            });
        }
    });
}

// Function to delete a single venue
function deleteSingleVenue(button) {
    const row = button.closest('tr');
    const venueName = row.getAttribute('data-name');

    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${venueName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Send delete request
            fetch('/admin/venue/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ venueName: venueName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    row.remove();
                    Swal.fire('Deleted!', data.message, 'success');
                } else {
                    throw new Error(data.message || 'Failed to delete venue');
                }
            })
            .catch(error => {
                Swal.fire('Error!', error.message, 'error');
            });
        }
    });
}

// Function to delete multiple selected venues
function deleteSelectedItems() {
    const selectedCheckboxes = document.querySelectorAll('.item-checkbox:checked');
    const selectedVenues = Array.from(selectedCheckboxes).map(checkbox => 
        checkbox.closest('tr').getAttribute('data-name')
    );

    if (selectedVenues.length === 0) {
        Swal.fire('No Selection', 'Please select venues to delete.', 'info');
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${selectedVenues.length} selected venues?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete them!'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Deleting...',
                text: 'Please wait...',
                allowOutsideClick: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Send delete request
            fetch('/admin/venue/delete-multiple', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify({ venueNames: selectedVenues })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    selectedVenues.forEach(name => {
                        const row = document.querySelector(`tr[data-name="${name}"]`);
                        if (row) row.remove();
                    });
                    
                    // Reset UI
                    document.getElementById('select-all').checked = false;
                    document.getElementById('delete-btn').classList.add('hidden');
                    document.getElementById('edit-btn').classList.remove('hidden');
                    
                    Swal.fire('Deleted!', data.message, 'success');
                } else {
                    throw new Error(data.message || 'Failed to delete venues');
                }
            })
            .catch(error => {
                Swal.fire('Error!', error.message, 'error');
            });
        }
    });
}

// Setup event listeners when document is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Individual delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const venueName = this.closest('tr').getAttribute('data-name');
            deleteVenues(venueName);
        });
    });

    // Bulk delete button
    const deleteBtn = document.getElementById('delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const selectedNames = Array.from(document.querySelectorAll('.item-checkbox:checked'))
                .map(checkbox => checkbox.closest('tr').getAttribute('data-name'));
            
            if (selectedNames.length === 0) {
                Swal.fire('No Selection', 'Please select venues to delete.', 'info');
                return;
            }
            
            deleteVenues(selectedNames);
        });
    }

    // Add click handlers to individual delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = function() {
            deleteSingleVenue(this);
        };
    });
});

// Function to filter venues based on the selected category
function filterVenues() {
    var filterValue = document.getElementById('venueFilter').value;
    var rows = document.getElementById('venueTableBody').getElementsByTagName('tr');
    
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (filterValue === 'all') {
            row.style.display = '';
        } else if (row.classList.contains(filterValue)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}


// modal
document.getElementById("addVenueBtn").addEventListener("click", function() {
    document.getElementById("venueModal").style.display = "block";
});

document.querySelector(".close").addEventListener("click", function() {
    document.getElementById("venueModal").style.display = "none";
});

window.onclick = function(event) {
    if (event.target == document.getElementById("venueModal")) {
        document.getElementById("venueModal").style.display = "none";
    }
};

// Show/Hide Floor Level or Other Location input based on selection
document.getElementById("venueLocation").addEventListener("change", function() {
    let floorGroup = document.getElementById("venueFloorGroup");
    let otherGroup = document.getElementById("venueOtherGroup");

    if (this.value === "Dande's Resto") {
        floorGroup.style.display = "block";
        otherGroup.style.display = "none";
    } else if (this.value === "Other") {
        floorGroup.style.display = "none";
        otherGroup.style.display = "block";
    } else {
        floorGroup.style.display = "none";
        otherGroup.style.display = "none";
    }
});

// Handle multiple image preview
document.getElementById("venueImage").addEventListener("change", function(event) {
    let previewContainer = document.getElementById("venueImagePreviewContainer");

    Array.from(event.target.files).forEach((file) => {
        let reader = new FileReader();
        reader.onload = function(e) {
            let previewDiv = document.createElement("div");
            previewDiv.classList.add("image-preview");

            let img = document.createElement("img");
            img.src = e.target.result;

            let removeBtn = document.createElement("button");
            removeBtn.textContent = "×";
            removeBtn.classList.add("remove-btn");
            removeBtn.addEventListener("click", function() {
                previewDiv.remove();
            });

            previewDiv.appendChild(img);
            previewDiv.appendChild(removeBtn);
            previewContainer.appendChild(previewDiv);
        };
        reader.readAsDataURL(file);
    });

    event.target.value = "";
});

// Add this function to process folders recursively
function processEntry(entry, addImagePreview) {
    if (entry.isFile) {
        entry.file(file => {
            if (file.type.startsWith('image/')) {
                addImagePreview(file);
            }
        });
    } else if (entry.isDirectory) {
        const reader = entry.createReader();
        reader.readEntries(entries => {
            entries.forEach(entry => processEntry(entry, addImagePreview));
        });
    }
}

// Image upload functionality
document.addEventListener("DOMContentLoaded", function () {
    const dropArea = document.getElementById('dropArea');
    const previewContainer = document.getElementById('venueImagePreviewContainer');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const fileInput = document.getElementById('venueImage');
    const dataTransfer = new DataTransfer();
    
    previewContainer.style.maxHeight = '300px';
    previewContainer.style.overflowY = 'auto';
    
    // Update file input to accept folders
    fileInput.setAttribute('webkitdirectory', '');
    fileInput.setAttribute('directory', '');
    fileInput.setAttribute('multiple', '');
    
    // Function to check if an image already exists in the preview
    function imageExists(dataUrl) {
        const existingImages = previewContainer.querySelectorAll('img');
        return Array.from(existingImages).some(img => img.src === dataUrl);
    }
    
    // Add image preview to the container
    function addImagePreview(file) {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            if (imageExists(dataUrl)) return;
    
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-preview');
    
            const img = document.createElement('img');
            img.src = dataUrl;
    
            const fileInfo = document.createElement('span');
            fileInfo.classList.add('file-name');
            fileInfo.textContent = file.name;
    
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '×';
            removeBtn.classList.add('remove-btn');
            removeBtn.onclick = () => {
                const index = Array.from(dataTransfer.files).findIndex(f => f.name === file.name);
                if (index !== -1) dataTransfer.items.remove(index);
                wrapper.remove();
                togglePlaceholder();
            };
    
            wrapper.appendChild(removeBtn);
            wrapper.appendChild(img);
            wrapper.appendChild(fileInfo);
            previewContainer.appendChild(wrapper);
            togglePlaceholder();
        };
        reader.readAsDataURL(file);
    
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
    }
    
    // Update drop event handler to process folders
    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        
        const items = e.dataTransfer.items;
        
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry?.();
            if (entry) {
                processEntry(entry, addImagePreview);
            } else {
                const file = items[i].getAsFile?.();
                if (file) {
                    addImagePreview(file);
                }
            }
        }
    });

    // Update file input change handler to process folders
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        Array.from(files).forEach(file => {
            addImagePreview(file);
        });
    });
    
    // Keep existing event listeners and functions...
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });
    
    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });
    
    clearAllBtn.addEventListener('click', () => {
        previewContainer.innerHTML = '<p id="placeholderText" class="placeholder-text">Drop images or folders here</p>';
        dataTransfer.clearData();
        fileInput.files = dataTransfer.files;
    });
    
    function togglePlaceholder() {
        const placeholder = document.getElementById('placeholderText');
        const hasImages = previewContainer.querySelectorAll('.image-preview').length > 0;
        placeholder.style.display = hasImages ? 'none' : 'block';
    }

    dropArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Handle form submission
    const saveVenueBtn = document.getElementById('saveVenueBtn');
    saveVenueBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('venueName', document.getElementById('venueName').value);
        formData.append('venueLocation', document.getElementById('venueLocation').value);
        formData.append('venueCapacity', document.getElementById('venueCapacity').value);
        formData.append('floors', document.getElementById('floorsField').value);
        
        if (document.getElementById('venueLocation').value === 'Other') {
            formData.append('venueOther', document.getElementById('venueOther').value);
        }
        
        // Get all images from the preview container
        const previewContainer = document.getElementById('venueImagePreviewContainer');
        const previewImages = previewContainer.querySelectorAll('.image-preview img');
        
        for (let i = 0; i < previewImages.length; i++) {
            const img = previewImages[i];
            // Convert base64 to blob
            const response = await fetch(img.src);
            const blob = await response.blob();
            formData.append('images[]', blob, `image${i}.jpg`);
        }
        
        try {
            const response = await fetch('/venue/store', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            const data = await response.json();
            
            if (data.success) {
                showNotification('Venue added successfully!');
                document.getElementById('venueModal').style.display = 'none';
                location.reload();
            } else {
                showNotification(data.message || 'Error adding venue', false);
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Error adding venue', false);
        }
    });
});

// Notification function
function showNotification(message, isSuccess = true) {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    notification.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function toggleDropdown() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.classList.toggle('show');
  }
  
  // Close dropdown if clicked outside
  window.onclick = function(event) {
    if (!event.target.matches('.nav-profile, .nav-profile img')) {
        const dropdown = document.getElementById('profileDropdown');
        if (dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
  };

// Add this JavaScript for handling floor levels
document.addEventListener('DOMContentLoaded', function() {
    const venueLocation = document.getElementById('venueLocation');
    const venueOtherGroup = document.getElementById('venueOtherGroup');
    const venueFloorInput = document.getElementById('venueFloorInput');
    const floorList = document.getElementById('floorList');
    const floorsField = document.getElementById('floorsField');

    // Handle location change
    venueLocation.addEventListener('change', function() {
        venueOtherGroup.style.display = this.value === 'Other' ? 'block' : 'none';
    });

    // Clear the floor list
    function clearFloorList() {
        floorList.innerHTML = '';
        updateFloorsInput();
    }

    // Update the floors field when floors are added or removed
    function updateFloorsInput() {
        const floors = Array.from(floorList.querySelectorAll('.floor-item span'))
            .map(span => span.textContent.trim());
        floorsField.value = floors.join(',');
    }

    // Add a floor to the list
    function addFloor(floorValue) {
        const trimmedValue = floorValue.trim();
        if (!trimmedValue) return;

        // Check if floor already exists
        const existingFloors = Array.from(floorList.querySelectorAll('.floor-item span'))
            .map(span => span.textContent.trim());

        if (existingFloors.includes(trimmedValue)) {
            showToast('Floor level already exists!', 'error');
            return;
        }

        const floorItem = document.createElement('div');
        floorItem.classList.add('floor-item');

        const floorText = document.createElement('span');
        floorText.textContent = trimmedValue;

        const deleteBtn = document.createElement('button2');
        deleteBtn.innerHTML = '❌';
        deleteBtn.style.cursor = 'pointer'; 
        deleteBtn.addEventListener('click', function() {
            floorItem.remove();
            updateFloorsInput();
        });

        floorItem.appendChild(floorText);
        floorItem.appendChild(deleteBtn);
        floorList.appendChild(floorItem);
        updateFloorsInput();
    }

    // Listen for 'Enter' key press to add floors
    venueFloorInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addFloor(venueFloorInput.value);
            venueFloorInput.value = '';
        }
    });

    // Toast notification function
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }
});