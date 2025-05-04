<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<!-- Boxicons -->
	<link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
	
    <!-- My CSS -->
	<link rel="icon" href="{{ asset('images/admin/dandeslogo-round.png') }}" type="image/jpg">
	<link rel="stylesheet" href="{{ asset('css/admin/menu.css') }}">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

	<title>Admin Menu</title>
</head>

<body>	
	<!-- SIDEBAR -->
	<section id="sidebar">
		<button class="close-btn" id="closeSidebarBtn">
            <i class='bx bx-x'></i>
        </button>
		<a href="#" class="brand">
			<img src="{{ asset('images/admin/dandesfinal.jpg') }}" alt="Logo" class="brand-image">
			<!-- <img src="img/logoText.png" alt="Logo" class="brand-image2"> -->
			<span class="textD">DANDE'S RESTO</span>
			<p>AND CATERING SERVICES</p>
		</a>
		<ul class="side-menu top">
			<li >
				<a href="dashboard">
					<i class='bx bxs-home' ></i>
					<span class="text">Dashboard</span>
				</a>
			</li>
			<li class="active">
				<a href="menu">
					<i class='bx bxs-food-menu' ></i>
					<span class="text">Menu</span>
				</a>
			</li>
			<li>
				<a href="message">
					<i class='bx bxs-message-detail'></i>
					<span class="text">Message</span>
				</a>
			</li>
			<li>
				<a href="event">
					<i class='bx bxs-calendar-star'></i>
					<span class="text">Event</span>
				</a>
			</li>
			<li>
				<a href="venue">
					<i class='bx bxs-map' ></i>
					<span class="text">Venue</span>
				</a>
			</li>
			<li>
				<a href="promo">
					<i class='bx bxs-discount'></i>
					<span class="text">Promo</span>
				</a>
			</li>
		</ul>
	</section>
	<!-- SIDEBAR -->



	<!-- CONTENT -->
	<section id="content">
		<!-- NAVBAR -->
		<nav>
			<i class='bx bx-menu'></i>
		
			<div class="nav-right-container">
				<a href="#" class="nav-welcome">Welcome, <span class="admin">Admin!</span></a>
				<a href="#" class="notification">
					<i class='bx bx-bell'></i>
					<span class="num">8</span>
				</a>
				<a href="#" class="nav-profile" onclick="toggleDropdown()">
                    <img src="{{ asset('images/admin/accImage2.jpg') }}" alt="Profile Picture">
                </a>

				<div class="dropdown-menu" id="profileDropdown">
                    <div class="profile-header">
                        <img src="{{ asset('images/admin/accImage2.jpg') }}" alt="Profile Picture" class="profile-img">
                        <div class="profile-info">
                            <span class="profile-name">Admin Name</span>
                            <span class="profile-email">admin@example.com</span>
                        </div>
                    </div>
                    <ul class="profile-options">
                        <li><a href="#" id="viewProfile" onclick="toggleProfile()" class="dropdown-option"><i class='bx bxs-user'></i> View Profile</a></li>
                        <li><a href="#" class="dropdown-option"><i class='bx bxs-cog'></i> Settings</a></li>
                        <li id="logout-btn"><a href="#" class="dropdown-option"><i class='bx bxs-log-out'></i> Log Out</a></li>
                    </ul>
                </div>
			</div>
         <div id="logout-modal" class="modal2">
    <div class="modal-content2">
      <p>Do you want to log out?</p>
      <div class="modal-buttons2">
        <button class="btn-yes" id="confirm-logout">Yes</button>
        <button class="btn-no" id="cancel-logout">No</button>
      </div>
    </div>
  </div>
		</nav>
		<!-- NAVBAR -->
		<!-- Main Content -->
		<div class="main-content">
			<div class="menu-nav">
				<div>
					<h1>Food Menu</h1>
					<p>Manage and organize the restaurant’s menu.</p>
				</div>
				<div class="menu-actions">
					<div class="search-container">
						<input type="text" class="category-search" placeholder="Search...">
						<button class="category-search-btn"><i class="bx bx-search"></i></button>
					</div>
				<div>
					<button id="addMenuBtn"  class="plusbtn new-menu-btn">
						<i class="bx bx-plus"></i>
						Add Menu
					</button>
		
				  </div>
				</div>
			</div>
			@if(session('success'))
    <script>
        window.onload = function() {
            showToast('success', '{{ session('success') }}');
        };
    </script>
@endif

@if(session('error'))
    <script>
        window.onload = function() {
            showToast('error', '{{ session('error') }}');
        };
    </script>
@endif

<div class="content-container">
    <div class="category-group">
        <div class="menu-categories">
            <h4 class="menu-title">Categories</h4>
            <div class="category-actions">
                <button id="addCategoryBtn" class="action-btn"><i class='bx bx-plus'></i></button>
                <button id="editCategoryBtn" class="action-btn"><i class='bx bx-edit'></i></button>
                <button class="action-btn"><i class='bx bx-trash'></i></button>
            </div>
        </div>
        <div class="categories-wrapper">
            <div class="categories-container">
                <!-- Default Active Category -->
                <div class="category active">
                    <img src="{{ asset('images/admin/dandeslogo-round.png') }}" alt="CategoryImage">
                    <div class="category-info">
                        <h4>ALL</h4>
                        <p>40 Items</p>
                    </div>
                </div>
                @foreach ($categories as $category)
                    <div class="category">
                    @if ($category->image)
        <img src="{{ asset('storage/' . $category->image) }}" alt="Category Image">
    @else
        <p style="width: 100%; height: 100%; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">No Available Image</p>
    @endif
					
                        <div class="category-info">
                            <h4>{{ strtoupper($category->categoryname) }}</h4>
                            <p>{{ strtoupper($category->total) }} Items</p> <!-- Update this if you have item counts -->
                        </div>
                    </div>
                @endforeach

            <button class="chevron-right">&#10095;</button> 
        </div>
    </div>
</div>
<section class="menu-items-group"  id="menuItemsGroup"> <div class="menutable"> <h4 class="menu-title">Menu Items</h4> <div class="menutable-icons"> <div class="icon" id="edit-btn" onclick="toggleCheckboxes()"> <i class="bx bx-edit"></i> </div> <div class="icon hidden" id="delete-btn" onclick="deleteSelectedItems()"> <i class="bx bx-trash"></i> </div> <div class="filter-btn"> <span>Filter Options</span> <i class="bx bx-chevron-down"></i> </div> </div> </div>
<div  class="card-menutable">
    <table class="menu-table">
        <thead>
            <tr>
                <th class="checkbox-column hidden"><input type="checkbox" id="select-all"></th>
                <th>MenuID</th>
                <th>Image</th>
                <th>Name</th>
                <th>Description</th>
                <th>Category</th>
                <th>Options</th>
                <th>Price</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @php use Illuminate\Support\Str; @endphp
            @foreach ($menus as $menu)
                @php
                    $firstImage = explode(',', $menu->image)[0] ?? '';
                    $imagePath = Str::startsWith($firstImage, 'menu_images/') ? $firstImage : 'menu_images/' . $firstImage;
                @endphp
                <tr data-id="{{ $menu->id }}"
                    data-category="{{ strtoupper($menu->category) }}"
                    data-name="{{ $menu->name }}"
                    data-description="{{ $menu->description }}"
                    data-price="{{ $menu->price }}"
                    data-option="{{ $menu->option }}"
                    data-images="{{ $menu->image }}">
                    <td class="checkbox-column hidden">
                        <input type="checkbox" class="item-checkbox">
                    </td>
                    <td>{{ str_pad($loop->iteration, 3, '0', STR_PAD_LEFT) }}</td>
                    <td>
                        @if ($menu->image)
                            <img src="{{ asset('storage/' . $imagePath) }}" alt="Menu Image"
                                 style="width: 60px; height: 60px; object-fit: cover;">
                        @else
                            <p style="width: 60px; height: 60px; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">
                                No Image
                            </p>
                        @endif
                    </td>
                    <td>{{ $menu->name }}</td>
                    <td>{{ $menu->description }}</td>
                    <td>{{ $menu->category }}</td>
                    <td>{{ $menu->option }}</td>
                    <td>₱{{ number_format($menu->price, 2) }}</td>
                    <td>
                        <button class="edit-btn bx bx-edit"></button>
                        <button class="delete-btn bx bx-trash"></button>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
</section>

	<!-- CONTENT -->
    <!-- Notification container -->
<div id="notification" style="display: none; position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); font-size: 16px; z-index: 9999;">
    <span id="notification-message"></span>
</div>

@if(session('error') || session('success'))
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Check if we're on the admin/menu page
            if (window.location.pathname === '/admin/menu') {
                const notification = document.getElementById('notification');
                const messageElement = document.getElementById('notification-message');
                
                // Get success or error messages
                const message = "{{ session('error') ?? session('success') }}";
                
                // Set the notification message and style
                messageElement.textContent = message;
                notification.style.display = 'block';

                // Change color based on success or error
                if ("{{ session('error') }}") {
                    notification.style.backgroundColor = '#dc3545';  // Red for error
                } else {
                    notification.style.backgroundColor = '#28a745';  // Green for success
                }

                // Hide notification after 5 seconds
                setTimeout(function() {
                    notification.style.display = 'none';
                }, 5000);
            }
        });
    </script>
@endif

	<form id="menuForm" action="{{ route('admin.saveMenu') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <div id="menuModal" class="modal">
        <div class="modal-content">
            <div class="modal-nav">
                <span class="close">&times;</span>
                <h2>NEW MENU ITEM</h2>
            </div>
            <div class="modal-body">
                <div class="form-left">
                    <div class="form-group">
                        <label for="menuName">Name:</label>
                        <input type="text" id="menuName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="description">Description:</label>
                        <textarea id="description" name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="price">Price:</label>
                        <input type="number" id="price" name="price" required min="1">
                    </div>
                    <div class="form-group">
                        <label for="menuCategory">Category:</label>
                        <select id="menuCategory" name="category" required>
                            <option value="">Select Category</option>
                        </select>
                    </div>
                    <div class="form-group" id="menuOptionsGroup" style="display: none;">
                        <label>Option:</label>
                        <div id="menuOptionCheckboxes"></div>
                    </div>
                </div>
					<div class="form-right">
						<div class="form-group-image" id="dropArea">
							<label for="menuImage">Drag & Drop Images Here</label>
							<input type="file" id="menuImage" name="image[]" accept="image/*" multiple style="display: none;">
							<p>image files & folders</p>
						</div>
						<div id="clearAllBtn" class="clear-icon-container">
							<i class="clear-icon fas fa-times"></i>
							<span class="clear-text">Clear</span>
						</div>
						<div id="imagePreviewContainer">
							<p id="placeholderText" class="placeholder-text">Images will be shown here</p>
						</div>
                    <button type="submit" id="submitBtn">
                        <i class="bx bx-plus"></i> Add Menu
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>
<form id="editMenuForm" action="{{ route('admin.menu.update') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="hidden" id="editMenuId" name="id">
    <input type="hidden" id="selectedOptions" name="option"> <!-- Hidden input for selected options -->

    <div id="editMenuModal" class="modal">
        <div class="modal-content">
            <div class="modal-nav">
                <span class="close2">&times;</span>
                <h2>EDIT MENU ITEM</h2>
            </div>
            <div class="modal-body">
                <div class="form-left">
                    <div class="form-group">
                        <label for="editMenuName">Name:</label>
                        <input type="text" id="editMenuName" name="name" readonly style="color:red">
                    </div>
                    <div class="form-group">
                        <label for="editDescription">Description:</label>
                        <textarea id="editDescription" name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="editPrice">Price:</label>
                        <input type="number" id="editPrice" name="price" required min="1">
                    </div>
                    <div class="form-group">
                        <label for="editMenuCategory">Category:</label>
                        <select id="editMenuCategory" name="category" required>
                            <option value="">Select Category</option>
                            <!-- Categories will be populated dynamically here -->
                        </select>
                    </div>
                    
                    <div class="form-group" id="editMenuOptionsGroup" style="display: none;">
                        <label>Options:</label>
                        <input type="hidden" id="editOptionsInput" name="option" value="">
                        <div id="editMenuOptionCheckboxes"></div>
                    </div>
                </div>

                <div class="form-right">
                    <div class="form-group-image" id="editDropArea">
                        <label for="editMenuImage">Drag & Drop Images Here</label>
                        <input type="file" id="editMenuImage" name="image[]" accept="image/*" multiple style="display: none;">
                        <p>Image files only</p>
                    </div>

                    <div id="editClearAllBtn" class="clear-icon-container">
                        <i class="clear-icon fas fa-times"></i>
                        <span class="clear-text">Clear</span>
                    </div>
                    
                    <div id="editImagePreviewContainer">
                        <p id="editPlaceholderText" class="placeholder-text">No images available</p>
                    </div>

                    <button type="submit" id="editSubmitBtn">
                        <i class="bx bx-save"></i> Update Menu
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>

    <form action="{{ route('admin.saveCategory') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <div id="addCategoryModal" class="add-category-modal">
        <div class="add-category-modal-content">
            <div class="add-category-modal-header">
                <h2>ADD CATEGORY</h2>
                <span class="add-category-close">&times;</span>
            </div>

            <div class="add-category-form">
                <div class="form-left">
                    <div class="form-group-name">
                        <label for="categoryName">Category Name:</label>
                        <input type="text" id="categoryName" name="categoryName" required placeholder="Category Name">
                    </div>

                    <div class="form-group-option">
                        <label>Options:</label>
                        <input type="text" id="addOptionInput" placeholder="Add Option">
                        <div id="optionsList" class="options-list"></div> <!-- Options appear here -->
                        <!-- Hidden input to store the options as a comma-separated string -->
                        <input type="hidden" id="optionsField" name="options">
                    </div>
                </div>

                <div class="form-right">
    <div class="form-group-image">
        <label for="addCategoryImage">Upload Image:</label>
        <input type="file" id="addCategoryImage" name="image" accept="image/*" required>
        <!-- Filename display (readonly input) -->
        <input type="text" id="addImageFilenameDisplay" readonly placeholder="No file selected">
        
        <div id="add-category-image-preview" class="image-preview">
            
            <img id="categoryPreviewImg">
        </div>
    </div>
</div>

            </div>

            <button type="submit" id="saveCategoryBtn">Save Category</button>
        </div>
    </div>
</form>

<form id="editCategoryForm" enctype="multipart/form-data" method="POST" action="{{ route('category.update') }}">
    @csrf
    <div id="editCategoryModal" class="edit-category-modal">
        <div class="edit-category-modal-content">
            <div class="edit-category-modal-header">
                <h2>EDIT CATEGORY</h2>
                <span class="edit-category-close">&times;</span>
            </div>

            <div class="edit-category-form">
                <div class="form-left">
                    <div class="form-group-name">
                        <label for="editCategoryName">Category Name:</label>
                        <select id="editCategoryName" name="categoryName" required>
                            <option value="">Select Category</option>
                            <input type="hidden" name="originalCategoryName" id="originalCategoryName">
                            <!-- Categories will be added dynamically -->
                        </select>
                    </div>

                    <div class="form-group-option">
                        <label>Options:</label>
                        <input type="text" id="editOptionInput" placeholder="Add Option">
                        <div id="editOptionsList" class="options-list"></div>
                        <input type="hidden" id="editOptionsField" name="options">
                    </div>
                </div>

                <div class="form-right">
                    <div class="form-group-image">
                        <label for="editCategoryImage">Upload Image:</label>
                        <input type="file" id="editCategoryImage" name="image" accept="image/*">
                        <input type="hidden" id="editImageFilename" name="image_filename">
                        <input type="text" id="imageFilenameDisplay" name="image_filename_display" readonly>
                        <div id="edit-category-image-preview" class="image-preview">
                            
                            <img id="editCategoryPreviewImg">
                        </div>
                    </div>
                </div>
            </div>

            <button type="submit" id="updateCategoryBtn">Update Category</button>
        </div>
    </div>
</form>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

	<script src="{{ asset('js/admin/menu.js') }}"></script>
</body>
</html>