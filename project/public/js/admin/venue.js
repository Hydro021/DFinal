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

// Edit button and checkbox functionality
document.addEventListener("DOMContentLoaded", function () {
    let checkboxes = document.querySelectorAll(".checkbox-column");
    let editBtn = document.getElementById("edit-btn");
    let deleteBtn = document.getElementById("delete-btn");
    let selectAllCheckbox = document.getElementById("select-all");
    let isEditing = false;

    // Initial setup - hide checkboxes & delete button
    checkboxes.forEach(col => col.classList.add("hidden"));
    deleteBtn.classList.add("hidden");

    // Edit button click handler
    editBtn.addEventListener("click", function () {
        isEditing = !isEditing;
        if (isEditing) {
            checkboxes.forEach(col => col.classList.remove("hidden"));
        } else {
            checkboxes.forEach(col => col.classList.add("hidden"));
            deleteBtn.classList.add("hidden");
            selectAllCheckbox.checked = false;
            uncheckAll();
        }
    });

    // Select all checkbox handler
    selectAllCheckbox.addEventListener("change", function () {
        let itemCheckboxes = document.querySelectorAll(".item-checkbox");
        itemCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
        });
        updateButtons();
    });

    // Individual checkbox change handler
    document.addEventListener("change", function (event) {
        if (event.target.classList.contains("item-checkbox")) {
            updateButtons();
        }
    });

    // Update buttons visibility
    function updateButtons() {
        let checkedItems = document.querySelectorAll(".item-checkbox:checked").length;
        let totalItems = document.querySelectorAll(".item-checkbox").length;

        if (checkedItems > 0) {
            editBtn.classList.add("hidden");
            deleteBtn.classList.remove("hidden");
        } else {
            editBtn.classList.remove("hidden");
            deleteBtn.classList.add("hidden");
        }

        selectAllCheckbox.checked = (checkedItems === totalItems);
    }

    // Uncheck all checkboxes
    function uncheckAll() {
        let itemCheckboxes = document.querySelectorAll(".item-checkbox");
        itemCheckboxes.forEach(checkbox => checkbox.checked = false);
        updateButtons();
    }

    // Delete venue function (handles both single and multiple)
    function deleteVenues(names, isMultiple = false) {
        const endpoint = isMultiple ? '/admin/venue/delete-multiple' : '/admin/venue/delete';
        const payload = isMultiple ? { venueNames: names } : { venueName: names[0] };

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${names.length > 1 ? 'these venues' : 'this venue'}?`,
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

                fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        names.forEach(name => {
                            const row = document.querySelector(`tr[data-name="${name}"]`);
                            if (row) row.remove();
                        });

                        // Reset UI for multiple deletes
                        if (names.length > 1) {
                            document.getElementById('select-all').checked = false;
                            document.getElementById('delete-btn').classList.add('hidden');
                            document.getElementById('edit-btn').classList.remove('hidden');
                        }

                        Swal.fire('Deleted!', data.message, 'success');
                    } else {
                        throw new Error(data.message || 'Failed to delete venue(s)');
                    }
                })
                .catch(error => {
                    console.error('Delete error:', error);
                    Swal.fire('Error!', error.message || 'Something went wrong while deleting', 'error');
                });
            }
        });
    }

    // Setup delete button handlers
    // Single delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const venueName = this.closest('tr').getAttribute('data-name');
            deleteVenues([venueName], false);
        });
    });

    // Bulk delete button
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            const selectedVenues = Array.from(document.querySelectorAll('.item-checkbox:checked'))
                .map(checkbox => checkbox.closest('tr').getAttribute('data-name'));
            
            if (selectedVenues.length === 0) {
                Swal.fire('No Selection', 'Please select venues to delete.', 'info');
                return;
            }
            
            deleteVenues(selectedVenues, true);
        });
    }
});

// Function to filter venues based on the selected category
function filterVenues() {
    const filterValue = document.getElementById('venueFilter').value;
    const rows = document.getElementById('venueTableBody').getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const locationCell = row.querySelector('td:nth-child(5)'); // Location column
        const location = locationCell.textContent.trim();
        
        if (filterValue === 'all') {
            row.style.display = '';
        } else if (
            (filterValue === 'dandes-resto' && location.toLowerCase() === "dande's resto") ||
            (filterValue === 'other' && location.toLowerCase() === "other")
        ) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

// Make sure filter is applied when page loads and when dropdown changes
document.addEventListener('DOMContentLoaded', function() {
    filterVenues(); // Apply filter on page load
    document.getElementById('venueFilter').addEventListener('change', filterVenues);
});

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
        previewContainer.innerHTML = '<p id="placeholderText" class="placeholder-text">Images will be shown here</p>';
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

// Add this code to handle real-time search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.venue-search');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const rows = document.querySelectorAll('#venueTableBody tr');
        
        rows.forEach(row => {
            const name = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
            const location = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
            const floorLevel = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
            const specifyLocation = row.querySelector('td:nth-child(7)').textContent.toLowerCase();
            const capacity = row.querySelector('td:nth-child(8)').textContent.toLowerCase();
            
            const matchesSearch = 
                name.includes(searchTerm) ||
                location.includes(searchTerm) ||
                floorLevel.includes(searchTerm) ||
                specifyLocation.includes(searchTerm) ||
                capacity.includes(searchTerm);
                
            row.style.display = matchesSearch ? '' : 'none';
        });
    });
    
    // Add search button click handler
    const searchButton = document.querySelector('.venue-search-btn');
    searchButton.addEventListener('click', function() {
        // Trigger the search when the button is clicked
        const searchEvent = new Event('input');
        searchInput.dispatchEvent(searchEvent);
    });
});

// Add event listeners for edit modal
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.getElementById('editVenueModal').style.display = "block";
    });
});

document.querySelector(".edit-close").addEventListener("click", function() {
    document.getElementById("editVenueModal").style.display = "none";
});

window.onclick = function(event) {
    if (event.target == document.getElementById("editVenueModal")) {
        document.getElementById("editVenueModal").style.display = "none";
    }
};

// Show/Hide Floor Level or Other Location input for edit form
document.getElementById("editVenueLocation").addEventListener("change", function() {
    let floorGroup = document.getElementById("editVenueFloorGroup");
    let otherGroup = document.getElementById("editVenueOtherGroup");

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

// Handle multiple image preview for edit form
document.getElementById("editVenueImage").addEventListener("change", function(event) {
    let previewContainer = document.getElementById("editVenueImagePreviewContainer");

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

// Edit Image upload functionality
document.addEventListener("DOMContentLoaded", function () {
    const editDropArea = document.getElementById('editDropArea');
    const editPreviewContainer = document.getElementById('editVenueImagePreviewContainer');
    const editClearAllBtn = document.getElementById('editClearAllBtn');
    const editFileInput = document.getElementById('editVenueImage');
    const editDataTransfer = new DataTransfer();
    
    editPreviewContainer.style.maxHeight = '300px';
    editPreviewContainer.style.overflowY = 'auto';
    
    // Update file input to accept folders
    editFileInput.setAttribute('webkitdirectory', '');
    editFileInput.setAttribute('directory', '');
    editFileInput.setAttribute('multiple', '');
    
    // Function to check if an image already exists in the preview
    function editImageExists(dataUrl) {
        const existingImages = editPreviewContainer.querySelectorAll('img');
        return Array.from(existingImages).some(img => img.src === dataUrl);
    }
    
    // Add image preview to the container
    function addEditImagePreview(file) {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            if (editImageExists(dataUrl)) return;
    
            const wrapper = document.createElement('div');
            wrapper.classList.add('image-preview');
    
            const img = document.createElement('img');
            img.src = dataUrl;
    
            const fileInfo = document.createElement('div');
            fileInfo.classList.add('file-name');
            fileInfo.textContent = file.name;
    
            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '×';
            removeBtn.classList.add('remove-btn');
            removeBtn.onclick = () => {
                const index = Array.from(editDataTransfer.files).findIndex(f => f.name === file.name);
                if (index !== -1) editDataTransfer.items.remove(index);
                wrapper.remove();
                
                const hasImages = editPreviewContainer.querySelectorAll('.image-preview').length > 0;
                if (!hasImages) {
                    editPreviewContainer.innerHTML = '<p id="editPlaceholderText" class="edit-placeholder-text">Images will be shown here</p>';
                }
            };
    
            wrapper.appendChild(img);
            wrapper.appendChild(fileInfo); // Add file name
            wrapper.appendChild(removeBtn);
            editPreviewContainer.appendChild(wrapper);
            
            // Hide placeholder when adding images
            const placeholder = document.getElementById('editPlaceholderText');
            if (placeholder) {
                placeholder.style.display = 'none';
            }
        };
        reader.readAsDataURL(file);
    
        editDataTransfer.items.add(file);
        editFileInput.files = editDataTransfer.files;
    }
    
    // Update drop event handler to process folders
    editDropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        editDropArea.classList.remove('drag-over');
        
        const items = e.dataTransfer.items;
        
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry?.();
            if (entry) {
                processEditEntry(entry, addEditImagePreview);
            } else {
                const file = items[i].getAsFile?.();
                if (file) {
                    addEditImagePreview(file);
                }
            }
        }
    });

    // Process folders recursively for edit
    function processEditEntry(entry, addImagePreview) {
        if (entry.isFile) {
            entry.file(file => {
                if (file.type.startsWith('image/')) {
                    addImagePreview(file);
                }
            });
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            reader.readEntries(entries => {
                entries.forEach(entry => processEditEntry(entry, addImagePreview));
            });
        }
    }

    editFileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        Array.from(files).forEach(file => {
            addEditImagePreview(file);
        });
    });
    
    editDropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        editDropArea.classList.add('drag-over');
    });
    
    editDropArea.addEventListener('dragleave', () => {
        editDropArea.classList.remove('drag-over');
    });
    
    editClearAllBtn.addEventListener('click', () => {
        editPreviewContainer.innerHTML = '<p id="editPlaceholderText" class="edit-placeholder-text">Images will be shown here</p>';
        editDataTransfer.clearData();
        editFileInput.files = editDataTransfer.files;
    });
    
    function toggleEditPlaceholder() {
        const placeholder = document.getElementById('editPlaceholderText');
        const hasImages = editPreviewContainer.querySelectorAll('.image-preview').length > 0;
        placeholder.style.display = hasImages ? 'none' : 'block';
    }

    editDropArea.addEventListener('click', () => {
        editFileInput.click();
    });
});

// Handle floor levels for edit form
document.addEventListener('DOMContentLoaded', function() {
    const editVenueLocation = document.getElementById('editVenueLocation');
    const editVenueOtherGroup = document.getElementById('editVenueOtherGroup');
    const editVenueFloorInput = document.getElementById('editVenueFloorInput');
    const editFloorList = document.getElementById('editFloorList');
    const editFloorsField = document.getElementById('editFloorsField');

    // Handle location change
    editVenueLocation.addEventListener('change', function() {
        editVenueOtherGroup.style.display = this.value === 'Other' ? 'block' : 'none';
    });

    // Update the floors field when floors are added or removed
    function updateEditFloorsInput() {
        const floors = Array.from(editFloorList.querySelectorAll('.floor-item span'))
            .map(span => span.textContent.trim());
        editFloorsField.value = floors.join(',');
    }

    // Add a floor to the list
    function addEditFloor(floorValue) {
        const trimmedValue = floorValue.trim();
        if (!trimmedValue) return;

        // Check if floor already exists
        const existingFloors = Array.from(editFloorList.querySelectorAll('.floor-item span'))
            .map(span => span.textContent.trim());

        if (existingFloors.includes(trimmedValue)) {
            showToast('Floor level already exists!', 'error');
            return;
        }

        const floorItem = document.createElement('div');
        floorItem.classList.add('floor-item');

        const floorText = document.createElement('span');
        floorText.textContent = trimmedValue;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '❌';
        deleteBtn.classList.add('button2');
        deleteBtn.style.cursor = 'pointer'; 
        deleteBtn.addEventListener('click', function() {
            floorItem.remove();
            updateEditFloorsInput();
        });

        floorItem.appendChild(floorText);
        floorItem.appendChild(deleteBtn);
        editFloorList.appendChild(floorItem);
        updateEditFloorsInput();
    }

    // Listen for 'Enter' key press to add floors
    editVenueFloorInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addEditFloor(this.value);
            this.value = '';
        }
    });
});

// Edit button click handler with data population
document.querySelectorAll('.edit-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Get the parent tr element that contains all venue data
        const row = this.closest('tr');
        
        // Get venue data from data attributes
        const venueId = row.getAttribute('data-id');
        const venueName = row.getAttribute('data-name');
        const venueLocation = row.getAttribute('data-location');
        const venueCapacity = row.getAttribute('data-capacity');
        const venueSpecifyLocation = row.getAttribute('data-specifylocation');
        const venueImages = row.getAttribute('data-image').split(',');
        const floorLevels = row.querySelector('td:nth-child(6)').textContent.split(','); // Get floor levels

        // Populate the edit form fields
        document.getElementById('editVenueName').value = venueName;
        document.getElementById('editVenueLocation').value = venueLocation;
        document.getElementById('editVenueCapacity').value = venueCapacity;
        
        // Set the venue ID in the hidden input
        document.getElementById('editVenueId').value = venueId;

        // Handle location specific fields
        if (venueLocation === "Dande's Resto") {
            document.getElementById('editVenueFloorGroup').style.display = 'block';
            document.getElementById('editVenueOtherGroup').style.display = 'none';
            
            // Populate floor levels
            const editFloorList = document.getElementById('editFloorList');
            editFloorList.innerHTML = ''; // Clear existing floors
            
            floorLevels.forEach(floor => {
                if (floor.trim()) { // Only add non-empty floor levels
                    const floorItem = document.createElement('div');
                    floorItem.classList.add('floor-item');
                    
                    const floorText = document.createElement('span');
                    floorText.textContent = floor.trim();
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerHTML = '❌';
                    deleteBtn.classList.add('button2');
                    deleteBtn.style.cursor = 'pointer';
                    deleteBtn.onclick = function() {
                        floorItem.remove();
                        updateEditFloorsInput();
                    };
                    
                    floorItem.appendChild(floorText);
                    floorItem.appendChild(deleteBtn);
                    editFloorList.appendChild(floorItem);
                }
            });
            
            // Update hidden floors field
            updateEditFloorsInput();
            
        } else if (venueLocation === 'Other') {
            document.getElementById('editVenueFloorGroup').style.display = 'none';
            document.getElementById('editVenueOtherGroup').style.display = 'block';
            document.getElementById('editVenueOther').value = venueSpecifyLocation;
        }

        // Populate images
        const editPreviewContainer = document.getElementById('editVenueImagePreviewContainer');
        editPreviewContainer.innerHTML = ''; // Clear existing previews
        
        if (venueImages.length > 0 && venueImages[0] !== '') {
            venueImages.forEach(imagePath => {
                if (imagePath.trim()) {
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('image-preview');
                    
                    const img = document.createElement('img');
                    img.src = `/storage/${imagePath.trim().startsWith('venue_images/') ? imagePath.trim() : 'venue_images/' + imagePath.trim()}`;
                    
                    const fileName = document.createElement('div');
                    fileName.classList.add('file-name');
                    fileName.textContent = imagePath.split('/').pop(); // Extract filename from path
                    
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '×';
                    removeBtn.classList.add('remove-btn');
                    removeBtn.onclick = () => {
                        wrapper.remove();
                        const hasImages = editPreviewContainer.querySelectorAll('.image-preview').length > 0;
                        if (!hasImages) {
                            editPreviewContainer.innerHTML = '<p id="editPlaceholderText" class="edit-placeholder-text">Images will be shown here</p>';
                        }
                    };
                    
                    wrapper.appendChild(img);
                    wrapper.appendChild(fileName);
                    wrapper.appendChild(removeBtn);
                    editPreviewContainer.appendChild(wrapper);
                }
            });
            
            document.getElementById('editPlaceholderText').style.display = 'none';
        } else {
            editPreviewContainer.innerHTML = '<p id="editPlaceholderText" class="edit-placeholder-text">Images will be shown here</p>';
        }

        // Show the modal
        document.getElementById('editVenueModal').style.display = 'block';
    });
});

// Update hidden floors field function
function updateEditFloorsInput() {
    const floors = Array.from(document.getElementById('editFloorList').querySelectorAll('.floor-item span'))
        .map(span => span.textContent.trim());
    document.getElementById('editFloorsField').value = floors.join(',');
}

// Add this to your existing JavaScript file
document.getElementById('updateVenueBtn').addEventListener('click', async function(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('venueName', document.getElementById('editVenueName').value);
    formData.append('venueLocation', document.getElementById('editVenueLocation').value);
    formData.append('venueCapacity', document.getElementById('editVenueCapacity').value);
    formData.append('floors', document.getElementById('editFloorsField').value);

    if (document.getElementById('editVenueLocation').value === 'Other') {
        formData.append('venueOther', document.getElementById('editVenueOther').value);
    }

    // Add retained images
    const retainedImages = [];
    document.querySelectorAll('#editVenueImagePreviewContainer .image-preview img').forEach(img => {
        if (img.src.includes('storage/venue_images/')) {
            retainedImages.push(img.src.split('storage/')[1]);
        }
    });
    formData.append('retained_images', retainedImages.join(','));

    // Add new images
    const fileInput = document.getElementById('editVenueImage');
    if (fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach((file, index) => {
            formData.append(`images[]`, file);
        });
    }

    try {
        const response = await fetch('/admin/venue/edit', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });

        const data = await response.json();

        if (data.success) {
            showNotification('Venue updated successfully', true);
            setTimeout(() => {
                document.getElementById('editVenueModal').style.display = 'none';
                location.reload(); // Reload to show updated data
            }, 2000);
        } else {
            throw new Error(data.message || 'Failed to update venue');
        }
    } catch (error) {
        console.error('Update error:', error);
        showNotification(error.message || 'Something went wrong while updating', false);
    }
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