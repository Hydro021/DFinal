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
  
    // Handle delete action
    deleteBtn.addEventListener("click", function () {
        let selected = document.querySelectorAll(".item-checkbox:checked");
        if (selected.length === 0) return;
  
        if (confirm("Are you sure you want to delete selected items?")) {
            selected.forEach(checkbox => checkbox.closest("tr").remove());
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
  
// ==============================
// Event Modal Open/Close with Smooth Transition
// ==============================

document.addEventListener("DOMContentLoaded", function () {
    const eventModal = document.getElementById("eventModal");

    // Ensure modal is hidden on page load
    eventModal.style.display = "none";

    // Show the modal when the button is clicked
    document.getElementById("addEventBtn").addEventListener("click", function () {
        // Display the modal (this will trigger the smooth transition)
        eventModal.style.display = "flex";  // Set display to flex to make it visible
        setTimeout(() => eventModal.classList.add("show"), 10); // Add show class for opacity transition
    });

    // Close the modal when the close button inside the modal is clicked
    document.querySelector("#eventModal .close").addEventListener("click", function () {
        closeModal();
    });

    // Close the modal if user clicks outside of the modal content
    window.onclick = function (event) {
        if (event.target === eventModal) {
            closeModal();
        }
    };

    // Function to close the modal
    function closeModal() {
        eventModal.classList.remove("show");  // Remove the 'show' class for fade-out effect
        setTimeout(() => {
            eventModal.style.display = "none"; // Set display to none after fade-out
        }, 300); // Match the fade-out duration to the transition time (0.3s)
    }
    });
       // Venue logic
       const selectVenue = document.getElementById('selectVenue');
       const venueGroup = document.getElementById('venueGroup');
       const otherLocationGroup = document.getElementById('otherLocationGroup');
       const eventVenue = document.getElementById('eventVenue');
       const otherLocation = document.getElementById('otherLocation');
       const finalVenueInput = document.getElementById('finalVenue');
   
       selectVenue.addEventListener('change', function () {
           const v = selectVenue.value;
           venueGroup.style.display = 'none';
           otherLocationGroup.style.display = 'none';
           if (v === "Dande's Resto") {
               venueGroup.style.display = 'block';
               finalVenueInput.value = eventVenue.value;
           } else if (v === "Other") {
               otherLocationGroup.style.display = 'block';
               finalVenueInput.value = otherLocation.value.trim();
           } else {
               finalVenueInput.value = v;
           }
       });
       eventVenue.addEventListener('change', () => {
           if (selectVenue.value === "Dande's Resto") finalVenueInput.value = eventVenue.value;
       });
       otherLocation.addEventListener('input', () => {
           if (selectVenue.value === "Other") finalVenueInput.value = otherLocation.value.trim();
       });
       document.addEventListener("DOMContentLoaded", function () {
         // ——————————————————————————————————————————
         // Element refs
         // ——————————————————————————————————————————
         const dropArea                = document.getElementById('dropArea');
         const imagePreviewContainer   = document.getElementById('imagePreview');
         const videoPreviewContainer   = document.getElementById('videoPreview');
         const dataTransfer            = new DataTransfer();
         const clearImageBtn           = document.getElementById("editClearImageBtn");
         const clearVideoBtn           = document.getElementById("editClearVideoBtn");
         const imagePlaceholderText    = document.getElementById("imagePlaceholderText");
         const videoPlaceholderText    = document.getElementById("videoPlaceholderText");
         const uploadProgressContainer = document.getElementById('uploadProgressContainer');
         const uploadProgressBar       = document.getElementById('uploadProgressBar');
         const uploadPercent           = document.getElementById('uploadPercent');
         const eventForm               = document.getElementById('eventForm');
         const modalElement            = document.getElementById('eventModal');
         const saveEventBtn            = document.getElementById('saveEventBtn');
         const uploadPauseBtn          = document.getElementById('uploadPauseBtn');
         const uploadCancelBtn         = document.getElementById('uploadCancelBtn');
       
         // ——————————————————————————————————————————
         // State for pause/resume
         // ——————————————————————————————————————————
         let xhr             = null;
         let lastLoaded      = 0;
         let lastTotal       = 0;
         let paused          = false;
         let resumeBasePct   = 0;   // the % at which we paused
       
         // ——————————————————————————————————————————
         // Notifications & Modal
         // ——————————————————————————————————————————
         function showNotification(msg, isError = false) {
           const n = document.getElementById('notification');
           const m = document.getElementById('notification-message');
           m.textContent = msg;
           n.style.backgroundColor = isError ? '#dc3545' : '#28a745';
           n.style.display = 'block';
           setTimeout(() => n.style.display = 'none', 5000);
         }
         function closeModal() {
           if (!modalElement) return;
           if (typeof $ !== 'undefined' && $(modalElement).modal) {
             $(modalElement).modal('hide');
           } else {
             modalElement.classList.remove('show');
             modalElement.style.display = 'none';
             document.body.classList.remove('modal-open');
             const b = document.querySelector('.modal-backdrop');
             if (b) b.remove();
           }
         }
       
         // ——————————————————————————————————————————
         // Preview helpers (unchanged)
         // ——————————————————————————————————————————
         function updatePlaceholdersAndButtons() {
           const hasImg = imagePreviewContainer.querySelectorAll('.image-preview').length>0;
           const hasVid = videoPreviewContainer.querySelectorAll('.video-preview').length>0;
           if (imagePlaceholderText) imagePlaceholderText.style.display = hasImg ? 'none':'block';
           if (videoPlaceholderText) videoPlaceholderText.style.display = hasVid ? 'none':'block';
         }
         function imageExists(d) {
           return Array.from(imagePreviewContainer.querySelectorAll('img')).some(i=>i.src===d);
         }
         function videoExists(d) {
           return Array.from(videoPreviewContainer.querySelectorAll('video')).some(v=>v.src===d);
         }
         function addImagePreview(file) {
           const r=new FileReader();
           r.onload=e=>{
             const d=e.target.result;
             if (imageExists(d)) return;
             const w=document.createElement('div'); w.classList.add('image-preview');
             const img=document.createElement('img'); img.src=d;
             const btn=document.createElement('button');
             btn.innerHTML='&times;'; btn.classList.add('remove-btn');
             btn.onclick=()=>{ w.remove();
               const idx=Array.from(dataTransfer.files)
                 .findIndex(f=>f.name===file.name&&f.size===file.size);
               if(idx>-1) dataTransfer.items.remove(idx);
               updatePlaceholdersAndButtons();
             };
             w.append(img,btn);
             
             const fileName = document.createElement('div');
             fileName.className = 'file-name';
             fileName.textContent = file.name;
             w.appendChild(fileName);
             
             imagePreviewContainer.appendChild(w);
             dataTransfer.items.add(file);
             updatePlaceholdersAndButtons();
           };
           r.readAsDataURL(file);
         }
         function addVideoPreview(file) {
           const r=new FileReader();
           r.onload=e=>{
             const d=e.target.result;
             if (videoExists(d)) return;
             const w=document.createElement('div'); w.classList.add('video-preview');
             const vid=document.createElement('video');
             vid.src=d; vid.muted=true; vid.playsInline=true;
             vid.disablePictureInPicture=true; vid.controls=false;
             vid.addEventListener('mouseenter',()=>vid.play());
             vid.addEventListener('mouseleave',()=>{vid.pause(); vid.currentTime=0;});
             vid.addEventListener('dblclick',()=>{
               if(vid.requestFullscreen) vid.requestFullscreen();
               else if(vid.webkitRequestFullscreen) vid.webkitRequestFullscreen();
               else if(vid.msRequestFullscreen) vid.msRequestFullscreen();
             });
             const btn=document.createElement('button');
             btn.innerHTML='&times;'; btn.classList.add('remove-btn');
             btn.onclick=()=>{ w.remove();
               const idx=Array.from(dataTransfer.files)
                 .findIndex(f=>f.name===file.name&&f.size===file.size);
               if(idx>-1) dataTransfer.items.remove(idx);
               updatePlaceholdersAndButtons();
             };
             w.append(vid,btn);
             
             const fileName = document.createElement('div');
             fileName.className = 'file-name';
             fileName.textContent = file.name;
             w.appendChild(fileName);
             
             videoPreviewContainer.appendChild(w);
             dataTransfer.items.add(file);
             requestAnimationFrame(()=>w.classList.add('show'));
             updatePlaceholdersAndButtons();
           };
           r.readAsDataURL(file);
         }
         function handleFiles(files) {
           Array.from(files).forEach(f=>{
             if(f.type.startsWith('image/')) addImagePreview(f);
             else if(f.type.startsWith('video/')) addVideoPreview(f);
           });
         }
         function disableClearButtons(){
           if(clearImageBtn) clearImageBtn.style.pointerEvents='none',clearImageBtn.style.opacity=0.5;
           if(clearVideoBtn) clearVideoBtn.style.pointerEvents='none',clearVideoBtn.style.opacity=0.5;
           document.querySelectorAll('.remove-btn').forEach(b=>{
             b.disabled=true; b.style.pointerEvents='none'; b.style.opacity=0.5;
           });
         }
         function enableClearButtons(){
           if(clearImageBtn) clearImageBtn.style.pointerEvents='auto',clearImageBtn.style.opacity=1;
           if(clearVideoBtn) clearVideoBtn.style.pointerEvents='auto',clearVideoBtn.style.opacity=1;
           document.querySelectorAll('.remove-btn').forEach(b=>{
             b.disabled=false; b.style.pointerEvents='auto'; b.style.opacity=1;
           });
         }
       
         // ——————————————————————————————————————————
         // Drag & Drop setup
         // ——————————————————————————————————————————
         dropArea.addEventListener('dragover',e=>{ e.preventDefault(); dropArea.classList.add('drag-over'); });
         dropArea.addEventListener('dragleave',()=>dropArea.classList.remove('drag-over'));
         dropArea.addEventListener('drop',e=>{
           e.preventDefault(); dropArea.classList.remove('drag-over');
           const items=e.dataTransfer.items;
           for(let i=0;i<items.length;i++){
             const entry=items[i].webkitGetAsEntry?.();
             if(entry){
               if(entry.isFile) entry.file(f=>f.type.startsWith('image/')?addImagePreview(f):addVideoPreview(f));
               else if(entry.isDirectory){
                 const r=entry.createReader();
                 r.readEntries(arr=>arr.forEach(en=>{
                   if(en.isFile) en.file(f=>f.type.startsWith('image/')?addImagePreview(f):addVideoPreview(f));
                 }));
               }
             } else {
               const f=items[i].getAsFile?.();
               if(f) (f.type.startsWith('image/')?addImagePreview(f):addVideoPreview(f));
             }
           }
         });
       
         // ——————————————————————————————————————————
         // Clear buttons
         // ——————————————————————————————————————————
         clearImageBtn.addEventListener('click',()=>{
           imagePreviewContainer.querySelectorAll('.image-preview').forEach(el=>el.remove());
           Array.from(dataTransfer.files).forEach((f,i)=>{
             if(f.type.startsWith('image/')) dataTransfer.items.remove(i);
           });
           updatePlaceholdersAndButtons();
         });
         clearVideoBtn.addEventListener('click',()=>{
           videoPreviewContainer.querySelectorAll('.video-preview').forEach(el=>el.remove());
           Array.from(dataTransfer.files).forEach((f,i)=>{
             if(f.type.startsWith('video/')) dataTransfer.items.remove(i);
           });
           updatePlaceholdersAndButtons();
         });
       
        // Core uploader with pause/resume
function startUpload(isResume = false) {
  disableClearButtons();
  if (saveEventBtn) {
    saveEventBtn.disabled = true;
    saveEventBtn.style.cursor = 'default';
  }

  const formData = new FormData(eventForm);
  formData.delete('eventMedia');
  Array.from(dataTransfer.files).forEach(f => formData.append('eventMedia[]', f));

  // Only initialize progress if not resuming
  if (!isResume) {
    showUploadProgress();
  } else if (resumeBasePct) {
    uploadProgressBar.style.width = resumeBasePct + '%';
    uploadPercent.textContent = resumeBasePct + '%';
  }

  xhr = new XMLHttpRequest();
  xhr.open('POST', eventForm.action, true);
  xhr.setRequestHeader('X-CSRF-TOKEN',
    document.querySelector('meta[name="csrf-token"]').getAttribute('content')
  );

  xhr.upload.onprogress = function(evt) {
    if (!evt.lengthComputable) return;
    lastLoaded = evt.loaded;
    lastTotal  = evt.total;
    let rawPct = Math.round((evt.loaded / evt.total) * 100);
    let pct = resumeBasePct > rawPct ? resumeBasePct : rawPct;
    uploadProgressBar.style.width = pct + '%';
    uploadPercent.textContent = pct + '%';
    let r, g;
    if (pct <= 50) { r = 255; g = Math.round(255 * (pct / 50)); }
    else { r = Math.round(255 * (1 - (pct - 50) / 50)); g = 255; }
    uploadProgressBar.style.backgroundColor = `rgb(${r},${g},0)`;
  };

  xhr.onload = function() {
    uploadProgressContainer.style.display = 'none';
    if (saveEventBtn) {
      saveEventBtn.disabled = false;
      saveEventBtn.style.cursor = 'pointer';
    }

    if (xhr.status >= 200 && xhr.status < 300) {
      closeModal();
      showNotification("Event saved successfully!");
      setTimeout(() => window.location.href = '/admin/event', 1500);
    } else {
      try {
        const response = JSON.parse(xhr.responseText);
        if (response?.error && response.error.includes("already exists")) {
          showNotification(response.error, true);
        } else {
          showNotification("Upload failed. Please try again.", true);
        }
      } catch {
        showNotification("Upload failed. Please try again.", true);
      }
    }

    enableClearButtons();
    paused = false;
    resumeBasePct = 0;
    uploadPauseBtn.querySelector('i').classList.replace('fa-play','fa-pause');
    uploadPauseBtn.querySelector('.clear-text').textContent = 'Pause';
    uploadPauseBtn.title = 'Pause upload';
  };

  xhr.onerror = function() {
    uploadProgressContainer.style.display = 'none';
    if (saveEventBtn) {
      saveEventBtn.disabled = false;
      saveEventBtn.style.cursor = 'pointer';
    }
    showNotification("An error occurred during upload.", true);
    enableClearButtons();
  };

  xhr.send(formData);
}

// Pause / Resume
uploadPauseBtn.addEventListener('click', function() {
  if (!paused && xhr && xhr.readyState < 4) {
    xhr.abort();
    paused = true;
    resumeBasePct = Math.round((lastLoaded / lastTotal) * 100);
    this.querySelector('i').classList.replace('fa-pause', 'fa-play');
    this.querySelector('.clear-text').textContent = 'Resume';
    this.title = 'Resume upload';
  } else if (paused) {
    startUpload(true);
    paused = false;
    this.querySelector('i').classList.replace('fa-play', 'fa-pause');
    this.querySelector('.clear-text').textContent = 'Pause';
    this.title = 'Pause upload';
  }
});

// Cancel
uploadCancelBtn.addEventListener('click', function() {
  if (xhr) xhr.abort();
  uploadProgressContainer.style.display = 'none';
  paused = false;
  resumeBasePct = 0;
  uploadPauseBtn.querySelector('i').classList.replace('fa-play', 'fa-pause');
  uploadPauseBtn.querySelector('.clear-text').textContent = 'Pause';
  uploadPauseBtn.title = 'Pause upload';
  enableClearButtons();
  if (saveEventBtn) {
    saveEventBtn.disabled = false;
    saveEventBtn.style.cursor = 'pointer';
  }
});

// Add this function to show upload progress before starting the upload
function showUploadProgress() {
    uploadProgressContainer.style.display = 'block';
    uploadProgressBar.style.width = '0%';
    uploadPercent.textContent = '0%';
    uploadProgressBar.style.backgroundColor = 'rgb(255,0,0)';
}

// Modify the submit handler
eventForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const hasImages = imagePreviewContainer.querySelectorAll('.image-preview').length > 0;
    const hasVideos = videoPreviewContainer.querySelectorAll('.video-preview').length > 0;

    if (!hasImages && !hasVideos) {
        showNotification("Please upload at least one image or one video.", true);
        return;
    }

    // Show progress UI immediately when form is submitted
    showUploadProgress();

    // If only images
    if (hasImages && !hasVideos) {
        disableClearButtons();
        if (saveEventBtn) {
            saveEventBtn.disabled = true;
            saveEventBtn.style.cursor = 'default';
        }

        const formData = new FormData(eventForm);
        formData.delete('eventMedia');
        Array.from(dataTransfer.files).forEach(f => formData.append('eventMedia[]', f));

        const xhrImagesOnly = new XMLHttpRequest();
        xhrImagesOnly.open('POST', eventForm.action, true);
        xhrImagesOnly.setRequestHeader('X-CSRF-TOKEN',
            document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        );

        // Add progress handler for images-only upload
        xhrImagesOnly.upload.onprogress = function(evt) {
            if (!evt.lengthComputable) return;
            const pct = Math.round((evt.loaded / evt.total) * 100);
            uploadProgressBar.style.width = pct + '%';
            uploadPercent.textContent = pct + '%';
            let r, g;
            if (pct <= 50) { r = 255; g = Math.round(255 * (pct / 50)); }
            else { r = Math.round(255 * (1 - (pct - 50) / 50)); g = 255; }
            uploadProgressBar.style.backgroundColor = `rgb(${r},${g},0)`;
        };

        // Rest of the xhrImagesOnly handlers...
        xhrImagesOnly.onload = function () {
            if (xhrImagesOnly.status >= 200 && xhrImagesOnly.status < 300) {
              closeModal();
              showNotification("Event saved successfully!");
              setTimeout(() => window.location.href = '/admin/event', 1500);
            } else {
              try {
                const response = JSON.parse(xhrImagesOnly.responseText);
                if (response?.error && response.error.includes("already exists")) {
                  showNotification(response.error, true);
                } else {
                  showNotification("Upload failed. Please try again.", true);
                }
              } catch {
                showNotification("Upload failed. Please try again.", true);
              }
            }
        
            if (saveEventBtn) {
              saveEventBtn.disabled = false;
              saveEventBtn.style.cursor = 'pointer';
            }
            enableClearButtons();
          };
        
          xhrImagesOnly.onerror = function () {
            showNotification("An error occurred during upload.", true);
            if (saveEventBtn) {
              saveEventBtn.disabled = false;
              saveEventBtn.style.cursor = 'pointer';
            }
            enableClearButtons();
          };

        xhrImagesOnly.send(formData);
        return;
    }

    // Proceed with normal upload if has videos
    startUpload(false);
});
});

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('eventSearch');
    const tableRows = document.querySelectorAll('#eventTableBody tr');

    searchInput.addEventListener('input', function () {
        const inputText = searchInput.value.trim(); // exact input only

        tableRows.forEach(row => {
            const rowText = row.innerText || row.textContent;
            if (rowText.includes(inputText) || inputText === '') {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
searchInput.addEventListener('input', function () {
    const query = this.value;

    tableRows.forEach(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        const matchFound = cells.some(cell => cell.textContent.includes(query));
        row.style.display = matchFound ? '' : 'none';
    });
});
});

// Add this helper function to validate dates
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
    const row = btn.closest('tr');
    if (!row) return;
             // Get values from data attributes
             const name = row.getAttribute('data-name') || '';
             const description = row.getAttribute('data-description') || '';
             const date = row.getAttribute('data-date') || '';
             const time = row.getAttribute('data-time') || '';
             const venue = row.getAttribute('data-venue') || '';
             const images = row.getAttribute('data-images') || '';
             const videos = row.getAttribute('data-videos') || '';
    
             // Format date for input (yyyy-mm-dd) and display (mm/dd/yyyy)
             function formatDateForInput(dateStr) {
                 if (!dateStr) return '';
                 
                 // First try parsing as ISO format
                 let d = new Date(dateStr);
                 
                 // If invalid, try parsing mm/dd/yyyy format
                 if (isNaN(d)) {
                     const parts = dateStr.split('/');
                     if (parts.length === 3) {
                         // Parse as MM/DD/YYYY
                         d = new Date(parts[2], parts[0] - 1, parts[1]);
                     }
                 }
                 
                 // If still invalid, try parsing yyyy-mm-dd format
                 if (isNaN(d)) {
                     const parts = dateStr.split('-');
                     if (parts.length === 3) {
                         d = new Date(parts[0], parts[1] - 1, parts[2]);
                     }
                 }
                 
                 if (isNaN(d)) return '';
                 
                 // Format as YYYY-MM-DD
                 const year = d.getFullYear();
                 const month = String(d.getMonth() + 1).padStart(2, '0');
                 const day = String(d.getDate()).padStart(2, '0');
                 return `${year}-${month}-${day}`;
             }
    
             function formatDateForDisplay(dateStr) {
                 if (!dateStr) return '';
                 let d = new Date(dateStr);
                 if (isNaN(d)) {
                     const parts = dateStr.split('-');
                     if (parts.length === 3) {
                         d = new Date(parts[0], parts[1] - 1, parts[2]);
                     }
                 }
                 if (isNaN(d)) return '';
                 const mm = String(d.getMonth() + 1).padStart(2, '0');
                 const dd = String(d.getDate()).padStart(2, '0');
                 const yyyy = d.getFullYear();
                 return `${mm}/${dd}/${yyyy}`;
             }
    
             // Format time for input (HH:MM) and display (hh:mm AM/PM)
             function formatTimeForInput(timeStr) {
                 if (!timeStr) return '';
                 let t = timeStr;
                 if (t.match(/am|pm/i)) {
                     const [time, modifier] = t.split(' ');
                     let [hours, minutes] = time.split(':');
                     if (modifier.toLowerCase() === 'pm' && hours !== '12') {
                         hours = String(parseInt(hours, 10) + 12);
                     }
                     if (modifier.toLowerCase() === 'am' && hours === '12') {
                         hours = '00';
                     }
                     return `${hours.padStart(2, '0')}:${minutes}`;
                 }
                 return t.slice(0, 5);
             }
             function formatTimeForDisplay(timeStr) {
                 if (!timeStr) return '';
                 let [hours, minutes] = timeStr.split(':');
                 let h = parseInt(hours, 10);
                 const ampm = h >= 12 ? 'PM' : 'AM';
                 h = h % 12;
                 if (h === 0) h = 12;
                 return `${String(h).padStart(2, '0')}:${minutes} ${ampm}`;
             }
    
             // Set values in the edit modal
             document.querySelector('#editEventModal #eventName').value = name;
             document.querySelector('#editEventModal #eventDescription').value = description;
    
             // Set date and time for input fields
             const dateInput = document.querySelector('#editEventModal #eventDate');
             if (dateInput && date) {
                 try {
                     const formattedDate = formatDateForInput(date);
                     if (formattedDate) {
                         dateInput.value = formattedDate;
                         dateInput.placeholder = formatDateForDisplay(formattedDate);
                     } else {
                         console.warn('Could not parse date:', date);
                         dateInput.value = '';
                         dateInput.placeholder = 'Invalid date format';
                     }
                 } catch (err) {
                     console.error('Error parsing date:', err);
                     dateInput.value = '';
                     dateInput.placeholder = 'Error processing date';
                 }
             }
    
             const timeInput = document.querySelector('#editEventModal #eventTime');
             timeInput.value = formatTimeForInput(time);
    
             // Optionally, show formatted display as placeholder
             timeInput.placeholder = formatTimeForDisplay(time);
    
             // Venue logic (adjust as needed)
             const selectVenue = document.querySelector('#editEventModal #selectVenue');
             const venueGroup = document.querySelector('#editEventModal #venueGroup');
             const otherLocationGroup = document.querySelector('#editEventModal #otherLocationGroup');
             const eventVenue = document.querySelector('#editEventModal #eventVenue');
             const otherLocation = document.querySelector('#editEventModal #otherLocation');
             const finalVenueInput = document.querySelector('#editEventModal #finalVenue');
    
             if (venue === "Dande's Resto" || venue === "Main Hall" || venue === "VIP Room" || venue === "Rooftop") {
                 selectVenue.value = "Dande's Resto";
                 venueGroup.style.display = 'block';
                 eventVenue.value = venue;
                 finalVenueInput.value = venue;
                 otherLocationGroup.style.display = 'none';
             } else if (venue) {
                 selectVenue.value = "Other";
                 otherLocation.value = venue;
                 finalVenueInput.value = venue;
                 otherLocationGroup.style.display = 'block';
                 venueGroup.style.display = 'none';
             } else {
                 selectVenue.value = "";
                 venueGroup.style.display = 'none';
                 otherLocationGroup.style.display = 'none';
                 finalVenueInput.value = "";
             }
    
             // Handle existing images
             if (images) {
                 // Split the comma-separated image paths if multiple
                 const imageArray = images.split(',').map(img => img.trim());
                 
                 imageArray.forEach(imagePath => {
                     const filename = imagePath.split('/').pop();
                     
                     const wrapper = document.createElement('div');
                     wrapper.classList.add('image-preview');
                     
                     const img = document.createElement('img');
                     img.src = `/storage/event_images/${filename}`; // Adjust path as needed
                     
                     const fileName = document.createElement('div');  // Add this
                     fileName.classList.add('file-name');            // Add this
                     fileName.textContent = filename;                // Add this
                     
                     const removeBtn = document.createElement('button');
                     removeBtn.innerHTML = '&times;';
                     removeBtn.classList.add('remove-btn');
                     removeBtn.onclick = () => {
                         wrapper.remove();
                         updatePlaceholdersAndButtons2();
                     };
                     
                     wrapper.appendChild(img);
                     wrapper.appendChild(fileName);  // Add this
                     wrapper.appendChild(removeBtn);
                     
                     imagePreviewContainer2.appendChild(wrapper);
                 });
             }
             
             // Handle existing videos
             if (videos) {
                 // Split the comma-separated video paths if multiple
                 const videoArray = videos.split(',').map(vid => vid.trim());
                 
                 videoArray.forEach(videoPath => {
                     const filename = videoPath.split('/').pop();
                     
                     const wrapper = document.createElement('div');
                     wrapper.classList.add('video-preview');
                     
                     const video = document.createElement('video');
                     video.src = `/storage/event_videos/${filename}`; // Adjust path as needed
                     video.muted = true;
                     video.playsInline = true;
                     video.disablePictureInPicture = true;
                     video.controls = false;
                     
                     const fileName = document.createElement('div');  // Add this
                     fileName.classList.add('file-name');            // Add this
                     fileName.textContent = filename;                // Add this
                     
                     // Add video interactions
                     video.addEventListener('mouseenter', () => video.play());
                     video.addEventListener('mouseleave', () => {
                         video.pause();
                         video.currentTime = 0;
                     });
                     video.addEventListener('dblclick', () => {
                         if (video.requestFullscreen) video.requestFullscreen();
                         else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
                         else if (video.msRequestFullscreen) video.msRequestFullscreen();
                     });
                     
                     const removeBtn = document.createElement('button');
                     removeBtn.innerHTML = '&times;';
                     removeBtn.classList.add('remove-btn');
                     removeBtn.onclick = () => {
                         wrapper.remove();
                         updatePlaceholdersAndButtons2();
                     };
                     
                     wrapper.append(video, removeBtn);
                     wrapper.appendChild(fileName);  // Add this
                     videoPreviewContainer2.appendChild(wrapper);
                     requestAnimationFrame(() => wrapper.classList.add('show'));
                 });
             }
             
             // Update placeholders
             updatePlaceholdersAndButtons2();
             
             // Show the modal
             const editEventModal = document.getElementById('editEventModal');
             editEventModal.style.display = "flex";
             setTimeout(() => editEventModal.classList.add("show"), 10);
             document.querySelector('#editEventModal #eventId').value = row.getAttribute('data-id');
         });
     });  
     // ==============================
// Venue logic for Edit Modal
// ==============================
const selectVenue2 = document.querySelector('#editEventModal #selectVenue');
const venueGroup2 = document.querySelector('#editEventModal #venueGroup');
const otherLocationGroup2 = document.querySelector('#editEventModal #otherLocationGroup');
const eventVenue2 = document.querySelector('#editEventModal #eventVenue');
const otherLocation2 = document.querySelector('#editEventModal #otherLocation');
const finalVenueInput2 = document.querySelector('#editEventModal #finalVenue');

selectVenue2.addEventListener('change', function () {
    const v = selectVenue2.value;
    venueGroup2.style.display = 'none';
    otherLocationGroup2.style.display = 'none';
    if (v === "Dande's Resto") {
    venueGroup2.style.display = 'block';
    finalVenueInput2.value = eventVenue2.value;
    } else if (v === "Other") {
    otherLocationGroup2.style.display = 'block';
    finalVenueInput2.value = otherLocation2.value.trim();
    } else {
    finalVenueInput2.value = v;
    }
    });
    eventVenue2.addEventListener('change', () => {
        if (selectVenue2.value === "Dande's Resto") finalVenueInput2.value = eventVenue2.value;
        });
        
        otherLocation2.addEventListener('input', () => {
        if (selectVenue2.value === "Other") finalVenueInput2.value = otherLocation2.value.trim();
        });
        
        // ==============================
// Drag & Drop, Preview, and Upload for Edit Modal
// ==============================
const dropArea2 = document.querySelector('#editEventModal #dropArea');
const imagePreviewContainer2 = document.querySelector('#editEventModal #imagePreview');
const videoPreviewContainer2 = document.querySelector('#editEventModal #videoPreview');
const dataTransfer2 = new DataTransfer();
const clearImageBtn2 = document.querySelector("#editEventModal #editClearImageBtn");
const clearVideoBtn2 = document.querySelector("#editEventModal #editClearVideoBtn");
const imagePlaceholderText2 = document.querySelector("#editEventModal #imagePlaceholderText2");
const videoPlaceholderText2 = document.querySelector("#editEventModal #videoPlaceholderText2");
const uploadProgressBar2 = document.querySelector('#editEventModal #uploadProgressBar');
const uploadPercent2 = document.querySelector('#editEventModal #uploadPercent');
const editEventForm2 = document.getElementById('editEventForm');
const updateEventBtn2 = document.getElementById('updateEventBtn');
const uploadPauseBtn2 = document.querySelector('#editEventModal #uploadPauseBtn');
const uploadCancelBtn2 = document.querySelector('#editEventModal #uploadCancelBtn');
const uploadProgressContainer2 = document.querySelector('#editEventModal #uploadProgressContainer');

let xhr2 = null;
let lastLoaded2 = 0;
let lastTotal2 = 0;
let paused2 = false;

let resumeBasePct2 = 0;

function showNotification(msg, isError = false) {
const n = document.getElementById('notification');
const m = document.getElementById('notification-message');
if (m) m.textContent = msg;
if (n) {
n.style.backgroundColor = isError ? '#dc3545' : '#28a745';
n.style.display = 'block';
setTimeout(() => n.style.display = 'none', 5000);
}
}
function updatePlaceholdersAndButtons2() {
    const hasImg = imagePreviewContainer2.querySelectorAll('.image-preview').length > 0;
    const hasVid = videoPreviewContainer2.querySelectorAll('.video-preview').length > 0;
    if (imagePlaceholderText2) imagePlaceholderText2.style.display = hasImg ? 'none' : 'block';
    if (videoPlaceholderText2) videoPlaceholderText2.style.display = hasVid ? 'none' : 'block';
    }
    function imageExists2(d) {
        return Array.from(imagePreviewContainer2.querySelectorAll('img')).some(i => i.src === d);
        }
        
        function videoExists2(d) {
        return Array.from(videoPreviewContainer2.querySelectorAll('video')).some(v => v.src === d);
        }
        
        function addImagePreview2(file) {
            const r = new FileReader();
r.onload = e => {
const d = e.target.result;
if (imageExists2(d)) return;
const w = document.createElement('div'); w.classList.add('image-preview');
const img = document.createElement('img'); img.src = d;
const btn = document.createElement('button');
btn.innerHTML = '×'; btn.classList.add('remove-btn');
btn.onclick = () => {
w.remove();
const idx = Array.from(dataTransfer2.files)
.findIndex(f => f.name === file.name && f.size === file.size);
if (idx > -1) dataTransfer2.items.remove(idx);
updatePlaceholdersAndButtons2();
};
w.append(img, btn);

const fileName = document.createElement('div');
fileName.className = 'file-name';
fileName.textContent = file.name;
w.appendChild(fileName);

imagePreviewContainer2.appendChild(w);
dataTransfer2.items.add(file);
updatePlaceholdersAndButtons2();
};
r.readAsDataURL(file);
}
function addVideoPreview2(file) {
    const r = new FileReader();
    r.onload = e => {
    const d = e.target.result;
    if (videoExists2(d)) return;
    const w = document.createElement('div'); w.classList.add('video-preview');
    const vid = document.createElement('video');
    vid.src = d; vid.muted = true; vid.playsInline = true;
    vid.disablePictureInPicture = true; vid.controls = false;
    vid.addEventListener('mouseenter', () => vid.play());
    vid.addEventListener('mouseleave', () => { vid.pause(); vid.currentTime = 0; });
    vid.addEventListener('dblclick', () => {
    if (vid.requestFullscreen) vid.requestFullscreen();
    else if (vid.webkitRequestFullscreen) vid.webkitRequestFullscreen();
    else if (vid.msRequestFullscreen) vid.msRequestFullscreen();
    });
    const btn = document.createElement('button');
btn.innerHTML = '×'; btn.classList.add('remove-btn');
btn.onclick = () => {
w.remove();
const idx = Array.from(dataTransfer2.files)
.findIndex(f => f.name === file.name && f.size === file.size);
if (idx > -1) dataTransfer2.items.remove(idx);
updatePlaceholdersAndButtons2();
};
w.append(vid, btn);

const fileName = document.createElement('div');
fileName.className = 'file-name';
fileName.textContent = file.name;
w.appendChild(fileName);

videoPreviewContainer2.appendChild(w);
dataTransfer2.items.add(file);
requestAnimationFrame(() => w.classList.add('show'));
updatePlaceholdersAndButtons2();
};
r.readAsDataURL(file);
}

function handleFiles2(files) {
    Array.from(files).forEach(f => {
        if (f.type.startsWith('image/')) addImagePreview2(f);
        else if (f.type.startsWith('video/')) addVideoPreview2(f);
        });
        }
        function disableClearButtons2() {
            if (clearImageBtn2) clearImageBtn2.style.pointerEvents = 'none', clearImageBtn2.style.opacity = 0.5;
            if (clearVideoBtn2) clearVideoBtn2.style.pointerEvents = 'none', clearVideoBtn2.style.opacity = 0.5;
            document.querySelectorAll('#editEventModal .remove-btn').forEach(b => {
            b.disabled = true; b.style.pointerEvents = 'none'; b.style.opacity = 0.5;
            });
            }
            
            function enableClearButtons2() {
                if (clearImageBtn2) clearImageBtn2.style.pointerEvents = 'auto', clearImageBtn2.style.opacity = 1;
if (clearVideoBtn2) clearVideoBtn2.style.pointerEvents = 'auto', clearVideoBtn2.style.opacity = 1;
document.querySelectorAll('#editEventModal .remove-btn').forEach(b => {
b.disabled = false; b.style.pointerEvents = 'auto'; b.style.opacity = 1;
});
}
// Drag & Drop setup for edit modal
dropArea2.addEventListener('dragover', e => { e.preventDefault(); dropArea2.classList.add('drag-over'); });
dropArea2.addEventListener('dragleave', () => dropArea2.classList.remove('drag-over'));
dropArea2.addEventListener('drop', async function(e) {
    e.preventDefault();
    dropArea2.classList.remove('drag-over');

    // Handle items from the drop event
    if (e.dataTransfer.items) {
        // Use async/await to handle entries recursively
        for (const item of Array.from(e.dataTransfer.items)) {
            const entry = item.webkitGetAsEntry?.() || item.getAsEntry?.();
            
            if (entry) {
                if (entry.isFile) {
                    // Handle files
                    const file = await getFileFromEntry(entry);
                    if (file.type.startsWith('image/')) {
                        addImagePreview2(file);
                    } else if (file.type.startsWith('video/')) {
                        addVideoPreview2(file);
                    }
                } else if (entry.isDirectory) {
                    // Handle folders
                    await readDirectoryEntries(entry);
                }
            } else {
                // Fallback for direct file drops
                const file = item.getAsFile?.();
                if (file) {
                    if (file.type.startsWith('image/')) {
                        addImagePreview2(file);
                    } else if (file.type.startsWith('video/')) {
                        addVideoPreview2(file);
                    }
                }
            }
        }
    }
});

// Add these helper functions to handle directory reading
function getFileFromEntry(entry) {
    return new Promise((resolve) => {
        entry.file(resolve);
    });
}

async function readDirectoryEntries(dirEntry) {
    const entries = await readEntriesPromise(dirEntry);
    
    for (const entry of entries) {
        if (entry.isFile) {
            const file = await getFileFromEntry(entry);
            if (file.type.startsWith('image/')) {
                addImagePreview2(file);
            } else if (file.type.startsWith('video/')) {
                addVideoPreview2(file);
            }
        } else if (entry.isDirectory) {
            // Recursively read subdirectories
            await readDirectoryEntries(entry);
        }
    }
}

function readEntriesPromise(dirEntry) {
    return new Promise((resolve) => {
        const reader = dirEntry.createReader();
        reader.readEntries((entries) => {
            resolve(entries);
        });
    });
}

// Clear buttons for edit modal
clearImageBtn2.addEventListener('click', () => {
    imagePreviewContainer2.querySelectorAll('.image-preview').forEach(el => el.remove());
    Array.from(dataTransfer2.files).forEach((f, i) => {
    if (f.type.startsWith('image/')) dataTransfer2.items.remove(i);
    });
    updatePlaceholdersAndButtons2();
    });
    
    clearVideoBtn2.addEventListener('click', () => {
    videoPreviewContainer2.querySelectorAll('.video-preview').forEach(el => el.remove());
    Array.from(dataTransfer2.files).forEach((f, i) => {
    if (f.type.startsWith('video/')) dataTransfer2.items.remove(i);
    });
    updatePlaceholdersAndButtons2();
    });
    // Core uploader with pause/resume for edit modal
function startUpload2(isResume = false) {
    disableClearButtons2();
    if (updateEventBtn2) {
        updateEventBtn2.disabled = true;
        updateEventBtn2.style.cursor = 'default';
    }
    
    const formData = new FormData(editEventForm2);
    formData.delete('eventMedia');
    Array.from(dataTransfer2.files).forEach(f => formData.append('eventMedia[]', f));
 
    // Only initialize progress if not resuming
    if (!isResume) {
        showUploadProgress2();
    } else if (resumeBasePct2) {
        uploadProgressBar2.style.width = resumeBasePct2 + '%';
        uploadPercent2.textContent = resumeBasePct2 + '%';
    }
    
    xhr2 = new XMLHttpRequest();
    xhr2.open('POST', editEventForm2.action, true);
    xhr2.setRequestHeader('X-CSRF-TOKEN',
        document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    );
 
    xhr2.upload.onprogress = function (evt) {
        if (!evt.lengthComputable) return;
        lastLoaded2 = evt.loaded;
        lastTotal2 = evt.total;
        let rawPct = Math.round((evt.loaded / evt.total) * 100);
        let pct = resumeBasePct2 > rawPct ? resumeBasePct2 : rawPct;
        uploadProgressBar2.style.width = pct + '%';
        uploadPercent2.textContent = pct + '%';
        let r, g;
        if (pct <= 50) { r = 255; g = Math.round(255 * (pct / 50)); }
        else { r = Math.round(255 * (1 - (pct - 50) / 50)); g = 255; }
        uploadProgressBar2.style.backgroundColor = `rgb(${r},${g},0)`;
    };
 
    xhr2.onload = function () {
        uploadProgressContainer2.style.display = 'none';
        if (updateEventBtn2) {
            updateEventBtn2.disabled = false;
            updateEventBtn2.style.cursor = 'pointer';
        }
 
        if (xhr2.status >= 200 && xhr2.status < 300) {
            closeEditModal();
            showNotification("Event updated successfully!");
            setTimeout(() => window.location.href = '/admin/event', 1500);
        } else {
            try {
                const response = JSON.parse(xhr2.responseText);
                if (response?.error && response.error.includes("already exists")) {
                    showNotification(response.error, true);
                } else {
                    showNotification("Upload failed. Please try again.", true);
                }
            } catch {
                showNotification("Upload failed. Please try again.", true);
            }
        }
 
        enableClearButtons2();
        paused2 = false;
        resumeBasePct2 = 0;
        uploadPauseBtn2.querySelector('i').classList.replace('fa-play', 'fa-pause');
        uploadPauseBtn2.querySelector('.clear-text').textContent = 'Pause';
        uploadPauseBtn2.title = 'Pause upload';
    };
 
    xhr2.onerror = function () {
        uploadProgressContainer2.style.display = 'none';
        if (updateEventBtn2) {
            updateEventBtn2.disabled = false;
            updateEventBtn2.style.cursor = 'pointer';
        }
        showNotification("An error occurred during upload.", true);
        enableClearButtons2();
    };
 
    xhr2.send(formData);    
}

// Pause / Resume for edit modal
uploadPauseBtn2.addEventListener('click', function () {
if (!paused2 && xhr2 && xhr2.readyState < 4) {
xhr2.abort();
paused2 = true;
resumeBasePct2 = Math.round((lastLoaded2 / lastTotal2) * 100);
this.querySelector('i').classList.replace('fa-pause', 'fa-play');
this.querySelector('.clear-text').textContent = 'Resume';
this.title = 'Resume upload';
} else if (paused2) {
startUpload2(true);
paused2 = false;
this.querySelector('i').classList.replace('fa-play', 'fa-pause');
this.querySelector('.clear-text').textContent = 'Pause';
this.title = 'Pause upload';
}
});
// Cancel for edit modal
uploadCancelBtn2.addEventListener('click', function () {
    if (xhr2) xhr2.abort();
    uploadProgressContainer2.style.display = 'none';
    paused2 = false;
    resumeBasePct2 = 0;
    uploadPauseBtn2.querySelector('i').classList.replace('fa-play', 'fa-pause');
    uploadPauseBtn2.querySelector('.clear-text').textContent = 'Pause';
    uploadPauseBtn2.title = 'Pause upload';
    enableClearButtons2();
    if (updateEventBtn2) {
    updateEventBtn2.disabled = false;
    updateEventBtn2.style.cursor = 'pointer';
    }
    });
    // Modify the editEventForm2 submit handler:
editEventForm2.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.querySelector('#updateEventBtn');
    submitBtn.disabled = true;

    // Show upload progress container if there are files to upload
    if (dataTransfer2.files.length > 0) {
        uploadProgressContainer2.style.display = 'block';
        uploadProgressBar2.style.width = '0%';
        uploadProgressBar2.style.backgroundColor = 'red';
        uploadPercent2.textContent = '0%';
    }

    try {
        const formData = new FormData(this);
        
        // Add retained media files
        const retainedImages = Array.from(document.querySelectorAll('#imagePreview .image-preview img'))
            .map(img => {
                const path = img.src.split('/storage/')[1];
                return path ? 'event_images/' + path.split('/').pop() : '';
            })
            .filter(Boolean);
        
        const retainedVideos = Array.from(document.querySelectorAll('#videoPreview .video-preview video'))
            .map(video => {
                const path = video.src.split('/storage/')[1];
                return path ? 'event_videos/' + path.split('/').pop() : '';
            })
            .filter(Boolean);

        formData.append('retained_images', retainedImages.join(','));
        formData.append('retained_videos', retainedVideos.join(','));
        
        // Add new files and start upload
        if (dataTransfer2.files.length > 0) {
            Array.from(dataTransfer2.files).forEach(file => {
                formData.append('eventMedia[]', file);
            });
            
            // Create and configure XHR
            xhr2 = new XMLHttpRequest();
            xhr2.open('POST', this.action, true);
            xhr2.setRequestHeader('X-CSRF-TOKEN', document.querySelector('meta[name="csrf-token"]').content);
            xhr2.setRequestHeader('Accept', 'application/json');

            // Handle upload progress
            xhr2.upload.onprogress = function(evt) {
                if (evt.lengthComputable) {
                    const percentComplete = Math.round((evt.loaded / evt.total) * 100);
                    uploadProgressBar2.style.width = percentComplete + '%';
                    uploadPercent2.textContent = percentComplete + '%';
                    
                    // Change color based on progress
                    let red, green;
                    if (percentComplete <= 50) {
                        red = 255;
                        green = Math.round(255 * (percentComplete / 50));
                    } else {
                        red = Math.round(255 * (1 - (percentComplete - 50) / 50));
                        green = 255;
                    }
                    uploadProgressBar2.style.backgroundColor = `rgb(${red},${green},0)`;
                }
            };

            // Handle completion
            xhr2.onload = function() {
                const result = JSON.parse(xhr2.responseText);
                if (xhr2.status >= 200 && xhr2.status < 300) {
                    showNotification(result.message || "Event updated successfully!");
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    throw new Error(result.error || 'Failed to update event');
                }
            };

            // Send the form data
            xhr2.send(formData);
        } else {
            // If no files to upload, just submit normally
            const response = await fetch(this.action, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json'
                },
                body: formData
            });
            const result = await response.json();
            
            if (response.ok) {
                showNotification(result.message || "Event updated successfully!");
                setTimeout(() => window.location.reload(), 1500);
            } else {
                throw new Error(result.error || 'Failed to update event');
            }
        }
    } catch (error) {
        showNotification(error.message, true);
        submitBtn.disabled = false;
        uploadProgressContainer2.style.display = 'none';
    }
});

// Add this after your uploadProgressContainer declaration
function initializeUploadControls() {
    // Make upload controls clickable by ensuring proper z-index and event handling
    const uploadControls = document.querySelector('#editEventModal #uploadProgressContainer');
    if (uploadControls) {
        uploadControls.style.position = 'relative';
        uploadControls.style.zIndex = '1000';

        // Reinitialize pause button
        if (uploadPauseBtn2) {
            uploadPauseBtn2.style.cursor = 'pointer';
            uploadPauseBtn2.style.position = 'relative';
            uploadPauseBtn2.style.zIndex = '1001';
            
            // Remove existing listeners and add new one
            const newPauseBtn = uploadPauseBtn2.cloneNode(true);
            uploadPauseBtn2.parentNode.replaceChild(newPauseBtn, uploadPauseBtn2);
            uploadPauseBtn2 = newPauseBtn;
            
            uploadPauseBtn2.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (!paused2 && xhr2 && xhr2.readyState < 4) {
                    xhr2.abort();
                    paused2 = true;
                    resumeBasePct2 = Math.round((lastLoaded2 / lastTotal2) * 100);
                    this.querySelector('i').classList.replace('fa-pause', 'fa-play');
                    this.querySelector('.clear-text').textContent = 'Resume';
                    this.title = 'Resume upload';
                } else if (paused2) {
                    startUpload2(true);
                    paused2 = false;
                    this.querySelector('i').classList.replace('fa-play', 'fa-pause');
                    this.querySelector('.clear-text').textContent = 'Pause';
                    this.title = 'Pause upload';
                }
            });
        }

        // Reinitialize cancel button
        if (uploadCancelBtn2) {
            uploadCancelBtn2.style.cursor = 'pointer';
            uploadCancelBtn2.style.position = 'relative';
            uploadCancelBtn2.style.zIndex = '1001';
            
            // Remove existing listeners and add new one
            const newCancelBtn = uploadCancelBtn2.cloneNode(true);
            uploadCancelBtn2.parentNode.replaceChild(newCancelBtn, uploadCancelBtn2);
            uploadCancelBtn2 = newCancelBtn;
            
            uploadCancelBtn2.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (xhr2) {
                    xhr2.abort();
                    uploadProgressContainer.style.display = 'none';
                    paused2 = false;
                    resumeBasePct2 = 0;
                    lastLoaded2 = 0;
                    lastTotal2 = 0;
                    
                    if (uploadProgressBar2) {
                        uploadProgressBar2.style.width = '0%';
                        uploadProgressBar2.style.backgroundColor = 'red';
                    }
                    if (uploadPercent2) {
                        uploadPercent2.textContent = '0%';
                    }
                    
                    if (uploadPauseBtn2) {
                        uploadPauseBtn2.querySelector('i').classList.replace('fa-play', 'fa-pause');
                        uploadPauseBtn2.querySelector('.clear-text').textContent = 'Pause';
                        uploadPauseBtn2.title = 'Pause upload';
                    }
                    
                    enableClearButtons2();
                    if (updateEventBtn2) {
                        updateEventBtn2.disabled = false;
                        updateEventBtn2.style.cursor = 'pointer';
                    }
                    
                    showNotification("Upload cancelled", true);
                }
            });
        }
    }
}

// Call initialize function when showing upload progress
const originalShowUploadProgress2 = showUploadProgress2;
showUploadProgress2 = function() {
    originalShowUploadProgress2();
    initializeUploadControls();
};

function showUploadProgress2() {
    if (uploadProgressContainer2) {
        uploadProgressContainer2.style.display = 'block';
    }
    if (uploadProgressBar2) {
        uploadProgressBar2.style.width = '0%';
        uploadProgressBar2.style.backgroundColor = 'rgb(255,0,0)';
    }
    if (uploadPercent2) {
        uploadPercent2.textContent = '0%';
    }
}

});

// Add event listener for close2 button in edit modal
document.querySelector('.close2').addEventListener('click', function() {
    const editEventModal = document.getElementById('editEventModal');
    editEventModal.classList.remove("show");
    setTimeout(() => {
    editEventModal.style.display = "none";
    // Clear all previews
    const imagePreviewContainer = document.querySelector('#editEventModal #imagePreview');
    const videoPreviewContainer = document.querySelector('#editEventModal #videoPreview');
    if (imagePreviewContainer) {
    imagePreviewContainer.querySelectorAll('.image-preview').forEach(el => el.remove());
    }
    if (videoPreviewContainer) {
videoPreviewContainer.querySelectorAll('.video-preview').forEach(el => el.remove());
}
// Reset form
document.getElementById('editEventForm').reset();
// Update placeholders
updatePlaceholdersAndButtons2();
}, 300); // Match this with your CSS transition duration
});

function createPreviewElement(file, isVideo = false) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(isVideo ? 'video-preview' : 'image-preview');

    const mediaElement = isVideo ? document.createElement('video') : document.createElement('img');
    
    // Set up media element
    if (isVideo) {
        mediaElement.controls = false;
        mediaElement.muted = true;
        mediaElement.playsInline = true;
    }

    // Create file name element
    const fileName = document.createElement('div');
    fileName.classList.add('file-name');
    fileName.textContent = file.name;

    // Create remove button
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = '×';
    removeBtn.classList.add('remove-btn');
    removeBtn.onclick = () => wrapper.remove();

    // Add elements to wrapper
    wrapper.appendChild(mediaElement);
    wrapper.appendChild(fileName);
    wrapper.appendChild(removeBtn);

    return wrapper;
}

// Use this function when adding previews in both add and edit modals
function addPreviewToEdit(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const isVideo = file.type.startsWith('video/');
        const preview = createPreviewElement(file, isVideo);
        const mediaElement = preview.querySelector(isVideo ? 'video' : 'img');
        mediaElement.src = e.target.result;
        
        const container = isVideo ? 
            document.querySelector('#editEventModal #videoPreview') : 
            document.querySelector('#editEventModal #imagePreview');
            
        container.appendChild(preview);
    };
    reader.readAsDataURL(file);
}