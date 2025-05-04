<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">	<!-- Boxicons -->
	<link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
	
    <!-- My CSS -->
	<link rel="icon" href="{{ asset('images/admin/dandeslogo-round.png') }}" type="image/jpg">
	<link rel="stylesheet" href="{{ asset('css/admin/promo.css') }}">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

	<title>Admin Promo</title>
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
			<li>
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
			<li >
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
			<li class="active">
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
                        <img src="{{ asset('images/admin/accImage2.jpg') }}"alt="Profile Picture" class="profile-img">
                        <div class="profile-info">
                            <span class="profile-name">Admin Name</span>
                            <span class="profile-email">admin@example.com</span>
                        </div>
                    </div>
                    <ul class="profile-options">
                        <li><a href="#" id="viewProfile" onclick="toggleProfile()" class="dropdown-option"><i class='bx bxs-user'></i> View Profile</a></li>
                        <li><a href="#" class="dropdown-option"><i class='bx bxs-cog'></i> Settings</a></li>
                        <li><a href="#" class="dropdown-option"><i class='bx bxs-log-out'></i> Log Out</a></li>
                    </ul>
                </div>
			</div>
		</nav>
		<!-- NAVBAR -->

        <div class="main-content">
			<div class="promo-nav">
				<div>
					<h1>Promotions</h1>
					<p>Manage and organize promotions for Dande’s Resto.</p>
				</div>
				<div class="promo-actions">
					<div class="search-container">
						<input type="text" class="promo-search" placeholder="Search...">
						<button class="promo-search-btn"><i class="bx bx-search"></i></button>
					</div>
					<div>
						<button id="addPromoBtn" class="plusbtn new-menu-btn">
							<i class='bx bx-plus'></i>
							Add Promo
						</button>
					</div>
				</div>
			</div>
		
			<div class="promo-items-group">
				<div class="promotable">
					<h4 class="promo-title">Promo List</h4>
					<div class="promotable-icons">
						<div class="icon" id="edit-btn" onclick="toggleCheckboxes()"><i class="bx bx-edit"></i></div>
						<div class="icon hidden" id="delete-btn" onclick="deleteSelectedItems()"><i class="bx bx-trash"></i></div>
						<select id="promoFilter" onchange="filterPromos()">
                <option value="all">All</option>
                @foreach($venues as $venue)
                    <option value="{{ $venue->name }}">{{ $venue->name }}</option>
                @endforeach
            </select>    
					</div>
				</div>
			
				<div class="card-promotable">
					<div class="table-container">
						<table class="promo-table">
							<thead>
								<tr>
									<th class="checkbox-column hidden"><input type="checkbox" id="select-all"></th>
									<th>Promo ID</th>
									<th>Image</th>
									<th>Name</th>
									<th>Description</th>
									<th>Menu List</th>
									<th>Venue</th>
									<th>Price</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody id="promoTableBody">
							@php use Illuminate\Support\Str; @endphp
				@foreach ($promos as $promo)
					@php
						$firstImage = explode(',', $promo->image)[0] ?? '';
						$imagePath = Str::startsWith($firstImage, 'promo_images/') ? $firstImage : 'promo_images/' . $firstImage;
					@endphp
					<tr data-id="{{ $promo->id }}"
						data-name="{{ $promo->name }}"
						data-description="{{ $promo->description }}"
						data-menulist="{{ $promo->menulist }}"
						data-venue="{{ $promo->venue }}"
						 data-price="{{ $promo->price }}"
						data-image="{{ $promo->image }}">
						<td class="checkbox-column hidden">
							<input type="checkbox" class="item-checkbox">
						</td>
						<td>{{ str_pad($loop->iteration, 3, '0', STR_PAD_LEFT) }}</td>
						<td>
							@if ($promo->image)
								<img src="{{ asset('storage/' . $imagePath) }}" alt="Promo Image"
									 style="width: 60px; height: 60px; object-fit: cover;">
							@else
								<p style="width: 60px; height: 60px; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">
									No Image
								</p>
							@endif
						</td>
						<td>{{ $promo->name }}</td> 
						<td>{{ $promo->description }}</td> 
						<td>{{ $promo->menulist }}</td> 
						<td>{{ $promo->venue }}</td> 
						<td>{{ $promo->price }}</td> 
						<td>
							<button class="edit-btn bx bx-edit"></button>
							<button class="delete-btn bx bx-trash"></button>
							</td>
					</tr>
				@endforeach
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		<!-- Profile Container -->
		<div class="profile-container" id="profileContainer">
			<button class="close-btn" onclick="toggleProfile()">×</button>
			
			<div class="profile-image">
				<img src="img/accImage2.jpg" alt="Profile" class="profile-img">
				<div class="edit-icon" onclick="editProfileImage()">
					<i class="bx bx-edit-alt"></i> 
				</div>
			</div>
			
			<div class="account-details">
				<h3>John Doe</h3>
				<!-- <div class="hover-line"></div> -->
				<p><strong>Name:</strong> John Doe</p>
				<p><strong>Email:</strong> johndoe@example.com</p>
				<p><strong>Phone:</strong> +1234567890</p>
				<p><strong>Password:</strong> *********</p>
				<button class="edit-profile-btn">Edit Profile</button>
			</div>
		</div>
		
	</section>
	
	<form id="promoForm" action="{{ route('admin.promo.store') }}" method="POST" enctype="multipart/form-data">    @csrf
    <div id="promoModal" class="modal">
        <div class="modal-content">
            <div class="modal-nav">
                <h2>NEW PROMO</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div class="form-left">
                    <div class="form-group">
                        <label for="promoName">Promo Name:</label>
                        <input type="text" id="promoName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="promoDescription">Description:</label>
                        <textarea id="promoDescription" name="description" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="menuSelect">Menu Items:</label>
                        <select id="menuSelect">
                            <option value="">Select Menu Item</option>
                            @foreach($menus as $menu)
                                <option value="{{ $menu->name }}">{{ $menu->name }}</option>
                            @endforeach
                        </select>
                        <div id="menuList" class="menu-list"></div>
                        <input type="hidden" id="menuField" name="menulist">
                    </div>

                    <div class="form-group">
                        <label for="venueSelect">Venue:</label>
                        <select id="venueSelect" name="venue" required>
                            <option value="Venue">Select Venue</option>
                            @foreach($venues as $venue)
                                <option value="{{ $venue->name }}">{{ $venue->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="promoPrice">Price:</label>
						<input type="text" 
       id="promoPrice" 
       name="price" 
       required 
       inputmode="decimal"
       placeholder="0.00"
       pattern="^\d*\.?\d{0,2}$">
                    </div>
                </div>
                <div class="form-right">
                    <div class="form-group-image" id="promoDropArea">
                        <label for="promoImage">Drag & Drop Images Here</label>
                        <input type="file" 
                            id="promoImage" 
                            name="images[]" 
                            accept="image/*" 
                            multiple
                            style="display: none;">
                    </div>
                    <div id="promoClearAllBtn" class="clear-icon-container">
                        <i class="clear-icon fas fa-times"></i>
                        <span class="clear-text">Clear</span>
                    </div>
                    <div id="promoImagePreviewContainer">
                        <p id="promoPlaceholderText" class="placeholder-text">Images will be shown here</p>
                    </div>
                </div>
            </div>
            <button type="submit" id="savePromoBtn">
                <i class="bx bx-plus"></i>
                Add Promo
            </button>
        </div>
    </div>
</form>

<!-- Edit Promo Modal -->
<form id="editPromoForm" method="POST" enctype="multipart/form-data">
    @csrf
    <input type="hidden" name="original_name" id="originalName">
	
    <div id="editPromoModal" class="modal edit-modal">
        <div class="modal-content edit-modal-content">
            <div class="modal-nav edit-modal-nav">
                <h2>EDIT PROMO</h2>
                <span class="close-edit">&times;</span>
            </div>
            <div class="modal-body edit-modal-body">
                <div class="form-left edit-form-left">
                    <input type="hidden" id="editPromoId" name="id">
                    <div class="form-group edit-form-group">
                        <label for="editPromoName">Promo Name:</label>
                        <input type="text" id="editPromoName" name="name" class="edit-input" required>
                    </div>
                    <div class="form-group edit-form-group">
                        <label for="editPromoDescription">Description:</label>
                        <textarea id="editPromoDescription" name="description" class="edit-textarea" required></textarea>
                    </div>
                    <div class="form-group edit-form-group">
                        <label for="editMenuSelect">Menu Items:</label>
                        <select id="editMenuSelect" class="edit-select">
                            <option value="">Select Menu Item</option>
                            @foreach($menus as $menu)
                                <option value="{{ $menu->name }}">{{ $menu->name }}</option>
                            @endforeach
                        </select>
                        <div id="editMenuList" class="menu-list edit-menu-list"></div>
                        <input type="hidden" id="editMenuField" name="menulist">
                    </div>

                    <div class="form-group edit-form-group">
                        <label for="editVenueSelect">Venue:</label>
                        <select id="editVenueSelect" name="venue" class="edit-select" required>
                            <option value="">Select Venue</option>
                            @foreach($venues as $venue)
                                <option value="{{ $venue->name }}">{{ $venue->name }}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="form-group edit-form-group">
                        <label for="editPromoPrice">Price:</label>
                        <input type="text" 
                            id="editPromoPrice" 
                            name="price" 
                            class="edit-input"
                            required 
                            inputmode="decimal"
                            placeholder="0.00"
                            pattern="^\d*\.?\d{0,2}$">
                    </div>
                </div>
                <div class="form-right edit-form-right">
                    <div class="form-group-image edit-form-group-image" id="editPromoDropArea">
                        <label for="editPromoImage">Drag & Drop Images Here</label>
                        <input type="file" 
                            id="editPromoImage" 
                            name="images[]" 
                            accept="image/*" 
                            multiple
                            class="edit-file-input"
                            style="display: none;">
                    </div>
					
                    <div id="editPromoClearAllBtn" class="clear-icon-container edit-clear-container">
                        <i class="clear-icon fas fa-times"></i>
                        <span class="clear-text">Clear</span>
                    </div>
                    <div id="editPromoImagePreviewContainer" class="edit-preview-container">
                        <p id="editPromoPlaceholderText" class="placeholder-text edit-placeholder">Current images will be shown here</p>
                    </div>
                    <input type="hidden" id="retained_images" name="retained_images">
                </div>
            </div>
            <button type="submit" id="updatePromoBtn" class="edit-submit-btn">
                <i class="bx bx-save"></i>
                Update Promo
            </button>
        </div>
    </div>
</form>
<div id="notification" style="display: none; position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); font-size: 16px; z-index: 99999;">
    <span id="notification-message"></span>
</div>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>   
 <script src="{{ asset('js/admin/promo.js') }}"></script>
</body>
</html>