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
	<link rel="stylesheet" href="{{ asset('css/admin/venue.css') }}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

	<title>Admin Venue</title>
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
			<li>
				<a href="event">
					<i class='bx bxs-calendar-star'></i>
					<span class="text">Event</span>
				</a>
			</li>
			<li class="active">
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
                        <li><a href="#" class="dropdown-option"><i class='bx bxs-log-out'></i> Log Out</a></li>
                    </ul>
                </div>
			</div>
		</nav>
		<!-- NAVBAR -->

		<div class="main-content">
			<div class="venue-nav">
				<div>
					<h1>Venues</h1>
					<p>Manage and organize venue listings for Dande’s Resto.</p>
				</div>
				<div class="venue-actions">
					<div class="search-container">
						<input type="text" class="venue-search" placeholder="Search...">
						<button class="venue-search-btn"><i class="bx bx-search"></i></button>
					</div>
					<div>
						<button id="addVenueBtn" class="plusbtn new-menu-btn">
							<i class='bx bx-plus'></i>
							Add Venue
						</button>
					</div>
				</div>
			</div>
		
			<div class="venue-items-group">
				<div class="venuetable">
					<h4 class="venue-title">Venue List</h4>
					<div class="venuetable-icons">
						<div class="icon" id="edit-btn" onclick="toggleCheckboxes()"><i class="bx bx-edit"></i></div>
						<div class="icon hidden" id="delete-btn" onclick="deleteSelectedItems()"><i class="bx bx-trash"></i></div>
						<select id="venueFilter" onchange="filterVenues()">
							<option value="all">All</option>
							<option value="ground-floor">Ground Floor</option>
							<option value="first-floor">First Floor</option>
							<option value="rooftop">Rooftop</option>
						</select>
					</div>
				</div>
				<div class="card-venuetable">
					<table class="venue-table">
						<thead>
							<tr>
								<th class="checkbox-column hidden"><input type="checkbox" id="select-all"></th>
								<th>Venue ID</th>
								<th>Image</th>
								<th>Name</th>
								<th>Location</th>
								<th>Floor Level</th>
                                <th>Specify Location</th>
								<th>Capacity</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody id="venueTableBody">
                        @php use Illuminate\Support\Str; @endphp
            @foreach ($venues as $venue)
                @php
                    $firstImage = explode(',', $venue->image)[0] ?? '';
                    $imagePath = Str::startsWith($firstImage, 'venue_images/') ? $firstImage : 'venue_images/' . $firstImage;
                @endphp
                <tr data-id="{{ $venue->id }}"
                    data-name="{{ $venue->name }}"
                    data-location="{{ $venue->location }}"
                    data-capacity="{{ $venue->capacity }}"
                    data-specifylocation="{{ $venue->specifylocation }}"
                    data-image="{{ $venue->image }}">
                    <td class="checkbox-column hidden">
                        <input type="checkbox" class="item-checkbox">
                    </td>
                    <td>{{ str_pad($loop->iteration, 3, '0', STR_PAD_LEFT) }}</td>
                    <td>
                        @if ($venue->image)
                            <img src="{{ asset('storage/' . $imagePath) }}" alt="Menu Image"
                                 style="width: 60px; height: 60px; object-fit: cover;">
                        @else
                            <p style="width: 60px; height: 60px; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">
                                No Image
                            </p>
                        @endif
                    </td>
                    <td>{{ $venue->name }}</td> 
                    <td>{{ $venue->location }}</td> 
                    <td>{{ $venue->floorlevel }}</td> 
                    <td>{{ $venue->specifylocation }}</td> 
                    <td>{{ $venue->capacity }}</td> 
                    <td>
                        <button class="edit-btn bx bx-edit"></button>
						<button class="delete-btn bx bx-trash"></button>
						</td>
                </tr>
            @endforeach
					</table>
				</div>
				
			</div>
		</div>
		
	</section>
	
	<div id="venueModal" class="modal">
		<div class="modal-content">
			<div class="modal-nav">
				<span class="close">&times;</span>
				<h2>NEW VENUE</h2>
			</div>
			<div class="modal-body">
				<div class="form-left">
                <form id="venueForm" enctype="multipart/form-data">
                @csrf
						<div class="form-group">
							<label for="venueName">Venue Name:</label>
							<input type="text" id="venueName" required>
						</div>
						<div class="form-group">
							<label for="venueLocation">Location:</label>
							<select id="venueLocation" required>
								<option value="">Select Location</option>
								<option value="Dande's Resto">Dande's Resto</option>
								<option value="Other">Other</option>
							</select>
						</div>
						<div class="form-group" id="venueFloorGroup">
							<label for="venueFloor">Floor Levels:</label>
							<input type="text" id="venueFloorInput" placeholder="Add Floor Level">
							<div id="floorList" class="floor-list"></div>
							<input type="hidden" id="floorsField" name="floors">
						</div>
						<div class="form-group" id="venueOtherGroup" style="display: none;">
							<label for="venueOther">Specify Location:</label>
							<input type="text" id="venueOther" placeholder="Enter Venue Location">
						</div>
						<div class="form-group">
							<label for="venueCapacity">Capacity:</label>
							<input type="number" id="venueCapacity" required min="1">
						</div>
					</form>
				</div>
				<div class="form-right">
					<div class="form-group-image" id="dropArea">
						<label for="venueImage">Drag & Drop Images Here</label>
						<input type="file" id="venueImage" accept="image/*" multiple style="display: none;">
						<p>image files & folders</p>
					</div>
					<div id="clearAllBtn" class="clear-icon-container">
						<i class="clear-icon fas fa-times"></i>
						<span class="clear-text">Clear</span>
					</div>
					<div id="venueImagePreviewContainer">
						<p id="placeholderText" class="placeholder-text">Images will be shown here</p>
					</div>
				</div>
			</div>
			<button type="submit" id="saveVenueBtn">
				<i class="bx bx-plus"></i>
				Add Venue
			</button>
		</div>
	</div>
	<div id="notification" style="display: none; position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); font-size: 16px; z-index: 9999;">
    <span id="notification-message"></span>
</div>
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="{{ asset('js/admin/venue.js') }}"></script>
</body>
</html>