// —— SIDE‑MENU ACTIVE HIGHLIGHT ——  
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');  
allSideMenu.forEach(item => {  
  const li = item.parentElement;  
  item.addEventListener('click', function () {  
    allSideMenu.forEach(i => i.parentElement.classList.remove('active'));  
    li.classList.add('active');  
  });  
});  

// —— SIDEBAR ELEMENTS & STATE PERSISTENCE ——  
const sidebar = document.getElementById('sidebar');  
const menuButton = document.querySelector('#content nav .bx.bx-menu');  
const closeSidebarBtn = document.getElementById('closeSidebarBtn');  

// Apply saved state immediately  
const savedState = localStorage.getItem('sidebarState');  
if (savedState === 'hide') {  
  sidebar.classList.add('hide');  
} else {  
  sidebar.classList.remove('hide');  
}  

menuButton.addEventListener('click', function () {  
  if (window.innerWidth > 768) {  
    sidebar.classList.toggle('hide');  
  } else {  
    sidebar.classList.toggle('show');  
  }  
  if (sidebar.classList.contains('show') || sidebar.classList.contains('hide')) {  
    localStorage.setItem('sidebarState', 'show');  
  } else {  
    localStorage.setItem('sidebarState', 'hide');  
  }  
});  

if (closeSidebarBtn) {  
  closeSidebarBtn.addEventListener('click', function () {  
    sidebar.classList.remove('show');  
    localStorage.setItem('sidebarState', 'hide');  
  });  
}  

document.addEventListener("DOMContentLoaded", function () {  
  if (localStorage.getItem('sidebarState') === 'hide') {  
    sidebar.classList.add('hide');  
  } else {  
    sidebar.classList.remove('hide');  
  }  
});  

// —— EDIT BUTTON & CHECKBOXES IN TABLE ——  
document.addEventListener("DOMContentLoaded", function () {  
  let checkboxes = document.querySelectorAll(".checkbox-column");  
  let editBtn = document.getElementById("edit-btn");  
  let deleteBtn = document.getElementById("delete-btn");  
  let selectAllCheckbox = document.getElementById("select-all");  
  let isEditing = false;  

  // Initial setup
  checkboxes.forEach(col => col.classList.add("hidden"));  
  deleteBtn.classList.add("hidden");  

  // Edit button toggle
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

  // Select all functionality
  selectAllCheckbox.addEventListener("change", function () {  
      let itemCheckboxes = document.querySelectorAll(".item-checkbox");  
      itemCheckboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);  
      updateButtons();  
  });  

  document.addEventListener("change", function (e) {  
      if (e.target.classList.contains("item-checkbox")) updateButtons();  
  });  

  // Individual trash icon delete
  document.getElementById('promoTableBody').addEventListener('click', function(e) {
      if (e.target.classList.contains('delete-btn')) {
          const row = e.target.closest('tr');
          const promoName = row.dataset.name;

          Swal.fire({
              title: 'Delete Promo?',
              text: `Are you sure you want to delete "${promoName}"?`,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
              if (result.isConfirmed) {
                  deletePromos([promoName]);
              }
          });
      }
  });

  // Bulk checkbox delete
  deleteBtn.addEventListener("click", function () {  
      let selected = document.querySelectorAll(".item-checkbox:checked");  
      if (!selected.length) return;  

      const promoNames = Array.from(selected).map(checkbox => 
          checkbox.closest('tr').dataset.name
      );

      Swal.fire({
          title: 'Delete Selected Promos?',
          text: `Are you sure you want to delete ${selected.length} selected items?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete them!'
      }).then((result) => {
          if (result.isConfirmed) {
              deletePromos(promoNames);
          }
      });
  });  

  // Common delete function
  async function deletePromos(promoNames) {
      try {
          const response = await fetch('/admin/promo/delete', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                  'Accept': 'application/json'
              },
              body: JSON.stringify({ promoNames: promoNames })
          });

          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();

          if (data.success) {
              // Remove rows from table
              promoNames.forEach(name => {
                  const row = document.querySelector(`tr[data-name="${name}"]`);
                  if (row) row.remove();
              });

              // Show success alert with OK button
              Swal.fire({
                  title: 'Deleted!',
                  text: 'Promo(s) have been deleted.',
                  icon: 'success',
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#4CAF50'
              });

              // Update buttons
              updateButtons();
          } else {
              throw new Error(data.message || 'Failed to delete promo(s)');
          }
      } catch (error) {
          Swal.fire({
              title: 'Error!',
              text: error.message,
              icon: 'error',
              confirmButtonText: 'OK',
              confirmButtonColor: '#3085d6'
          });
          console.error('Delete error:', error);
      }
  }

  function updateButtons() {  
      let checked = document.querySelectorAll(".item-checkbox:checked").length;  
      let total = document.querySelectorAll(".item-checkbox").length;  
      if (checked > 0) {  
          editBtn.classList.add("hidden");  
          deleteBtn.classList.remove("hidden");  
      } else {  
          editBtn.classList.remove("hidden");  
          deleteBtn.classList.add("hidden");  
      }  
      selectAllCheckbox.checked = (checked === total);  
  }  

  function uncheckAll() {  
      document.querySelectorAll(".item-checkbox")  
          .forEach(cb => cb.checked = false);  
      updateButtons();  
  }
});
// —— PROMO FILTER FUNCTION ——  
function filterPromos() {
    let filterValue = document.getElementById('promoFilter').value.toLowerCase();
    let rows = document.getElementById('promoTableBody').getElementsByTagName('tr');
    
    for (let row of rows) {
        let venueCell = row.querySelector('td:nth-child(7)'); // Assuming venue is in 7th column
        let venueValue = venueCell ? venueCell.textContent.trim().toLowerCase() : '';
        
        if (filterValue === 'all') {
            row.style.display = '';
        } else {
            row.style.display = venueValue === filterValue ? '' : 'none';
        }
    }
    
    // Count visible rows after filtering
    let visibleRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
    
    // Add or remove many-items class based on visible rows
    const tableContainer = document.querySelector('.table-container');
    if (visibleRows > 2) {
        tableContainer.classList.add('many-items');
    } else {
        tableContainer.classList.remove('many-items');
    }
}

// —— PROMO MODAL OPEN/CLOSE ——  
document.getElementById("addPromoBtn").addEventListener("click", function () {  
  document.getElementById("promoModal").style.display = "block";  
});  
document.querySelector("#promoModal .close").addEventListener("click", function () {  
  document.getElementById("promoModal").style.display = "none";  
});  
window.onclick = function (e) {  
  if (e.target == document.getElementById("promoModal")) {  
    document.getElementById("promoModal").style.display = "none";  
  }  
};  

// —— IMAGE PREVIEW FOR INPUT CHANGE ——  
document.getElementById("promoImage").addEventListener("change", function (event) {  
  let previewContainer = document.getElementById("imagePreviewContainer");  
  previewContainer.innerHTML = "";  
  Array.from(event.target.files).forEach(file => {  
    let reader = new FileReader();  
    reader.onload = function (e) {  
      let div = document.createElement("div");  
      div.classList.add("image-preview");  
      let img = document.createElement("img");  
      img.src = e.target.result;  
      let btn = document.createElement("button");  
      btn.textContent = "×";  
      btn.classList.add("remove-btn");  
      btn.addEventListener("click", () => div.remove());  
      div.append(img, btn);  
      previewContainer.appendChild(div);  
    };  
    reader.readAsDataURL(file);  
  });  
  event.target.value = "";  
});  

// —— PROFILE DROPDOWN ——  
function toggleDropdown() {  
  document.getElementById('profileDropdown').classList.toggle('show');  
}  
window.onclick = function (e) {  
  if (!e.target.matches('.nav-profile, .nav-profile img')) {  
    let dd = document.getElementById('profileDropdown');  
    if (dd.classList.contains('show')) dd.classList.remove('show');  
  }  
};  
function toggleProfileDropdown() {  
  document.getElementById('profileDropdown').classList.toggle('show');  
}  
document.addEventListener('click', function (e) {  
  let dd = document.getElementById('profileDropdown');  
  let pl = document.querySelector('.nav-profile');  
  if (!pl.contains(e.target) && !dd.contains(e.target)) {  
    if (dd.classList.contains('show')) dd.classList.remove('show');  
  }  
});  
function viewProfile() {  
  document.getElementById('profileDropdown').classList.remove('show');  
  document.getElementById('profileContainer').classList.add('active');  
}  
document.querySelector('#viewProfile').addEventListener('click', viewProfile);  
function toggleProfile() {  
  document.getElementById('profileContainer').classList.toggle('active');  
  document.querySelector('.main-content').classList.toggle('profile-active');  
}  

// —— MENU SELECTOR FOR PROMO FORM ——  
document.addEventListener('DOMContentLoaded', function () {  
  const menuSelect = document.getElementById('menuSelect');  
  const menuList = document.getElementById('menuList');  
  const menuField = document.getElementById('menuField');  
  let selectedMenus = [];  

  menuSelect.addEventListener('change', function (e) {  
    e.preventDefault();  
    const name = this.options[this.selectedIndex].textContent.trim();  
    if (!name || name === 'Select Menu Item') return;  
    if (selectedMenus.includes(name)) {  
      showNotification('Menu item already exists!', 'error');  
      this.value = '';  
      return;  
    }  
    selectedMenus.push(name);  
    menuField.value = selectedMenus.join(',');  
    const div = document.createElement('div');  
    div.classList.add('menu-item');  
    const span = document.createElement('span');  
    span.textContent = name;  
    const btn = document.createElement('button');  
    btn.innerHTML = '❌';  
    btn.classList.add('button2');  
    btn.type = 'button';  
    btn.style.cursor = 'pointer';  
    btn.addEventListener('click', function (e) {  
      e.preventDefault();  
      selectedMenus = selectedMenus.filter(i => i !== name);  
      menuField.value = selectedMenus.join(',');  
      div.remove();  
    });  
    div.append(span, btn);  
    menuList.appendChild(div);  
    this.value = '';  
  });  
});  

// —— FULL DRAG‑AND‑DROP + AJAX SUBMIT MODULE ——  
document.addEventListener('DOMContentLoaded', function () {  
  const dropArea = document.getElementById('promoDropArea');  
  const fileInput = document.getElementById('promoImage');  
  const previewContainer = document.getElementById('promoImagePreviewContainer');  
  const clearAllBtn = document.getElementById('promoClearAllBtn');  
  const existingFiles = new Map();  

  fileInput.setAttribute('multiple', '');  
  ['dragenter','dragover','dragleave','drop'].forEach(evt => {  
    dropArea.addEventListener(evt, preventDefaults, false);  
    document.body.addEventListener(evt, preventDefaults, false);  
  });  
  ['dragenter','dragover'].forEach(evt => dropArea.addEventListener(evt, highlight, false));  
  ['dragleave','drop'].forEach(evt => dropArea.addEventListener(evt, unhighlight, false));  

  dropArea.addEventListener('drop', handleDrop, false);  
  dropArea.addEventListener('click', () => fileInput.click());  
  fileInput.addEventListener('change', handleFiles);  
  clearAllBtn.addEventListener('click', clearImages);  

  function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }  
  function highlight() { dropArea.classList.add('highlight'); }  
  function unhighlight() { dropArea.classList.remove('highlight'); }  

  async function handleDrop(e) {  
    const items = [...e.dataTransfer.items], files = [];  
    for (let item of items) {  
      if (item.kind === 'file') {  
        const entry = item.webkitGetAsEntry();  
        if (entry) {  
          if (entry.isDirectory) await processDirectory(entry, files);  
          else {  
            const f = item.getAsFile();  
            if (f) files.push(f);  
          }  
        }  
      }  
    }  
    processFiles(files);  
  }  

  async function processDirectory(dirEntry, files) {  
    const entries = await readDirectoryEntries(dirEntry);  
    for (let entry of entries) {  
      if (entry.isDirectory) await processDirectory(entry, files);  
      else {  
        const f = await getFileFromEntry(entry);  
        if (f) files.push(f);  
      }  
    }  
  }  

  function readDirectoryEntries(dirEntry) {  
    return new Promise(resolve => {  
      const reader = dirEntry.createReader();  
      reader.readEntries(resolve);  
    });  
  }  

  function getFileFromEntry(entry) {  
    return new Promise(resolve => entry.file(resolve));  
  }  

  function handleFiles(e) {  
    processFiles([...e.target.files]);  
    fileInput.value = '';  
  }  

  function processFiles(files) {  
    const placeholder = document.getElementById('promoPlaceholderText');  
    if (placeholder) placeholder.style.display = 'none';  
    files.forEach(file => {  
      if (!file.type.startsWith('image/')) {  
        showNotification(`${file.name} is not an image file`, 'error');  
        return;  
      }  
      const fileKey = `${file.name}-${file.size}`;  
      if (existingFiles.has(fileKey)) {  
        showNotification(`${file.name} already exists`, 'error');  
        return;  
      }  
      existingFiles.set(fileKey, file);  
      const reader = new FileReader();  
      reader.onload = function (e) {  
        const div = document.createElement('div');  
        div.className = 'image-preview';  
        const img = document.createElement('img');  
        img.src = e.target.result;  
        img.className = 'preview-img';  
        const nameSpan = document.createElement('span');  
        nameSpan.className = 'file-name';  
        nameSpan.textContent = file.name;  
        const remBtn = document.createElement('button');  
        remBtn.innerHTML = '×';  
        remBtn.className = 'remove-btn';  
        remBtn.onclick = function () {  
          existingFiles.delete(fileKey);  
          div.remove();  
          checkEmptyPreview();  
        };  
        div.append(img, nameSpan, remBtn);  
        previewContainer.appendChild(div);  
      };  
      reader.readAsDataURL(file);  
    });  
  }  

  function clearImages() {  
    existingFiles.clear();  
    previewContainer.innerHTML = '<p id="promoPlaceholderText" class="placeholder-text">Images will be shown here</p>';  
  }  

  function checkEmptyPreview() {  
    if (!previewContainer.querySelector('.image-preview')) clearImages();  
  }  

  // —— CENTRAL NOTIFICATION UTILITY ——  
  function showNotification(message, type = 'success') {  
    const n = document.getElementById('notification');  
    const m = document.getElementById('notification-message');  
    n.style.display = 'block';  
    n.className = type;  
    m.textContent = message;  
    clearTimeout(n._timeout);  
    n._timeout = setTimeout(() => {  
      n.style.opacity = '0';  
      setTimeout(() => {  
        n.style.display = 'none';  
        n.style.opacity = '1';  
      }, 300);  
    }, 3000);  
  }  

  // —— FORM SUBMISSION WITH AJAX ——  
  const promoForm = document.getElementById('promoForm');  
  const savePromoBtn = document.getElementById('savePromoBtn');  
  const menuField = document.getElementById('menuField');  
  const menuList = document.getElementById('menuList');  

  function updateMenusInput() {  
    const menus = Array.from(menuList.querySelectorAll('.menu-item span'))  
      .map(span => span.textContent.trim());  
    menuField.value = menus.join(',');  
  }  

  promoForm.addEventListener('submit', async function (e) {  
    e.preventDefault();  
    updateMenusInput();  
    const formData = new FormData(promoForm);  
    Array.from(existingFiles.values()).forEach(file => formData.append('images[]', file));  

    // Remove any existing notifications first
    const existingNotifications = document.querySelectorAll('.notification-popup');
    existingNotifications.forEach(notification => notification.remove());

    try {  
      const response = await fetch(promoForm.action, {  
        method: 'POST',  
        headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },  
        body: formData  
      });  
      const data = await response.json();  
      if (!data.success) throw new Error(data.message || 'Failed to add promo');  

      // Show success notification
      const successNotification = document.createElement('div');
      successNotification.className = 'notification-popup';
      successNotification.style.display = 'block';
      successNotification.style.position = 'fixed';
      successNotification.style.top = '20px';
      successNotification.style.left = '50%';
      successNotification.style.transform = 'translateX(-50%)';
      successNotification.style.backgroundColor = '#4CAF50';
      successNotification.style.color = 'white';
      successNotification.style.padding = '10px 20px';
      successNotification.style.borderRadius = '5px';
      successNotification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      successNotification.style.fontSize = '16px';
      successNotification.style.zIndex = '99999';
      successNotification.textContent = 'Successfully added new promo!';
      document.body.appendChild(successNotification);

      setTimeout(() => {
        successNotification.remove();
      }, 3000);

      promoForm.reset();  
      menuList.innerHTML = '';  
      clearImages();  
      document.getElementById('promoModal').style.display = 'none';  
      setTimeout(() => window.location.reload(), 1500);  

    } catch (error) {  
      // Show error notification
      const errorNotification = document.createElement('div');
      errorNotification.className = 'notification-popup';
      errorNotification.style.display = 'block';
      errorNotification.style.position = 'fixed';
      errorNotification.style.top = '20px';
      errorNotification.style.left = '50%';
      errorNotification.style.transform = 'translateX(-50%)';
      errorNotification.style.backgroundColor = '#f44336';
      errorNotification.style.color = 'white';
      errorNotification.style.padding = '10px 20px';
      errorNotification.style.borderRadius = '5px';
      errorNotification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
      errorNotification.style.fontSize = '16px';
      errorNotification.style.zIndex = '99999';
      errorNotification.textContent = error.message || 'An error occurred while adding promo';
      document.body.appendChild(errorNotification);

      setTimeout(() => {
        errorNotification.remove();
      }, 3000);
    }  
  });  
});

document.addEventListener('DOMContentLoaded', function() {
    // Price input handling
    const priceInput = document.getElementById('promoPrice');
    
    // Handle input formatting while typing
    priceInput.addEventListener('input', function(e) {
        let value = this.value.replace(/[^\d.]/g, '');
        
        const decimalPoints = value.match(/\./g);
        if (decimalPoints && decimalPoints.length > 1) {
            value = value.replace(/\.(?=.*\.)/g, '');
        }
        
        if (value.includes('.')) {
            const [whole, decimal] = value.split('.');
            value = `${whole}.${decimal.slice(0, 2)}`;
        }
        
        this.value = value;
    });

    // Handle form submission formatting
    const promoForm = document.getElementById('promoForm');
    promoForm.addEventListener('submit', function(e) {
        const price = priceInput.value;
        if (price) {
            if (!price.includes('.')) {
                priceInput.value = price + '.00';
            } else if (price.split('.')[1].length === 1) {
                priceInput.value = price + '0';
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const tableContainer = document.querySelector('.table-container');
    const rows = document.querySelectorAll('#promoTableBody tr');
    
    if (rows.length > 2) {  // Changed from 3 to 2
        tableContainer.classList.add('many-items');
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.promo-search');
    
    searchInput.addEventListener('input', function() {
        filterTableBySearch(this.value);
    });
});

function filterTableBySearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    const rows = document.getElementById('promoTableBody').getElementsByTagName('tr');
    
    for (let row of rows) {
        let text = '';
        // Get text from columns 3 to 7 (Name, Description, Menu List, Venue)
        for (let i = 3; i <= 7; i++) {
            if (row.cells[i]) {
                text += row.cells[i].textContent + ' ';
            }
        }
        text = text.toLowerCase();
        
        if (text.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }

    // Update scrollbar styling based on visible rows
    const visibleRows = Array.from(rows).filter(row => row.style.display !== 'none').length;
    const tableContainer = document.querySelector('.table-container');
    
    if (visibleRows > 2) {
        tableContainer.classList.add('many-items');
    } else {
        tableContainer.classList.remove('many-items');
    }
}
document.addEventListener('DOMContentLoaded', function () {
  // --- EDIT PROMO MODAL LOGIC ---
  const editMenuSelect = document.getElementById('editMenuSelect');
  const editMenuList = document.getElementById('editMenuList');
  const editPromoImage = document.getElementById('editPromoImage');
  const editPromoImagePreviewContainer = document.getElementById('editPromoImagePreviewContainer');
  const editDropArea = document.getElementById('editPromoDropArea');
  const editFileInput = editPromoImage;
  const editPromoForm = document.getElementById('editPromoForm');
  const existingFiles = new Map();
  const editClearAllBtn = document.getElementById('editPromoClearAllBtn');

  document.getElementById('promoTableBody').addEventListener('click', function (e) {
    if (e.target.classList.contains('bx-edit')) {
      const row = e.target.closest('tr');
      const promo = {
        id: row.dataset.id,
        name: row.dataset.name,
        description: row.dataset.description,
        menulist: row.dataset.menulist,
        venue: row.dataset.venue,
        price: row.dataset.price,
        image: row.dataset.image
      };
      openEditModal(promo);
    }
  });

  const closeEditBtn = document.querySelector('.close-edit');
  const editPromoModal = document.getElementById('editPromoModal');
  if (closeEditBtn && editPromoModal) {
    closeEditBtn.addEventListener('click', function () {
      editPromoModal.style.display = 'none';
    });
  }

  function showEditPlaceholder() {
    editPromoImagePreviewContainer.innerHTML = '<p id="editPromoPlaceholderText" class="placeholder-text">Images will be shown here</p>';
  }

  function openEditModal(promo) {
    document.getElementById('editPromoModal').style.display = 'block';
    document.getElementById('editPromoId').value = promo.id;
    document.getElementById('editPromoName').value = promo.name;
    document.getElementById('editPromoDescription').value = promo.description;
    document.getElementById('editVenueSelect').value = promo.venue;
    document.getElementById('editPromoPrice').value = promo.price;
    document.getElementById('originalName').value = promo.name;

    editMenuList.innerHTML = '';
    const menuItems = promo.menulist.split(',');
    menuItems.forEach(item => {
      if (item.trim()) {
        addMenuItemToList(item.trim(), editMenuList, 'editMenuField');
      }
    });

    editPromoImagePreviewContainer.innerHTML = '';
    existingFiles.clear();
    editFileInput.value = '';

    if (promo.image) {
      const images = promo.image.split(',');
      images.forEach(imagePath => {
        if (imagePath.trim()) {
          createImagePreview(imagePath.trim(), editPromoImagePreviewContainer);
        }
      });
      document.getElementById('retained_images').value = promo.image;
    }
    // Show placeholder if no images
    if (!promo.image || !promo.image.trim()) {
      showEditPlaceholder();
      document.getElementById('retained_images').value = '';
    }
  }

  function addMenuItemToList(name, listElement, hiddenFieldId) {
    const div = document.createElement('div');
    div.classList.add('menu-item');
    const span = document.createElement('span');
    span.textContent = name;
    const btn = document.createElement('button');
    btn.innerHTML = '❌';
    btn.classList.add('button2');
    btn.type = 'button';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      div.remove();
      updateMenuField(listElement, hiddenFieldId);
    });
    div.append(span, btn);
    listElement.appendChild(div);
    updateMenuField(listElement, hiddenFieldId);
  }

  function updateMenuField(listElement, fieldId) {
    const menuItems = Array.from(listElement.querySelectorAll('.menu-item span')).map(span => span.textContent.trim());
    document.getElementById(fieldId).value = menuItems.join(',');
  }

  function createImagePreview(imagePath, container) {
    // Remove placeholder if present
    const placeholder = container.querySelector('.placeholder-text');
    if (placeholder) placeholder.remove();

    const div = document.createElement('div');
    div.className = 'image-preview';
    const img = document.createElement('img');
    img.src = `/storage/${imagePath}`;
    img.className = 'preview-img';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'file-name';
    nameSpan.textContent = imagePath.split('/').pop();
    const remBtn = document.createElement('button');
    remBtn.innerHTML = '×';
    remBtn.className = 'remove-btn';
    remBtn.onclick = function () {
      div.remove();
      updateRetainedImages();
      // Show placeholder if no images left
      if (!container.querySelector('.image-preview')) showEditPlaceholder();
    };
    div.append(img, nameSpan, remBtn);
    container.appendChild(div);
  }

  function updateRetainedImages() {
    const container = document.getElementById('editPromoImagePreviewContainer');
    const images = Array.from(container.querySelectorAll('img')).map(img => img.src.split('/storage/')[1]);
    document.getElementById('retained_images').value = images.join(',');
  }

  if (editMenuSelect) {
    editMenuSelect.addEventListener('change', function (e) {
      const name = this.options[this.selectedIndex].textContent.trim();
      if (!name || name === 'Select Menu Item') return;
      const existingItems = Array.from(document.querySelectorAll('#editMenuList .menu-item span')).map(span => span.textContent.trim());
      if (!existingItems.includes(name)) {
        addMenuItemToList(name, document.getElementById('editMenuList'), 'editMenuField');
      }
      this.value = '';
    });
  }

  // Drag and drop events for folder and file support
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
    editDropArea.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  ['dragenter', 'dragover'].forEach(evt => {
    editDropArea.addEventListener(evt, () => editDropArea.classList.add('highlight'));
  });

  ['dragleave', 'drop'].forEach(evt => {
    editDropArea.addEventListener(evt, () => editDropArea.classList.remove('highlight'));
  });

  editDropArea.addEventListener('drop', async function (e) {
    e.preventDefault();
    e.stopPropagation();
    const dt = e.dataTransfer;
    if (dt.items) {
      const items = Array.from(dt.items);
      const files = [];
      for (const item of items) {
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
          if (entry) {
            await traverseFileTree(entry, files);
          } else {
            const file = item.getAsFile();
            if (file) files.push(file);
          }
        }
      }
      handleFilesFromDrop(files);
    } else {
      handleFilesFromDrop([...dt.files]);
    }
  });

  async function traverseFileTree(item, fileList) {
    return new Promise((resolve) => {
      if (item.isFile) {
        item.file(function (file) {
          fileList.push(file);
          resolve();
        });
      } else if (item.isDirectory) {
        const dirReader = item.createReader();
        dirReader.readEntries(async function (entries) {
          for (const entry of entries) {
            await traverseFileTree(entry, fileList);
          }
          resolve();
        });
      }
    });
  }

  function handleFilesFromDrop(files) {
    const placeholder = editPromoImagePreviewContainer.querySelector('.placeholder-text');
    if (placeholder) placeholder.remove();

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        showNotification(`${file.name} is not an image file`, 'error');
        return;
      }
      const fileKey = `${file.name}-${file.size}`;
      if (existingFiles.has(fileKey)) {
        showNotification(`${file.name} already exists`, 'error');
        return;
      }
      existingFiles.set(fileKey, file);

      const reader = new FileReader();
      reader.onload = function (e) {
        const div = document.createElement('div');
        div.className = 'image-preview';
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'preview-img';
        const nameSpan = document.createElement('span');
        nameSpan.className = 'file-name';
        nameSpan.textContent = file.name;
        const remBtn = document.createElement('button');
        remBtn.innerHTML = '×';
        remBtn.className = 'remove-btn';
        remBtn.onclick = function () {
          existingFiles.delete(fileKey);
          div.remove();
          if (!editPromoImagePreviewContainer.querySelector('.image-preview')) showEditPlaceholder();
        };
        div.append(img, nameSpan, remBtn);
        editPromoImagePreviewContainer.appendChild(div);
      };
      reader.readAsDataURL(file);
    });
    editFileInput.value = '';
  }

  editDropArea.addEventListener('click', () => editFileInput.click());
  editFileInput.addEventListener('change', function (e) {
    handleFilesFromDrop([...e.target.files]);
    editFileInput.value = '';
  });

  // CLEAR ALL BUTTON FUNCTIONALITY
  if (editClearAllBtn) {
    editClearAllBtn.addEventListener('click', function () {
      existingFiles.clear();
      editPromoImagePreviewContainer.innerHTML = '';
      showEditPlaceholder();
      document.getElementById('retained_images').value = '';
    });
  }

  editPromoForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const originalName = document.getElementById('originalName').value;
    formData.append('original_name', originalName);
    for (let file of existingFiles.values()) {
      formData.append('images[]', file);
    }
    try {
      const response = await fetch('/admin/promo/update', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
        },
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        showNotification('Promo updated successfully', 'success');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(data.message || 'Failed to update promo');
      }
    } catch (error) {
      showNotification(error.message, 'error');
    }
  });

  function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    notification.style.backgroundColor = type === 'success' ? '#28a745' : '#dc3545';
    notificationMessage.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }
});