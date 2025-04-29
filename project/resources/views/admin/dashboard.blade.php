<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">

	<!-- Boxicons -->
	<link href='https://unpkg.com/boxicons@2.0.9/css/boxicons.min.css' rel='stylesheet'>
	
    <!-- My CSS -->
	<link rel="icon" href="{{ asset('images/admin/dandeslogo-round.png') }}" type="image/jpg">
	<link rel="stylesheet" href="{{ asset('css/admin/dashboard.css') }}">

	<title>Admin Dashboard</title>
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
			<li class="active">
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
			<li >
				<a href="message" >
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
				<a href="#" class="nav-profile" onclick="toggleProfileDropdown()">
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
						<li><a href="#" id="viewProfile" onclick="toggleProfile()"><i class='bx bxs-user'></i> View Profile</a></li>
                        <li><a href="#" id="viewSettings" onclick="toggleSettings()"><i class='bx bxs-cog'></i> Settings</a></li>
                        <li id="logout-btn"><a href="#" ><i class='bx bxs-log-out'></i> Log Out</a></li>
                    </ul>
                </div>
			</div>
		</nav>
		<div id="logout-modal" class="modal">
    <div class="modal-content">
      <p>Do you want to log out?</p>
      <div class="modal-buttons">
        <button class="btn-yes" id="confirm-logout">Yes</button>
        <button class="btn-no" id="cancel-logout">No</button>
      </div>
    </div>
  </div>
		<!-- NAVBAR -->

		<div class="main-content">

			<div class="dashboard-container">
				<div class="dashboard-header">
					<div class="dash-header-info">
						<div class="header-text">
							<h1>Dashboard</h1>
							<p>Hi, Admin. Welcome back to Admin Dashboard!</p>
						</div>
					</div>
				
					<!-- <div class="search-container">
						<input type="text" class="dash-search" placeholder="Search...">
						<button class="dash-search-btn"><i class="bx bx-search"></i></button>
					</div> -->
					

					<!-- <div class="filter-box" onclick="toggleDropdown()">
						<span class="filter-icon"><i class='bx bx-calendar'></i></span>
							<div class="filter-text">
								<strong>Filter Period</strong>
								<p>17 April 2020 - 21 May 2020</p>
							</div>
							<i class='bx bx-chevron-down chevron-icon'></i> 
	
							<div class="filter-dropdown">
								<p>Last 7 Days</p>
								<p>Last 30 Days</p>
								<p>Custom Range</p>
							</div>
					</div> -->
				</div>
			
			
				<div class="dashboard-cards">
					<div class="card">
						<img src="https://cdn-icons-png.flaticon.com/128/900/900864.png" alt="Menu">
						<div>
							<h2>{{ $totalMenus }}</h2>
							<p>Total Menu</p>
							<!-- <span class="stat positive">4% (30 days)</span> -->
						</div>
					</div>
					<div class="card">
						<img src="https://cdn-icons-png.flaticon.com/128/10691/10691802.png" alt="Events">
						<div>
							<h2>{{ $totalEvents }}</h2>
							<p>Total Events</p>
							<!-- <span class="stat positive">4% (30 days)</span> -->
						</div>
					</div>
					<div class="card">
						<img src="https://cdn-icons-png.flaticon.com/128/17096/17096217.png" alt="Venue">
						<div>
							<h2>0</h2>
							<p>Total Venue </p>
							<!-- <span class="stat negative">25% (30 days)</span> -->
						</div>
					</div>
					<div class="card">
						<img src="https://cdn-icons-png.flaticon.com/128/3258/3258504.png" alt="Cancellation">
						<div>
							<h2>0</h2>
							<p>Total Promo</p>
							<!-- <span class="stat negative">25% (30 days)</span> -->
						</div>
					</div>
					<div class="card">
						<img src="https://cdn-icons-png.flaticon.com/128/166/166260.png" alt="Customer">
						<div>
							<h2>0</h2>
							<p>Total Customer</p>
							<!-- <span class="stat negative">12% (30 days)</span>						 -->
						</div>
					</div>
				</div>
			</div>
			<div class="dashboard-main"> <div class="categoryAndMenu">
			{{-- Category Section --}}
    <div class="category-card">
        <div class="menu-categories">
            <h4 class="category-title">Categories</h4>
            <div class="category-nav">
                <p class="view-p">View All</p>
                <i class='chevronC bx bx-chevron-right'></i>
            </div>
        </div>

        <div class="categories-wrapper">
            <div class="categories-container">
                {{-- All Category --}}
                <div class="category active">
                    <img src="{{ asset('images/admin/dandeslogo-round.png') }}" alt="CategoryImage">
                    <div class="category-info">
                        <h4>ALL</h4>
                        <p>40 Items</p>
                    </div>
                </div>

                {{-- Dynamic Categories --}}
                @foreach ($categories as $category)
                    <div class="category">
                        @if ($category->image)
                            <img src="{{ asset('storage/' . $category->image) }}" alt="Category Image">
                        @else
                            <p style="width: 100%; height: 100%; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">
                                No Available Image
                            </p>
                        @endif
                        <div class="category-info">
                            <h4>{{ strtoupper($category->categoryname) }}</h4>
                            <p>{{ strtoupper($category->total) }} Items</p>
                        </div>
                    </div>
                @endforeach
            </div>
            <button class="chevron-right">&#10095;</button>
        </div>
    </div>

    {{-- Menu Items Section --}}
    <div class="menu-card">
        <div class="menu">
            <h4 class="menu-title">Menu Items</h4>
            <div class="menu-nav">
                <p class="view-p">View All</p>
                <i class='chevronMenu bx bx-chevron-right'></i>
            </div>
        </div>

        <div class="menu-scroll-wrapper">
            <ul class="menu-list">
                @php use Illuminate\Support\Str; @endphp
                @foreach ($menus as $menu)
                    @php
                        $firstImage = explode(',', $menu->image)[0] ?? '';
                        $imagePath = Str::startsWith($firstImage, 'menu_images/') ? $firstImage : 'menu_images/' . $firstImage;
                    @endphp
                    <li class="menu-item">
                        @if ($menu->image)
                            <img src="{{ asset('storage/' . $imagePath) }}" alt="Menu Image">
                        @else
                            <p style="width: 100%; height: 100%; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">
                                No Available Image
                            </p>
                        @endif
                        <div class="menu-info">
                            <div class="menu-info-header">
                                <h3>{{ strtoupper($menu->name) }}</h3>
                            </div>
                            <p>{{ strtoupper($menu->description) }}</p>
                            <span class="price">₱{{ number_format($menu->price, 2) }}</span>
                        </div>
                    </li>
                @endforeach
            </ul>
        </div>
    </div>
					<div class="venue">
					
						<div class="dash-venue-card">
							<div class="venue-nav">
								<h4 class="venue-title">Available Venues</h4>
								<div class="venue">
									<p class="view-p">view all</p>
									<i class='chevronV bx bx-chevron-right'></i>
								</div>
							</div>
							
							<div class="venue-grid">
								<div class="venue-card">
									<img src="{{ asset('images/admin/venue-example-1.jpg') }}" alt="Venue Image">
									<div class="venue-details">
										<h3>Grand Hall</h3>
										<p>A spacious venue with state-of-the-art facilities for concerts and events.</p>
									</div>
								</div>
								<div class="venue-card">
									<img src="{{ asset('images/admin/venue-ex-2.jpg') }}" alt="Venue Image">
									<div class="venue-details">
										<h3>Sunset Arena</h3>
										<p>An open-air venue with a breathtaking view, perfect for outdoor gatherings.</p>
									</div>
								</div>
								<div class="venue-card">
									<img src="{{ asset('images/admin/venue-ex-3.jpg') }}" alt="Venue Image">
									<div class="venue-details">
										<h3>Sunset Arena</h3>
										<p>An open-air venue with a breathtaking view, perfect for outdoor gatherings.</p>
									</div>
								</div>
								<div class="venue-card">
									<img src="{{ asset('images/admin/venue-ex-4.jpg') }}" alt="Venue Image">
									<div class="venue-details">
										<h3>Sunset Arena</h3>
										<p>An open-air venue with a breathtaking view, perfect for outdoor gatherings.</p>
									</div>
								</div>
								<div class="venue-card">
									<img src="{{ asset('images/admin/venue-ex-5.jpg') }}" alt="Venue Image">
									<div class="venue-details">
										<h3>Sunset Arena</h3>
										<p>An open-air venue with a breathtaking view, perfect for outdoor gatherings.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
			

	
	</section>
	<!-- CONTENT -->
	<div id="profileModal" class="modal hidden">
	<div class="profile-content">
			<div class="content">
				<div class="details-header">
					<div>
						<h3>Profile</h3>
					</div>
					<div class="close-icon">
						<i class='bx bx-x'></i>
					</div>
				</div>
				

				<div class="accountAndDetails">
					<div class="account-container">
						<div class="account-content">
							<div class="profile-image-container">
								<img src="img/accImage2.jpg" alt="Profile Image" class="profile-image">
								<button class="edit-image-btn">
									<i class="bx bx-edit"></i> <!-- FontAwesome Edit Icon -->
								</button>
							</div>
							<div class="account-info">
								<h2 class="account-name">Admin Name</h2>
								<p class="account-email">admin@example.com</p>
								<p class="account-role">Administrator</p>
							</div>
						</div>
							
						<!-- Action Buttons -->
						<div class="top-buttons">
							<button class="edit-profile-btn">Edit Profile</button>
						</div>
					</div>

					<div class="details-container">
						<!-- Details Section -->
						<div class="details">
							<div class="detail-row">
								<label for="name" class="name">Name</label>
								<div class="input-group">
									<input type="text" id="name" value="Admin Name" class="readonly-input" readonly>
									<div class="error-message"></div>
								</div>
							</div>
						
							<div class="detail-row">
								<label for="email" class="email">Email</label>
								<div class="input-group">
									<input type="email" id="email" value="admin@example.com" class="readonly-input" readonly>
									<div class="error-message"></div>
								</div>
							</div>
						
							<div class="detail-row">
								<label for="mobile" class="number">Mobile Number</label>
								<div class="input-group">
									<input type="text" id="mobile" value="+63 912 345 6789" class="readonly-input" readonly>
									<div class="error-message"></div>
								</div>
							</div>
						
							<div class="detail-row">
								<label for="password" class="password">Password</label>
								<div class="input-group">
									<input type="password" id="password" value="••••••••" class="readonly-input" readonly>
									<div class="error-message"></div>
								</div>
							</div>
						
							<div class="detail-row confirm-password-row hidden">
								<label for="confirm-password" class="confirm">Confirm Password:</label>
								<div class="input-group">
									<input type="password" id="confirm-password" class="readonly-input" readonly>
									<div class="error-message"></div>
								</div>
							</div>
						</div>
						
					</div>
				</div>
			</div>
		</div>
	</div>

	<div id="settingsModal" class="settingsmodal settingshidden">
	<div class="settings-content">
		<div class="settings-container">
			<div class="settings-header">
				<div>
					<h3>Settings</h3>
				</div>
				<div class="settings-close-icon">
					<i class='bx bx-x'></i>
				</div>
			   
			</div>
			
			<!-- Website Name and Logo -->
			<div class="settings-form">
				<div class="logo-container">
					<div class="logo-content">
						<div class="image-container">
							<img src="img/Dande's_Resto_Lgo.jpeg" alt="Logo Image" class="logo-image">
							<button class="edit-image-btn">
								<i class="bx bx-edit"></i> <!-- FontAwesome Edit Icon -->
							</button>
						</div>
						<div class="logo-info">
							<h2 class="logo-name">Dande's Resto and Catering Services</h2>
							<p class="logo-location">Purok 2A North Poblacion, Medina, Philippines, 9000</p> 
						</div>
					</div>
						
					<!-- Action Buttons -->
					<div class="top-buttons">
						<button class="change-setting-btn">Change Settings</button>
					</div>
				</div>
				<div class="form-row">
					<label for="website-name" class="website-name">Website Name</label>
					<div class="form-input">
						<input type="text" id="website-name" value="Restaurant Name" class="input-field">
						<div class="error"></div>
					</div>
				</div>
				<div class="form-row">
					<label for="logo-upload" class="logo">Logo</label>
					<div class="form-input">
						<input type="file" id="logo-upload" accept="image/*" class="input-field">
						<div class="error"></div>
					</div>
				</div>
				<div class="form-row">
					<label for="restaurant-location" class="location">Restaurant Location</label>
					<div class="form-input">
						<input type="text" id="restaurant-location" value="123 Restaurant St, City" class="input-field">
						<div class="error"></div>
					</div>
				</div>
				<div class="form-row">
					<label for="operating-hours" class="hours">Operating Hours</label>
					<div class="form-input">
						<input type="text" id="operating-hours" value="Mon-Sun: 10:00 AM - 10:00 PM" class="input-field">
						<div class="error"></div>
					</div>
				</div>

			</div>
			 
			
		</div>
	</div>
	</div>
	<script>
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
	</script>
	<script src="{{ asset('js/admin/dashboard.js') }}"></script>
</body>
</html>