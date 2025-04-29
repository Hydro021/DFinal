document.addEventListener("DOMContentLoaded", function () {
    const categories = document.querySelectorAll(".categories-container .category");
    const trashBtn = document.querySelector(".category-actions .bx-trash");
    const menuRows = document.querySelectorAll(".menu-table tbody tr");
    const filterBtn = document.querySelector(".filter-btn");

    // Filter dropdown
    const filterDropdown = document.createElement("ul");
    filterDropdown.classList.add("option-filter-dropdown");
    filterBtn.appendChild(filterDropdown);

    filterBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        filterDropdown.classList.toggle("show");
    });

    document.addEventListener("click", function (e) {
        if (!filterBtn.contains(e.target)) {
            filterDropdown.classList.remove("show");
        }
    });

    let selectedCategory = "";

    function filterByCategory(category) {
        selectedCategory = category;
        menuRows.forEach(row => {
            const rowCategory = row.getAttribute("data-category");
            row.style.display = (category.toUpperCase() === "ALL" || rowCategory === category) ? "" : "none";
        });
    }

    function filterByOption(option) {
        menuRows.forEach(row => {
            const rowOptions = row.querySelector("td:nth-child(7)")?.innerText || "";
            const rowCategory = row.getAttribute("data-category");

            if (selectedCategory === "ALL" || rowCategory === selectedCategory) {
                const options = rowOptions.split(",").map(o => o.trim());
                row.style.display = (option === "ALL" || options.includes(option)) ? "" : "none";
            } else {
                row.style.display = "none";
            }
        });
    }

    categories.forEach(category => {
        category.addEventListener("click", function () {
            categories.forEach(item => item.classList.remove("active"));
            category.classList.add("active");

            const selectedCategoryName = category.querySelector("h4").innerText.trim().toUpperCase();
            filterByCategory(selectedCategoryName);

            const optionSet = new Set();
            menuRows.forEach(row => {
                const rowCategory = row.getAttribute("data-category");
                const optionsText = row.querySelector("td:nth-child(7)")?.innerText;

                if (selectedCategoryName === "ALL" || rowCategory === selectedCategoryName) {
                    const options = optionsText?.split(",").map(o => o.trim()).filter(o => o !== "") || [];
                    options.forEach(opt => optionSet.add(opt));
                }
            });

            filterDropdown.innerHTML = "";
            if (optionSet.size > 0) {
                const allOption = document.createElement("li");
                allOption.textContent = "All Options";
                allOption.style.padding = "5px 10px";
                allOption.style.cursor = "pointer";
                allOption.addEventListener("click", function () {
                    filterByOption("ALL");
                    filterDropdown.classList.remove("show");
                });
                filterDropdown.appendChild(allOption);
            }

            optionSet.forEach(option => {
                if (option) {
                    const li = document.createElement("li");
                    li.textContent = option;
                    li.style.padding = "5px 10px";
                    li.style.cursor = "pointer";
                    li.addEventListener("click", function () {
                        filterByOption(option);
                        filterDropdown.classList.remove("show");
                    });
                    filterDropdown.appendChild(li);
                }
            });
        });
    });

    // Delete category
    if (trashBtn) {
        trashBtn.addEventListener("click", function () {
            const activeCategory = document.querySelector(".categories-container .category.active");
            if (activeCategory) {
                const categoryName = activeCategory.querySelector("h4").innerText.trim();
                const imageName = activeCategory.querySelector("img").src.split('/').pop();

                if (categoryName.toUpperCase() === 'ALL') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Oops!',
                        text: "You cannot delete the 'ALL' category.",
                    });
                    return;
                }

                confirmAndDeleteCategory(categoryName, imageName);
            }
        });
    }

    // Search bar filter
    const searchInput = document.querySelector('.category-search');
    const tableRows = document.querySelectorAll('.menu-table tbody tr');

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();

        tableRows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const matchFound = cells.some(cell => cell.textContent.toLowerCase().includes(query));
            row.style.display = matchFound ? '' : 'none';
        });
    });
});

// ✅ Reusable delete confirmation function
function confirmAndDeleteCategory(categoryName, imageName) {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    Swal.fire({
        title: 'Are you sure?',
        text: `This will delete the category "${categoryName}" and all its associated menu items.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/admin/menu/delete-category', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                body: JSON.stringify({
                    categoryName: categoryName,
                    imageName: imageName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Category deleted successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        const activeCategory = document.querySelector(".categories-container .category.active");
                        if (activeCategory) activeCategory.remove();
                        location.reload();
                    });
                } else {
                    Swal.fire('Error!', data.message || "Failed to delete category. Please try again.", 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire('Error!', 'An error occurred while deleting the category.', 'error');
            });
        }
    });
}


document.addEventListener("DOMContentLoaded", function () {
    // Sidebar Menu Active State
    const allSideMenu = document.querySelectorAll("#sidebar .side-menu.top li a");

    allSideMenu.forEach(item => {
        const li = item.parentElement;
        item.addEventListener("click", function () {
            allSideMenu.forEach(i => i.parentElement.classList.remove("active"));
            li.classList.add("active");
        });
    });
    const sidebar = document.getElementById('sidebar');
    const menuButton = document.querySelector('#content nav .bx.bx-menu');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const menuItemsGroup = document.getElementById('menuItemsGroup');
    
    // Function to update menu-items-group width based on sidebar visibility
    function updateMenuWidth() {
        if (sidebar.classList.contains('hide')) {
            menuItemsGroup.style.width = '75%';
        } else {
            menuItemsGroup.style.width = '68%';
        }
    }
    
    // Apply the saved state immediately
    const savedState = localStorage.getItem('sidebarState');
    if (savedState === 'hide') {
        sidebar.classList.add('hide');
        updateMenuWidth();
    } else {
        sidebar.classList.remove('hide');
        updateMenuWidth();
    }
    
    // Toggle sidebar
    menuButton.addEventListener('click', function (e) {
        e.stopPropagation();
    
        if (window.innerWidth > 768) {
            sidebar.classList.toggle('hide');
        } else {
            if (sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            } else {
                sidebar.classList.add('show');
            }
        }
    
        // Save sidebar state
        if (sidebar.classList.contains('show') || !sidebar.classList.contains('hide')) {
            localStorage.setItem('sidebarState', 'show');
        } else {
            localStorage.setItem('sidebarState', 'hide');
        }
    
        updateMenuWidth(); // Update width on toggle
    });
    
    // Close sidebar on mobile
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', function () {
            sidebar.classList.remove('show');
            localStorage.setItem('sidebarState', 'hide');
            updateMenuWidth(); // Update width when closed
        });
    }
    

// Apply the sidebar state when the page loads
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem('sidebarState') === 'hide') {
        sidebar.classList.add('hide'); // Hide sidebar if the state is 'hide'
    } else {
        sidebar.classList.remove('hide'); // Show sidebar if the state is 'show'
    }
});

// Prevent sidebar closing if clicking outside of the sidebar (only on mobile)
document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
        // Close the sidebar if clicking outside of it (excluding the menu button)
        if (!sidebar.contains(e.target) && !menuButton.contains(e.target)) {
            sidebar.classList.remove('show');
            localStorage.setItem('sidebarState', 'hide');
        }
    }
});

document.getElementById('addCategoryImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewImg = document.getElementById('categoryPreviewImg');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewImg.style.display = 'none';
    }
});

document.getElementById('editCategoryImage').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewImg = document.getElementById('editCategoryPreviewImg');

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImg.src = e.target.result;
            previewImg.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        previewImg.style.display = 'none';
    }
});

    // Modal: Add Category
    const categoryModal = document.getElementById("addCategoryModal");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const closeCategoryBtn = document.querySelector(".add-category-close");

    addCategoryBtn.addEventListener("click", () => categoryModal.style.display = "block");
    closeCategoryBtn.addEventListener("click", () => categoryModal.style.display = "none");
    const editCategoryModal = document.getElementById("editCategoryModal");
const editCategoryBtn = document.getElementById("editCategoryBtn");
const closeEditCategoryBtn = document.querySelector(".edit-category-close");

editCategoryBtn.addEventListener("click", () => {
    editCategoryModal.style.display = "block";
});

closeEditCategoryBtn.addEventListener("click", () => {
    editCategoryModal.style.display = "none";
});

    // Modal: Add Menu
    const menuModal = document.getElementById("menuModal");
    const addMenuBtn = document.getElementById("addMenuBtn");
    const closeMenuBtn = document.querySelector("#menuModal .close");

    addMenuBtn.addEventListener("click", () => menuModal.style.display = "block");
    closeMenuBtn.addEventListener("click", () => menuModal.style.display = "none");

    // Close modals when clicking outside
    window.addEventListener("click", function (event) {
        if (event.target === categoryModal) categoryModal.style.display = "none";
        if (event.target === menuModal) menuModal.style.display = "none";
    });

    // Card Actions Toggle
    window.toggleMenu = function (icon) {
        let actions = icon.parentElement.querySelector(".card-actions");
        if (actions.classList.contains("active")) {
            actions.style.opacity = "0";
            setTimeout(() => {
                actions.classList.remove("active");
                actions.style.display = "none";
            }, 500);
        } else {
            actions.style.display = "flex";
            setTimeout(() => {
                actions.classList.add("active");
                actions.style.opacity = "1";
            }, 10);
        }
    };

    // Category Scroll Control
    const container = document.querySelector(".categories-container");
    const chevronRight = document.querySelector(".chevron-right");

    function checkOverflow() {
        chevronRight.classList.toggle("show", container.scrollWidth > container.clientWidth);
    }

    container.addEventListener("scroll", function () {
        chevronRight.classList.toggle("show", container.scrollLeft + container.clientWidth < container.scrollWidth - 10);
    });

    chevronRight.addEventListener("click", () => container.scrollBy({ left: 200, behavior: "smooth" }));
    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    // Category Dropdown Menu
    document.querySelectorAll(".menu-button").forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation();
            this.nextElementSibling.classList.toggle("show");
        });
    });

    document.addEventListener("click", function () {
        document.querySelectorAll(".menu-options").forEach(menu => menu.classList.remove("show"));
    });
// Edit & Delete Buttons in Menu Table
const checkboxes = document.querySelectorAll(".checkbox-column");
const editBtn = document.getElementById("edit-btn");
const deleteBtn = document.getElementById("delete-btn");
const selectAllCheckbox = document.getElementById("select-all");
let isEditing = false;

// Initially hide checkbox column and delete button
checkboxes.forEach(col => col.classList.add("hidden"));
deleteBtn.classList.add("hidden");

editBtn.addEventListener("click", function () {
    isEditing = !isEditing;
    checkboxes.forEach(col => col.classList.toggle("hidden", !isEditing));
    if (!isEditing) {
        deleteBtn.classList.add("hidden");
        selectAllCheckbox.checked = false;
        uncheckAll();
    }
});

selectAllCheckbox.addEventListener("change", function () {
    document.querySelectorAll(".item-checkbox").forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
    updateButtons();
});

document.addEventListener("change", function (event) {
    if (event.target.classList.contains("item-checkbox")) updateButtons();
});
// Bulk delete
deleteBtn.addEventListener("click", function () {
    let selectedCheckboxes = document.querySelectorAll(".item-checkbox:checked");

    if (selectedCheckboxes.length === 0) return;

    let menuNames = [];
    selectedCheckboxes.forEach(checkbox => {
        let row = checkbox.closest("tr");
        let menuName = row.querySelector("td:nth-child(4)").textContent.trim();
        menuNames.push(menuName);
    });

    Swal.fire({
        title: 'Are you sure?',
        text: "This will permanently delete the selected menu items.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('/delete-menu-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ menuNames: menuNames })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'The selected menu items have been deleted.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    }).then(() => {
                        location.reload(); // ✅ Reload after pressing OK
                    });
                } else {
                    Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting menu items:', error);
                Swal.fire('Error!', 'An error occurred while deleting the menu items.', 'error');
            });
        }
    });
});


// Single delete
document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", function () {
        let row = button.closest("tr");
        let menuName = row.querySelector("td:nth-child(4)").textContent.trim();

        Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the menu item.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/delete-menu-items', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    },
                    body: JSON.stringify({ menuNames: [menuName] })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            title: 'Deleted!',
                            text: 'The menu item has been deleted.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            location.reload(); // ✅ Reload after pressing OK
                        });
                    } else {
                        Swal.fire('Error!', 'Something went wrong. Please try again.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error deleting menu item:', error);
                    Swal.fire('Error!', 'An error occurred while deleting the menu item.', 'error');
                });
            }
        });
    });
});
    

function updateButtons() {
    let checkedItems = document.querySelectorAll(".item-checkbox:checked").length;
    let totalItems = document.querySelectorAll(".item-checkbox").length;

    editBtn.classList.toggle("hidden", checkedItems > 0);
    deleteBtn.classList.toggle("hidden", checkedItems === 0);
    selectAllCheckbox.checked = checkedItems === totalItems;
}

function uncheckAll() {
    document.querySelectorAll(".item-checkbox").forEach(checkbox => checkbox.checked = false);
    updateButtons();
}


    // Image Preview for Add Menu
    document.getElementById("menuImage").addEventListener("change", function (event) {
        let previewContainer = document.getElementById("imagePreviewContainer");
        previewContainer.innerHTML = "";

        Array.from(event.target.files).forEach(file => {
            let reader = new FileReader();
            reader.onload = function (e) {
                let previewDiv = document.createElement("div");
                previewDiv.classList.add("image-preview");

                let img = document.createElement("img");
                img.src = e.target.result;

                let removeBtn = document.createElement("button");
                removeBtn.textContent = "×";
                removeBtn.classList.add("remove-btn");
                removeBtn.addEventListener("click", () => previewDiv.remove());

                previewDiv.appendChild(img);
                previewDiv.appendChild(removeBtn);
                previewContainer.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        });

        event.target.value = "";
    });

    // Category Image Preview
    document.getElementById("addCategoryImage").addEventListener("change", function (event) {
        let previewContainer = document.getElementById("add-category-image-preview");
        previewContainer.innerHTML = "";

        let file = event.target.files[0];
        if (file) {
            let img = document.createElement("img");
            img.src = URL.createObjectURL(file);
            previewContainer.appendChild(img);
        }
    });

    // Dynamic Input Fields for Categories
    document.getElementById("add-category-options-container").addEventListener("input", function (e) {
        if (e.target.classList.contains("add-category-option-input") && e.target.value.trim() !== "") {
            let newInput = document.createElement("input");
            newInput.type = "text";
            newInput.className = "add-category-option-input";
            newInput.placeholder = "Add Option";
            this.appendChild(newInput);
        }
    });

    // Profile Dropdown
    window.toggleDropdown = function () {
        document.getElementById("profileDropdown").classList.toggle("show");
    };

    window.onclick = function (event) {
        if (!event.target.matches(".nav-profile, .nav-profile img")) {
            document.getElementById("profileDropdown").classList.remove("show");
        }
    };
});

	 const logoutBtn = document.getElementById("logout-btn");
    const logoutModal = document.getElementById("logout-modal");
    const confirmLogout = document.getElementById("confirm-logout");
    const cancelLogout = document.getElementById("cancel-logout");

    logoutBtn.addEventListener("click", function () {
      logoutModal.style.display = "flex"; // Show modal
    });

    cancelLogout.addEventListener("click", function () {
      logoutModal.style.display = "none"; // Hide modal
    });

    confirmLogout.addEventListener("click", function () {
      window.location.href = "{{ url('admin/logout') }}"; // Redirect to logout
    });

    // Close modal when clicking outside
    window.onclick = function (event) {
      if (event.target === logoutModal) {
        logoutModal.style.display = "none";
      }
    };


    document.addEventListener("DOMContentLoaded", function () {
        // ======== ADD CATEGORY LOGIC ========
        const addOptionInput = document.getElementById('addOptionInput');
        const optionsList = document.getElementById('optionsList');
        const optionsField = document.getElementById('optionsField');
        const addCategoryImageInput = document.getElementById('addCategoryImage');
        const addImageFilenameDisplay = document.getElementById('addImageFilenameDisplay');
        const addCategoryPreviewImg = document.getElementById('categoryPreviewImg');
    
        // Update options field with the selected options
        function updateAddOptionsInput() {
            const options = Array.from(optionsList.querySelectorAll('.option-item span'))
                .map(span => span.textContent.trim());
            optionsField.value = options.join(', ');
        }
    
        // Add option to the list
        function addAddOption(optionValue) {
            const trimmedValue = optionValue.trim();
            if (!trimmedValue) return;
    
            const existingOptions = Array.from(optionsList.querySelectorAll('.option-item span'))
                .map(span => span.textContent.trim());
    
            if (existingOptions.includes(trimmedValue)) return;
    
            const optionItem = document.createElement('div');
            optionItem.classList.add('option-item');
    
            const optionText = document.createElement('span');
            optionText.textContent = trimmedValue;
    
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.addEventListener('click', function () {
                optionItem.remove();
                updateAddOptionsInput();
            });
    
            optionItem.appendChild(optionText);
            optionItem.appendChild(deleteBtn);
            optionsList.appendChild(optionItem);
            updateAddOptionsInput();
        }
    
        // Listen for 'Enter' key press to add options
        addOptionInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addAddOption(addOptionInput.value);
                addOptionInput.value = '';
            }
        });
    
        // Handle image preview when a new image is selected
        addCategoryImageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (file) {
                addImageFilenameDisplay.value = file.name;
    
                const reader = new FileReader();
                reader.onload = function (e) {
                    addCategoryPreviewImg.src = e.target.result;
                    addCategoryPreviewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                addImageFilenameDisplay.value = '';
                addCategoryPreviewImg.src = '';
                addCategoryPreviewImg.style.display = 'none';
            }
        });
    
        // Update options field when the form is submitted
        document.querySelector('form').addEventListener('submit', function () {
            updateAddOptionsInput();
        });
    
        // ======== EDIT CATEGORY LOGIC ========
        const categoryDropdown = document.getElementById('editCategoryName');
        const imagePreview = document.getElementById('editCategoryPreviewImg');
        const editOptionsList = document.getElementById('editOptionsList');
        const editOptionsField = document.getElementById('editOptionsField');
        const editImageFilename = document.getElementById('editImageFilename');
        const imageFilenameDisplay = document.getElementById('imageFilenameDisplay');
        const editOptionInput = document.getElementById('editOptionInput');
        const editCategoryImageInput = document.getElementById('editCategoryImage');
    
        // Clear the options list in the edit form
        function clearEditOptionsList() {
            editOptionsList.innerHTML = '';
        }
    
        // Update the options field when options are added or removed
        function updateEditOptionsInput() {
            const options = Array.from(editOptionsList.querySelectorAll('.option-item span'))
                .map(span => span.textContent.trim());
            editOptionsField.value = options.join(',');
        }
    
        // Add an option to the edit options list
        function addEditOption(optionValue) {
            const trimmedValue = optionValue.trim();
            if (!trimmedValue) return;
    
            const existingOptions = Array.from(editOptionsList.querySelectorAll('.option-item span'))
                .map(span => span.textContent.trim());
    
            if (existingOptions.includes(trimmedValue)) return;
    
            const optionItem = document.createElement('div');
            optionItem.classList.add('option-item');
    
            const optionText = document.createElement('span');
            optionText.textContent = trimmedValue;
    
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '❌';
            deleteBtn.addEventListener('click', function () {
                optionItem.remove();
                updateEditOptionsInput();
            });
    
            optionItem.appendChild(optionText);
            optionItem.appendChild(deleteBtn);
            editOptionsList.appendChild(optionItem);
            updateEditOptionsInput();
        }
    
        // Listen for 'Enter' key press to add options in edit form
        editOptionInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addEditOption(editOptionInput.value);
                editOptionInput.value = '';
            }
        });
    
        // Handle image filename change in edit form
        editCategoryImageInput.addEventListener('change', function () {
            const file = this.files[0];
            const filename = file ? file.name : '';
            editImageFilename.value = filename;
            imageFilenameDisplay.value = filename;
        });
    
        // Load categories into the dropdown in the edit form
        fetch('/admin/categories/dropdown')
            .then(res => res.json())
            .then(data => {
                const select = document.getElementById('editCategoryName');
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.categoryname;
                    option.textContent = category.categoryname;
                    select.appendChild(option);
                });
            })
            .catch(err => console.error("Error loading categories:", err));
    
        // On dropdown change, load the selected category's details
        categoryDropdown.addEventListener('change', function () {
            const selected = this.value;
            if (!selected) return;
    
            fetch(`/admin/category/${selected}`)
                .then(res => res.json())
                .then(data => {
                    if (data.image) {
                        const imageName = data.image.split('/').pop();
                        imagePreview.src = `/storage/${data.image}`;
                        imagePreview.style.display = 'block';
                        editImageFilename.value = imageName;
                        imageFilenameDisplay.value = imageName;
                    } else {
                        imagePreview.src = '';
                        imagePreview.style.display = 'none';
                        editImageFilename.value = '';
                        imageFilenameDisplay.value = '';
                    }
    
                    clearEditOptionsList();
                    if (data.options) {
                        const options = data.options.split(',').map(opt => opt.trim());
                        options.forEach(opt => addEditOption(opt));
                        updateEditOptionsInput();
                    }
                })
                .catch(err => console.error('Failed to load category details:', err));
        });
    
        // Handle the category form submission for editing
        document.getElementById('editCategoryForm').addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission
    
            const form = e.target;
            const formData = new FormData(form); // Prepare the form data
    
            fetch('/admin/category/update', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') // CSRF token
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Category updated successfully!");
                    // Optionally close the modal, reload the list, etc.
                    location.reload(); // You can also close the modal here if needed
                } else {
                    alert("Failed to update category.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while updating the category.');
            });
        });
    });
    // ====== LOAD MENU CATEGORIES & OPTIONS ======
    const menuCategoryDropdown = document.getElementById('menuCategory');
    const menuOptionsGroup = document.getElementById('menuOptionsGroup');
    const menuOptionDropdown = document.getElementById('menuOption');
    
    // Load categories into the dropdown
    fetch('/admin/categories/dropdown')
        .then(res => res.json())
        .then(data => {
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.categoryname;
                option.textContent = category.categoryname;
                menuCategoryDropdown.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading menu categories:", err));
    

        menuCategoryDropdown.addEventListener('change', function () {
            const selected = this.value;
            const menuOptionCheckboxes = document.getElementById('menuOptionCheckboxes');
            
            if (!selected) {
                menuOptionsGroup.style.display = 'none';
                menuOptionCheckboxes.innerHTML = ''; // Clear checkboxes
                return;
            }
        
            fetch(`/admin/category/${selected}`)
                .then(res => res.json())
                .then(data => {
                    menuOptionCheckboxes.innerHTML = ''; // Clear existing checkboxes
                    if (data.options) {
                        const options = data.options.split(',').map(opt => opt.trim());
                        options.forEach(opt => {
                            const optionWrapper = document.createElement('div');  // New div for each option
        
                            const checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.value = opt;
                            checkbox.id = `option-${opt}`;
                            optionWrapper.appendChild(checkbox); // Append the checkbox below the label
        
                            const label = document.createElement('label');  // Label for the option name
                            label.textContent = opt;
                            label.htmlFor = `option-${opt}`; // Connect label to checkbox
                            optionWrapper.appendChild(label); // Append the label above the checkbox
        
                            menuOptionCheckboxes.appendChild(optionWrapper);  // Append the entire option div to the container
                        });
                        menuOptionsGroup.style.display = 'block';
                    } else {
                        menuOptionsGroup.style.display = 'none';
                    }
                })
                .catch(err => {
                    console.error('Failed to load category options:', err);
                    menuOptionsGroup.style.display = 'none';
                });
        });
        document.addEventListener("DOMContentLoaded", function () {
            const dropArea = document.getElementById('dropArea');
            const previewContainer = document.getElementById('imagePreviewContainer');
            const clearAllBtn = document.getElementById('clearAllBtn');
            const fileInput = document.getElementById('menuImage');
            const dataTransfer = new DataTransfer();
            
            previewContainer.style.maxHeight = '300px';
            previewContainer.style.overflowY = 'auto';
            
            // Function to check if an image already exists in the preview
            function imageExists(dataUrl) {
                const existingImages = previewContainer.querySelectorAll('img');
                return Array.from(existingImages).some(img => img.src === dataUrl);
            }
            
            // Add image preview to the container
            function addImagePreview(file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const dataUrl = e.target.result;
                    if (imageExists(dataUrl)) return;
            
                    const wrapper = document.createElement('div');
                    wrapper.classList.add('image-preview');
            
                    const img = document.createElement('img');
                    img.src = dataUrl;
            
                    const label = document.createElement('span');
                    label.classList.add('file-name');
                    label.textContent = file.name;
            
                    const removeBtn = document.createElement('button');
                    removeBtn.innerHTML = '&times;';
                    removeBtn.classList.add('remove-btn');
                    removeBtn.onclick = () => {
                        const index = Array.from(dataTransfer.files).findIndex(f => f.name === file.name);
                        if (index !== -1) dataTransfer.items.remove(index);
                        wrapper.remove();
                        togglePlaceholder();
                    };
            
                    wrapper.appendChild(img);
                    wrapper.appendChild(label);
                    wrapper.appendChild(removeBtn);
                    previewContainer.appendChild(wrapper);
                    togglePlaceholder();
                };
                reader.readAsDataURL(file);
            
                // Add the file to the dataTransfer object
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
            }
            
            // Handle the files (dragged or selected)
            function handleFiles(files) {
                Array.from(files).forEach(file => {
                    if (file.type.startsWith('image/')) {
                        addImagePreview(file);
                    }
                });
            }
            
            // Drag & drop events
            dropArea.addEventListener('dragover', e => {
                e.preventDefault();
                dropArea.classList.add('drag-over');
            });
            
            dropArea.addEventListener('dragleave', () => {
                dropArea.classList.remove('drag-over');
            });
            
            dropArea.addEventListener('drop', e => {
                e.preventDefault();
                dropArea.classList.remove('drag-over');
            
                const items = e.dataTransfer.items;
                for (let i = 0; i < items.length; i++) {
                    const entry = items[i].webkitGetAsEntry?.();
                    if (entry) {
                        if (entry.isFile) {
                            entry.file(file => {
                                if (file.type.startsWith('image/')) {
                                    addImagePreview(file);
                                }
                            });
                        } else if (entry.isDirectory) {
                            const reader = entry.createReader();
                            reader.readEntries(entries => {
                                entries.forEach(entry => {
                                    if (entry.isFile) {
                                        entry.file(file => {
                                            if (file.type.startsWith('image/')) {
                                                addImagePreview(file);
                                            }
                                        });
                                    }
                                });
                            });
                        }
                    } else {
                        const file = items[i].getAsFile?.();
                        if (file && file.type.startsWith('image/')) {
                            addImagePreview(file);
                        }
                    }
                }
            });
            
            // Clear all images
            clearAllBtn.addEventListener('click', () => {
                previewContainer.innerHTML = '<p id="placeholderText" class="placeholder-text">Images will be shown here</p>';
                dataTransfer.clearData();
                fileInput.files = dataTransfer.files;
            });
            
            // Toggle placeholder text visibility
            function togglePlaceholder() {
                const placeholder = document.getElementById('placeholderText');
                const hasImages = previewContainer.querySelectorAll('.image-preview').length > 0;
                placeholder.style.display = hasImages ? 'none' : 'block';
            }
        
            // Submit form with image file names
            document.getElementById('submitBtn').addEventListener('click', function (e) {
                // Gather the image names from the preview
                const imageNames = Array.from(previewContainer.querySelectorAll('.file-name')).map(span => span.textContent);
                
                // Append image names to a hidden input field or attach it directly to the form data
                const imageNamesInput = document.createElement('input');
                imageNamesInput.type = 'hidden';
                imageNamesInput.name = 'image_names';  // You can change the name to fit your backend logic
                imageNamesInput.value = imageNames.join(',');  // Join the names with commas
        
                // Append the input to the form and submit it
                const form = document.getElementById('yourFormId');  // Replace with your actual form ID
                form.appendChild(imageNamesInput);
                form.submit();
            });
        });
        
  document.getElementById('menuCategory').addEventListener('change', function () {
    const selectedCategory = this.value;
    const menuOptionCheckboxes = document.getElementById('menuOptionCheckboxes');
    
    if (!selectedCategory) {
        document.getElementById('menuOptionsGroup').style.display = 'none';
        menuOptionCheckboxes.innerHTML = ''; // Clear checkboxes
        return;
    }

    fetch(`/admin/category/${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
            menuOptionCheckboxes.innerHTML = ''; // Clear existing checkboxes
            if (data.options) {
                const options = data.options.split(',').map(opt => opt.trim());
                options.forEach(opt => {
                    const optionWrapper = document.createElement('div');
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = 'option[]';  // important for array of options
                    checkbox.value = opt;
                    checkbox.id = `option-${opt}`;
                    const label = document.createElement('label');
                    label.textContent = opt;
                    label.htmlFor = `option-${opt}`;
                    optionWrapper.appendChild(checkbox);
                    optionWrapper.appendChild(label);
                    menuOptionCheckboxes.appendChild(optionWrapper);
                });
                document.getElementById('menuOptionsGroup').style.display = 'block';
            } else {
                document.getElementById('menuOptionsGroup').style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Failed to load category options:', err);
            document.getElementById('menuOptionsGroup').style.display = 'none';
        });
});
document.getElementById('menuImage').addEventListener('change', function (e) {
    const files = e.target.files;
    const previewContainer = document.getElementById('imagePreviewContainer');
    previewContainer.innerHTML = ''; // Clear previous previews

    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const imgElement = document.createElement('img');
            imgElement.src = event.target.result;
            imgElement.classList.add('preview-image');
            previewContainer.appendChild(imgElement);
        };
        reader.readAsDataURL(files[i]);
    }
});

document.addEventListener("DOMContentLoaded", function () {
    // ========== IMAGE UPLOAD LOGIC (EDIT) ==========
    const dropArea = document.getElementById('editDropArea');
    const previewContainer = document.getElementById('editImagePreviewContainer');
    const clearAllBtn = document.getElementById('editClearAllBtn');
    const fileInput = document.getElementById('editMenuImage');
    const dataTransfer = new DataTransfer();
    const editImageFileNames = new Set();

    previewContainer.style.maxHeight = '300px';
    previewContainer.style.overflowY = 'auto';

    function imageExists(dataUrl) {
        const existingImages = previewContainer.querySelectorAll('img');
        return Array.from(existingImages).some(img => img.src === dataUrl);
    }

    function togglePlaceholder() {
        const placeholder = document.getElementById('editPlaceholderText');
        const hasImages = previewContainer.querySelectorAll('.image-preview').length > 0;
        if (placeholder) {
            placeholder.style.display = hasImages ? 'none' : 'block';
        }
    }

    function addImagePreview(file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const dataUrl = e.target.result;
            if (imageExists(dataUrl)) return;

            const wrapper = document.createElement('div');
            wrapper.classList.add('image-preview');

            const img = document.createElement('img');
            img.src = dataUrl;

            const label = document.createElement('span');
            label.classList.add('file-name');
            label.textContent = file.name;

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '&times;';
            removeBtn.classList.add('remove-btn');
            removeBtn.onclick = () => {
                const index = Array.from(dataTransfer.files).findIndex(f => f.name === file.name);
                if (index !== -1) dataTransfer.items.remove(index);
                wrapper.remove();
                editImageFileNames.delete(file.name);
                togglePlaceholder();
                updateImageNamesInput();
            };

            wrapper.appendChild(img);
            wrapper.appendChild(label);
            wrapper.appendChild(removeBtn);
            previewContainer.appendChild(wrapper);
            togglePlaceholder();
        };
        reader.readAsDataURL(file);

        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        editImageFileNames.add(file.name);
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/') && !editImageFileNames.has(file.name)) {
                addImagePreview(file);
            }
        });
    }

    dropArea.addEventListener('dragover', e => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', e => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');
        const items = e.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            const entry = items[i].webkitGetAsEntry?.();
            if (entry) {
                if (entry.isFile) {
                    entry.file(file => {
                        if (file.type.startsWith('image/')) {
                            addImagePreview(file);
                        }
                    });
                } else if (entry.isDirectory) {
                    const reader = entry.createReader();
                    reader.readEntries(entries => {
                        entries.forEach(entry => {
                            if (entry.isFile) {
                                entry.file(file => {
                                    if (file.type.startsWith('image/')) {
                                        addImagePreview(file);
                                    }
                                });
                            }
                        });
                    });
                }
            } else {
                const file = items[i].getAsFile?.();
                if (file && file.type.startsWith('image/')) {
                    addImagePreview(file);
                }
            }
        }
    });

    clearAllBtn.addEventListener('click', () => {
        previewContainer.innerHTML = '<p id="editPlaceholderText" class="placeholder-text">No images available</p>';
        dataTransfer.clearData();
        fileInput.files = dataTransfer.files;
        editImageFileNames.clear();
        togglePlaceholder();
        updateImageNamesInput();
    });

    function updateImageNamesInput() {
        const container = document.getElementById('editImagePreviewContainer');
        const images = container.querySelectorAll('img');
        const names = Array.from(images).map(img => {
            const fileName = img.getAttribute('data-filename') || img.src.split('/').pop();
            return fileName.startsWith('menu_images/') ? fileName : `menu_images/${fileName}`;
        });
    
        let imageNamesInput = document.querySelector('input[name="image_names"]');
        if (!imageNamesInput) {
            imageNamesInput = document.createElement('input');
            imageNamesInput.type = 'hidden';
            imageNamesInput.name = 'image_names';
            document.getElementById('editMenuForm').appendChild(imageNamesInput);
        }
    
        imageNamesInput.value = names.join(',');
    }// ========== CATEGORY & OPTIONS LOGIC ==========
const menuCategoryDropdown = document.getElementById('editMenuCategory');
const menuOptionsGroup = document.getElementById('editMenuOptionsGroup');
const menuOptionCheckboxes = document.getElementById('editMenuOptionCheckboxes');
const editMenuModal = document.getElementById('editMenuModal');
const closeModal = document.querySelector('.close2');
const menuTable = document.querySelector('table tbody');
const updateMenuButton = document.getElementById('updateMenuButton');

// The new hidden input to store checked options
const optionsInput = document.getElementById('editOptionsInput'); // Make sure this exists in your HTML

const selectedOptionsPerCategory = {};
let firstCheckedOptionPerCategory = {};

// Load categories into dropdown
function loadCategories(selectedCategory = '') {
    fetch('/admin/categories/dropdown')
        .then(res => res.json())
        .then(data => {
            menuCategoryDropdown.innerHTML = '<option value="">Select Category</option>';
            data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.categoryname;
                option.textContent = category.categoryname;
                if (category.categoryname.toLowerCase() === selectedCategory.toLowerCase()) {
                    option.selected = true;
                }
                menuCategoryDropdown.appendChild(option);
            });
        })
        .catch(err => console.error("Error loading categories:", err));
}

// Function to handle loading the category options and binding the selected options
function fetchCategoryOptions(category, preSelectedOptions = []) {
    fetch(`/admin/category/${category}`)
        .then(res => res.json())
        .then(data => {
            menuOptionCheckboxes.innerHTML = '';  // Reset the checkbox container
            const selected = selectedOptionsPerCategory[category] || preSelectedOptions;

            if (data.options) {
                const options = data.options.split(',').map(opt => opt.trim());
                if (!firstCheckedOptionPerCategory[category] && selected.length > 0) {
                    firstCheckedOptionPerCategory[category] = selected[0];
                }

                // Create checkboxes for each option
                options.forEach(opt => {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = opt;  // Option name (for storing in database)
                    checkbox.id = `editOption-${opt}`;

                    if (selected.includes(opt)) checkbox.checked = true;

                    checkbox.addEventListener('change', function () {
                        // Update the selected options for the category
                        if (!selectedOptionsPerCategory[category]) {
                            selectedOptionsPerCategory[category] = [];
                        }

                        if (this.checked) {
                            if (!selectedOptionsPerCategory[category].includes(opt)) {
                                selectedOptionsPerCategory[category].push(opt);
                            }
                        } else {
                            selectedOptionsPerCategory[category] =
                                selectedOptionsPerCategory[category].filter(o => o !== opt);
                        }

                        // Update the hidden input field with selected options
                        updateSelectedOptionsInput();
                    });

                    const label = document.createElement('label');
                    label.htmlFor = `editOption-${opt}`;
                    label.textContent = opt;

                    const wrapper = document.createElement('div');
                    wrapper.appendChild(checkbox);
                    wrapper.appendChild(label);
                    menuOptionCheckboxes.appendChild(wrapper);
                });

                menuOptionsGroup.style.display = 'block';
            } else {
                menuOptionsGroup.style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Error loading category options:', err);
            menuOptionsGroup.style.display = 'none';
        });
}

// Function to update the hidden input field with selected options
function updateSelectedOptionsInput() {
    const selectedOptions = [];
    const checkboxes = menuOptionCheckboxes.querySelectorAll('input[type="checkbox"]:checked'); // Get checked checkboxes
    checkboxes.forEach(cb => selectedOptions.push(cb.value));  // Collect the value (option name) of checked checkboxes

    // Update the hidden input field with the selected options as a comma-separated string
    optionsInput.value = selectedOptions.join(',');
}

// Ensure the selected options are updated when the form is submitted
document.getElementById('editMenuForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form submission to manually update options and submit the form

    updateSelectedOptionsInput();  // Ensure options are saved in the hidden input before form submission
    
    // Now submit the form manually using JavaScript
    this.submit();  // Submit the form
});

// Handle category change
menuCategoryDropdown.addEventListener('change', function () {
    const previousCategory = this.getAttribute('data-prev');
    if (previousCategory) {
        const checkboxes = menuOptionCheckboxes.querySelectorAll('input[type="checkbox"]');
        selectedOptionsPerCategory[previousCategory] = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }

    const selectedCategory = this.value;
    this.setAttribute('data-prev', selectedCategory);
    fetchCategoryOptions(selectedCategory);
});


// Edit menu row click
menuTable.addEventListener('click', async function (event) {
    if (event.target.classList.contains('edit-btn')) {
        const row = event.target.closest('tr');

        const id = row.dataset.id;
        const name = row.dataset.name;
        const description = row.dataset.description;
        const price = row.dataset.price;
        const category = row.dataset.category;
        const option = row.dataset.option;
        const images = row.dataset.images;

        document.getElementById("editMenuImage").setAttribute("webkitdirectory", true);
        document.getElementById("editMenuId").value = id;
        document.getElementById("editMenuName").value = name;
        document.getElementById("editDescription").value = description;
        document.getElementById("editPrice").value = price;

        const selectedOptions = option ? option.split(',') : [];
        selectedOptionsPerCategory[category] = selectedOptions;
        firstCheckedOptionPerCategory[category] = selectedOptions[0] || null;

        await loadCategories(category);
        menuCategoryDropdown.setAttribute('data-prev', category);
        fetchCategoryOptions(category, selectedOptions);

        previewContainer.innerHTML = "";
        editImageFileNames.clear();

        const imageArray = images ? images.split(',') : [];
        if (imageArray.length === 0 || (imageArray.length === 1 && imageArray[0] === '')) {
            previewContainer.innerHTML = '<p id="editPlaceholderText" class="placeholder-text">No images available</p>';
        } else {
            imageArray.forEach(image => {
                const previewDiv = document.createElement("div");
                previewDiv.classList.add("image-preview");

                const img = document.createElement("img");
                img.src = `/storage/${image.startsWith('menu_images/') ? image : 'menu_images/' + image}`;
                img.setAttribute("data-filename", image);

                const label = document.createElement("span");
                label.classList.add("file-name");
                label.textContent = image.split('/').pop();

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "×";
                removeBtn.classList.add("remove-btn");
                removeBtn.addEventListener("click", () => {
                    previewDiv.remove();
                    togglePlaceholder();
                    updateImageNamesInput();
                });

                previewDiv.appendChild(img);
                previewDiv.appendChild(label);
                previewDiv.appendChild(removeBtn);
                previewContainer.appendChild(previewDiv);
            });
        }

        updateImageNamesInput();
        togglePlaceholder();
        editMenuModal.style.display = "block";
    }
});

closeModal.addEventListener('click', function () {
    editMenuModal.style.display = 'none';
});

// Update options when submitting or closing
updateMenuButton.addEventListener('click', function () {
    firstCheckedOptionPerCategory = {};
});
}); 
