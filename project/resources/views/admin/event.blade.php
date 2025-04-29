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
	<link rel="stylesheet" href="{{ asset('css/admin/event.css') }}">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">

	<title>Admin Event</title>
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
			<li class="active">
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
				<a href="promo		">
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
			<div class="event-nav">
				<div>
					<h1>Event</h1>
					<p>Manage and organize events for Dande’s Resto.</p>
				</div>
				<div class="event-actions">
					<div class="search-container">
                    <input type="text" id="eventSearch" class="event-search" placeholder="Search...">
						<button class="event-search-btn"><i class="bx bx-search"></i></button>
					</div>
				<div>
                        <button id="addEventBtn"  class="plusbtn new-menu-btn">
                            <i class='bx bx-star'></i>
                            Create Event
                        </button>
				  </div>
				</div>
			</div>
<section>
            <div class="event-items-group">
    <div class="eventtable">
        <h4 class="event-title">Event List</h4>
        <div class="eventtable-icons">
            <div class="icon" id="edit-btn" onclick="toggleCheckboxes()"><i class="bx bx-edit"></i></div>
            <div class="icon hidden" id="delete-btn" onclick="deleteSelectedItems()"><i class="bx bx-trash"></i></div>
            <select id="eventFilter" onchange="filterEvents()">
                <option value="All">All</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Past">Past</option>
                <option value="Today">Today</option>
            </select>
        </div>
    </div>

    <div class="card-eventtable">
        <table class="event-table">
            <thead>
                <tr>
                    <th class="checkbox-column hidden"><input type="checkbox" id="select-all"></th>
                    <th>EventID</th>
                    <th>Image</th>
                    <th>Video</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Venue</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="eventTableBody">
                @php use Illuminate\Support\Str; @endphp
                @foreach ($events as $event)
                    @php
                        $firstImage = explode(',', $event->image)[0] ?? '';
                        $imagePath = Str::startsWith($firstImage, 'event_images/') ? $firstImage : 'event_images/' . $firstImage;
                        $firstVideo = explode(',', $event->video)[0] ?? '';
                        $videoPath = Str::startsWith($firstVideo, 'event_videos/') ? $firstVideo : 'event_videos/' . $firstVideo;
                        $imageExists = !empty($firstImage) && file_exists(public_path('storage/' . $imagePath));
                        $videoExists = !empty($firstVideo) && file_exists(public_path('storage/' . $videoPath));
                    @endphp
                    <tr 
                        data-id="{{ $event->id }}"
                        data-name="{{ $event->name }}"
                        data-description="{{ $event->description }}"
                        data-date="{{ $event->date }}"
                        data-time="{{ $event->time }}"
                        data-images="{{ $event->image }}"
                        data-videos="{{ $event->video }}"
                        data-venue="{{ $event->venue }}"
                        data-filter="{{ $event->Filter }}"  
                    >
                        <td class="checkbox-column hidden">
                            <input type="checkbox" class="item-checkbox">
                        </td>
                        <td>{{ str_pad($loop->iteration, 3, '0', STR_PAD_LEFT) }}</td>

                        {{-- Image Cell --}}
                        <td>
                            <div class="event-image" style="width: 60px; height: 60px;">
                                @if ($imageExists)
                                    <img src="{{ asset('storage/' . $imagePath) }}" alt="Event Image"
                                         style="width: 100%; height: 100%; object-fit: cover;">
                                @else
                                    <div style="width: 100%; height: 100%; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">
                                        No Available Image
                                    </div>
                                @endif
                            </div>
                        </td>

                        {{-- Video Cell --}}
                        <td>
                            <div class="event-image" style="width: 60px; height: 60px; position: relative;">
                                @if ($videoExists)
                                    <video 
                                        style="width: 100%; height: 100%; object-fit: cover; cursor: pointer;"
                                        muted 
                                        playsinline
                                        onmouseover="this.play()" 
                                        onmouseout="this.pause(); this.currentTime = 0;"
                                        ondblclick="toggleFullscreen(this)"
                                        controlslist="nodownload nofullscreen noremoteplayback"
                                        disablepictureinpicture>
                                        <source src="{{ asset('storage/' . $videoPath) }}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                @else
                                    <div style="width: 100%; height: 100%; font-size: 12px; color: #999; display: flex; align-items: center; justify-content: center; text-align: center;">
                                        No Available Video
                                    </div>
                                @endif
                            </div>
                        </td>

                        {{-- Event Info --}}
                        <td>{{ $event->name }}</td>
                        <td>{{ $event->description }}</td>
                        <td>{{ $event->date }}</td>
                        <td>{{ $event->time }}</td>
                        <td>{{ $event->venue }}</td>
                        <td>{{ $event->Filter }}</td>
                        {{-- Action Buttons --}}
                        <td>
                            <button class="edit-btn bx bx-edit"></button>
                            <button class="delete-btn bx bx-trash" onclick="deleteEvent({{ $event->id }})"></button>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</section>
    
 <form id="eventForm" action="{{ route('admin.event.save') }}" method="POST" enctype="multipart/form-data">
    @csrf
    <!-- Add this hidden input right after the form opening tag -->
    <input type="hidden" id="eventId" name="event_id" value="">

    <div id="eventModal" class="modal" lang="en">
        <div class="modal-content">
            <div class="modal-nav">
            <h2>NEW EVENT</h2>
                <span class="close">&times;</span>       
            </div>

            <div class="modal-body">@if (session('status'))
            <div id="notification" style="position: fixed; top: 1rem; right: 1rem; background-color: #38a169; color: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.2); z-index: 9999;">
            @foreach (session('status') as $message)
            <p>{{ $message }}</p>
        @endforeach
    </div>

    <script>
        // Auto-hide the notification after 4 seconds
        setTimeout(() => {
            const notif = document.getElementById('notification');
            if (notif) {
                notif.style.transition = 'opacity 0.5s ease';
                notif.style.opacity = '0';
                setTimeout(() => notif.remove(), 500); // Remove after fade out
            }
        }, 4000);
    </script>
@endif

                <div class="form-left">
                    <div class="form-group">
                        <label for="eventName">Event Name:</label>
                        <input type="text" id="eventName" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="eventDescription">Description:</label>
                        <textarea id="eventDescription" name="description" required></textarea>
                    </div>
                    <div class="form-group date-time-group">
                        <div>
                            <label for="eventDate">Date:</label>
                            <input type="date" id="eventDate" name="date" required>
                        </div>
                        <div>
                            <label for="eventTime">Time:</label>
                            <input type="time" id="eventTime" name="time" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="selectVenue">Select Venue:</label>
                        <select id="selectVenue" name="selectedvenue" class="form-control" required>
                            <option value="">Select Venue</option>
                            <option value="Dande's Resto">Dande's Resto</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div class="form-group" id="venueGroup" style="display: none;">
                        <input type="hidden" id="finalVenue" name="venueSelect">
                        <label for="eventVenue">Floor Level:</label>
                        <select id="eventVenue" name="venueFloor">
                            <option value="Main Hall">Main Hall</option>
                            <option value="VIP Room">VIP Room</option>
                            <option value="Rooftop">Rooftop</option>
                        </select>
                    </div>

                    <div class="form-group" id="otherLocationGroup" style="display: none;">
                        <label for="otherLocation">Specify Venue:</label>
                        <input type="text" id="otherLocation" name="otherVenue">
                    </div>
                </div>

                <div class="form-right">
                    <label for="eventImage">Upload Images or Videos:</label>
                    <div id="dropArea" style="border: 2px dashed #aaa; padding: 20px; text-align: center; cursor: default;">
                        Drag & Drop files here
                    </div>

                    <input type="file" id="eventImage" name="eventMedia[]" accept="image/*,video/*" multiple style="display: none;">
                    <input type="file" name="media[]" id="eventMedia" multiple hidden>

                    <!-- Previews -->
                    <div id="eventImagePreviewContainer">
                        <div id="editClearImageBtn" class="clear-icon-container">
                            <i class="clear-icon fas fa-times"></i>
                            <span class="clear-text">Clear</span>
                        </div>
                        <div id="imagePreviewContainer">
                            <div id="imagePreview" class="grid-preview">
                                <p id="imagePlaceholderText" class="placeholder-text">No images available</p>
                            </div>
                        </div>

                        <div id="editClearVideoBtn" class="clear-icon-container">
                            <i class="clear-icon fas fa-times"></i>
                            <span class="clear-text">Clear</span>
                        </div>
                        <div id="videoPreviewContainer">
                            <div id="videoPreview" class="grid-preview">
                                <p id="videoPlaceholderText" class="placeholder-text">No videos available</p>
                            </div>
                        </div>
                    </div>
 <!-- Progress + Stop/Cancel icons, all in one row -->
<div id="uploadProgressContainer" style="display:none; margin-top:1rem;">
  <!-- Button row: Stop + Cancel + Text -->
  <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
    <div id="uploadProgressText" style="display:flex; align-items:center; font-weight:500;">
      Uploading… <span id="uploadPercent">0%</span>
    </div>
    <!-- Stop + Cancel Buttons aligned to the right -->
    <div style="display:flex; align-items:center; gap:4px; justify-content:flex-end; width:100%;">
      <div id="uploadPauseBtn" class="clear-icon-container"
           title="Stop upload"
           style="display:flex; align-items:center; cursor:pointer; background:#f8d7da; padding:4px 8px; border-radius:4px;">
        <i class="clear-icon fas fa-pause" style="margin-right:4px;"></i>
        <span class="clear-text">Pause</span>
      </div>
      <div id="uploadCancelBtn" class="clear-icon-container"
           title="Cancel upload"
           style="display:flex; align-items:center; cursor:pointer; background:#f8d7da; padding:4px 8px; border-radius:4px;">
        <i class="clear-icon fas fa-times" style="margin-right:4px;"></i>
        <span class="clear-text">Cancel</span>
      </div>
    </div>
  </div>

<!-- Progress bar -->
<div id="uploadProgressWrapper"
     style="position:relative; width:100%; height:20px; background:#e0e0e0; border-radius:4px; overflow:hidden; margin-top:8px;">
  <div id="uploadProgressBar"
       style="width:0%; height:100%; background:red; transition: width 0.2s ease, background-color 0.2s ease;"></div>
</div>

</div>

      <button type="submit" id="saveEventBtn">
                        <i class='bx bx-star'></i>
                        Create Event
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>

<form id="editEventForm" action="{{ route('admin.event.update') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @method('PUT')

    <div id="editEventModal" class="modal" lang="en">
        <div class="modal-content">
            <div class="modal-nav2">
                <h2>EDIT EVENT</h2>
                <span class="close2">&times;</span>       
            </div>

            <div class="modal-body">
                @if (session('status'))
                    <div id="notification" style="position: fixed; top: 1rem; right: 1rem; background-color: #38a169; color: white; padding: 1rem; border-radius: 0.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.2); z-index: 9999;">
                        @foreach (session('status') as $message)
                            <p>{{ $message }}</p>
                        @endforeach
                    </div>

                    <script>
                        setTimeout(() => {
                            const notif = document.getElementById('notification');
                            if (notif) {
                                notif.style.transition = 'opacity 0.5s ease';
                                notif.style.opacity = '0';
                                setTimeout(() => notif.remove(), 500);
                            }
                        }, 4000);
                    </script>
                @endif

                <div class="form-left">
                    <div class="form-group">
                        <label for="eventName">Event Name:</label>
                        <input type="text" id="eventName" name="name" value="" readonly style="color: red">
                    </div>
                    <div class="form-group">
                        <label for="eventDescription">Description:</label>
                        <textarea id="eventDescription" name="description" required></textarea>
                    </div>
                    <div class="form-group date-time-group">
                        <div>
                            <label for="eventDate">Date:</label>
                            <input type="date" id="eventDate" name="date" value="" required>
                        </div>
                        <div>
                            <label for="eventTime">Time:</label>
                            <input type="time" id="eventTime" name="time" value="" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="selectVenue">Select Venue:</label>
                        <select id="selectVenue" name="selectedvenue" class="form-control" required>
                            <option value="">Select Venue</option>
                            <option value="Dande's Resto">Dande's Resto</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div class="form-group" id="venueGroup" style="display: none;">
                        <input type="hidden" id="finalVenue" name="venueSelect">
                        <label for="eventVenue">Floor Level:</label>
                        <select id="eventVenue" name="venueFloor">
                            <option value="Main Hall">Main Hall</option>
                            <option value="VIP Room">VIP Room</option>
                            <option value="Rooftop">Rooftop</option>
                        </select>
                    </div>

                    <div class="form-group" id="otherLocationGroup" style="display: none;">
                        <label for="otherLocation">Specify Venue:</label>
                        <input type="text" id="otherLocation" name="otherVenue" value="">
                    </div>
                </div>

                <div class="form-right">
                    <label for="eventImage">Upload Images or Videos:</label>
                    <div id="dropArea" style="border: 2px dashed #aaa; padding: 20px; text-align: center; cursor: default;">
                        Drag & Drop files here
                    </div>

                    <input type="file" id="eventImage" name="eventMedia[]" accept="image/*,video/*" multiple style="display: none;">
                    <input type="file" name="media[]" id="eventMedia" multiple hidden>
                    
                    <div id="eventImagePreviewContainer">
                        <div id="editClearImageBtn" class="clear-icon-container">
                            <i class="clear-icon fas fa-times"></i>
                            <span class="clear-text">Clear</span>
                        </div>
                        <div id="imagePreviewContainer">
                            <div id="imagePreview" class="grid-preview">
                                <p id="imagePlaceholderText2" class="placeholder-text">No images available</p>
                            </div>
                        </div>

                        <div id="editClearVideoBtn" class="clear-icon-container">
                            <i class="clear-icon fas fa-times"></i>
                            <span class="clear-text">Clear</span>
                        </div>
                        <div id="videoPreviewContainer">
                            <div id="videoPreview" class="grid-preview">
                                <p id="videoPlaceholderText2" class="placeholder-text">No videos available</p>
                            </div>
                        </div>
                    </div>

                    <div id="uploadProgressContainer" style="display:none; margin-top:1rem;">
                        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                            <div id="uploadProgressText" style="display:flex; align-items:center; font-weight:500;">
                                Uploading… <span id="uploadPercent">0%</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:4px; justify-content:flex-end; width:100%;">
                                <div id="uploadPauseBtn" class="clear-icon-container" title="Stop upload"
                                     style="display:flex; align-items:center; cursor:pointer; background:#f8d7da; padding:4px 8px; border-radius:4px;">
                                    <i class="clear-icon fas fa-pause" style="margin-right:4px;"></i>
                                    <span class="clear-text">Pause</span>
                                </div>
                                <div id="uploadCancelBtn" class="clear-icon-container" title="Cancel upload"
                                     style="display:flex; align-items:center; cursor:pointer; background:#f8d7da; padding:4px 8px; border-radius:4px;">
                                    <i class="clear-icon fas fa-times" style="margin-right:4px;"></i>
                                    <span class="clear-text">Cancel</span>
                                </div>
                            </div>
                        </div>

                        <div id="uploadProgressWrapper" style="position:relative; width:100%; height:20px; background:#e0e0e0; border-radius:4px; overflow:hidden; margin-top:8px;">
                            <div id="uploadProgressBar" style="width:0%; height:100%; background:red; transition: width 0.2s ease, background-color 0.2s ease;"></div>
                        </div>
                    </div>

                    <div id="uploadProgressContainer2" style="display:none; margin-top:1rem;">
                        <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
                            <div id="uploadProgressText2" style="display:flex; align-items:center; font-weight:500;">
                                Uploading… <span id="uploadPercent2">0%</span>
                            </div>
                            <div style="display:flex; align-items:center; gap:4px; justify-content:flex-end; width:100%;">
                                <div id="uploadPauseBtn2" class="clear-icon-container" title="Stop upload"
                                     style="display:flex; align-items:center; cursor:pointer; background:#f8d7da; padding:4px 8px; border-radius:4px;">
                                    <i class="clear-icon fas fa-pause" style="margin-right:4px;"></i>
                                    <span class="clear-text">Pause</span>
                                </div>
                                <div id="uploadCancelBtn2" class="clear-icon-container" title="Cancel upload"
                                     style="display:flex; align-items:center; cursor:pointer; background:#f8d7da; padding:4px 8px; border-radius:4px;">
                                    <i class="clear-icon fas fa-times" style="margin-right:4px;"></i>
                                    <span class="clear-text">Cancel</span>
                                </div>
                            </div>
                        </div>

                        <div id="uploadProgressWrapper2" style="position:relative; width:100%; height:20px; background:#e0e0e0; border-radius:4px; overflow:hidden; margin-top:8px;">
                            <div id="uploadProgressBar2" style="width:0%; height:100%; background:red; transition: width 0.2s ease, background-color 0.2s ease;"></div>
                        </div>
                    </div>

                    <button type="submit" id="updateEventBtn">
                        <i class='bx bx-pencil'></i>
                        Update Event
                    </button>
                </div>
            </div>
        </div>
    </div>
</form>

<div id="notification" style="display: none; position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background-color: #28a745; color: white; padding: 10px 20px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); font-size: 16px; z-index: 9999;">
    <span id="notification-message"></span>
</div>

@if(session('error') || session('success'))
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const notification = document.getElementById('notification');
            const messageElement = document.getElementById('notification-message');
            
            const message = "{{ session('error') ?? session('success') }}";
            messageElement.textContent = message;
            notification.style.display = 'block';

            if ("{{ session('error') }}") {
                notification.style.backgroundColor = '#dc3545'; // Red for error
            } else {
                notification.style.backgroundColor = '#28a745'; // Green for success
            }

            setTimeout(function() {
                notification.style.display = 'none';
            }, 5000); // Hide after 5 seconds
        });
    </script>
@endif
<script>
    function toggleFullscreen(video) {
        if (!document.fullscreenElement) {
            video.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
// Function to delete a single event
function deleteEvent(eventId) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This event will be deleted permanently!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Call the delete function if confirmed
            deleteEvents([eventId]);
        }
    });
}

// Function to delete selected events
function deleteSelectedItems() {
    const selectedEventIds = [...document.querySelectorAll('.item-checkbox:checked')].map(checkbox => checkbox.closest('tr').dataset.id);
    if (selectedEventIds.length === 0) {
        Swal.fire('No events selected', 'Please select at least one event to delete.', 'info');
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: 'These events will be deleted permanently!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete selected!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Call the delete function if confirmed
            deleteEvents(selectedEventIds);
        }
    });
}

// Function to delete events via an AJAX request
function deleteEvents(eventIds) {
    Swal.fire({
        title: 'Deleting...',
        text: 'Your request is being processed.',
        icon: 'info',
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });

    fetch('{{ route('admin.event.delete') }}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: JSON.stringify({ eventIds })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove deleted events from the DOM
            eventIds.forEach(id => {
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) row.remove();
            });
            
            Swal.fire('Deleted!', 'Event(s) deleted successfully.', 'success');
        } else {
            Swal.fire('Error!', 'There was an issue deleting the event(s).', 'error');
        }
    })
    .catch(error => {
        console.error('Error deleting events:', error);
        Swal.fire('Error!', 'Something went wrong.', 'error');
    });
}

flatpickr("#eventTime", {
    enableTime: true,
    noCalendar: true,
    dateFormat: "h:i K", // shows AM/PM
    time_24hr: false
});

function filterEvents() {
    var filterValue = document.getElementById("eventFilter").value;
    var rows = document.querySelectorAll("table tbody tr"); // Get all table rows

    rows.forEach(function(row) {
        var rowFilter = row.getAttribute("data-filter"); // Get the filter status of the row

        // Show or hide rows based on filter value
        if (filterValue === "All" || rowFilter === filterValue) {
            row.style.display = ""; // Show row
        } else {
            row.style.display = "none"; // Hide row
        }
    });
}
document.getElementById('eventSearch').addEventListener('input', function () {
    const searchTerm = this.value.trim(); // retain exact input
    const rows = document.querySelectorAll('#eventTableBody tr');

    rows.forEach(row => {
        const rowText = row.textContent; // don't convert to lowercase
        row.style.display = rowText.includes(searchTerm) ? '' : 'none';
    });
});
</script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
	<script src="{{ asset('js/admin/event.js') }}"></script>
</body>
</html>