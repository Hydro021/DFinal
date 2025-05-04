<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Models\Category;
use Illuminate\Support\Str;
use Carbon\Carbon;


class AdminDash extends Controller
{
    public function saveCategory(Request $request)
{
    $validated = $request->validate([
        'categoryName' => 'required|string|max:255',
        'options' => 'nullable|string',
        'image' => 'nullable|image', // Accept any valid image format
    ], [
        'categoryName.required' => 'Please enter the category name.',
        'options.nullable' => 'Options are optional.',
        'image.image' => 'The uploaded file must be an image.',
    ]);

    $categoryName = $request->categoryName;
    $options = !empty($request->options) ? $request->options : "";

    // Check if the category already exists
    $existingCategory = DB::table('category')->where('categoryname', $categoryName)->exists();

    if ($existingCategory) {
        return redirect()->back()->with('error', 'The category name already exists. Please choose a different name.');
    }

    $imagePath = null;
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $newFileName = time() . '.' . $image->getClientOriginalExtension(); // Retain the original file extension
        $image->storeAs('category_images', $newFileName, 'public'); // Store in 'public' disk
        $imagePath = 'category_images/' . $newFileName;
    }

    // Insert category into database
    DB::table('category')->insert([
        'categoryname' => $categoryName,
        'options' => $options,
        'image' => $imagePath,
        'total' => 0, // Set total to 0
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    return redirect()->back()->with('success', 'Category added successfully!');
}

public function allD()
{
    if (!session('admin_logged_in')) {
        return redirect('admin/login')->with('error', 'Please log in first.');
    }

    $categories = DB::table('dandes.category')->get();
    $menus = DB::table('dandes.menu')->get();
    $event = DB::table('dandes.events')->get();

    $totalMenus = $menus->count();
    $totalEvents = $event->count();

    return view('admin.dashboard', compact('categories', 'menus', 'event','totalMenus','totalEvents'));
}

public function allM()
{
    if (!session('admin_logged_in')) {
        return redirect('admin/login')->with('error', 'Please log in first.');
    }

    $categories = DB::table('dandes.category')->get();
    $menus = DB::table('dandes.menu')->get();

    return view('admin.menu', compact('categories', 'menus'));
}
public function allE()
{
    if (!session('admin_logged_in')) {
        return redirect('admin/login')->with('error', 'Please log in first.');
    }

    $events = DB::table('dandes.events')->get();

    return view('admin.event', compact('events'));
}
public function allV()
{
    if (!session('admin_logged_in')) {
        return redirect('admin/login')->with('error', 'Please log in first.');
    }

    $venues = DB::table('dandes.venue')->get();

    return view('admin.venue', compact('venues'));
}

    public function dropdown()
    {
        $categories = DB::table('category')->select('id', 'categoryname')->get();
        return response()->json($categories);
    }
    public function getCategory($name)
    {
        $category = DB::table('category')->where('categoryname', $name)->first();
    
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
    
        return response()->json($category);
    }
    
    public function updateCategory(Request $request)
    {
        $validated = $request->validate([
            'categoryName' => 'required|string|max:255',
            'options' => 'nullable|string',
            'image' => 'nullable|image', // Accept any valid image format
        ]);
        
        $categoryName = $request->categoryName;
        $options = !empty($request->options) ? explode(',', $request->options) : [];  // Convert options to an array
        
        // Find the category
        $category = DB::table('category')->where('categoryname', $categoryName)->first();
    
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found.']);
        }
    
        // Get current options (split them into an array)
        $currentOptions = !empty($category->options) ? explode(',', $category->options) : [];
    
        // Determine the removed options
        $removedOptions = array_diff($currentOptions, $options);
    
        // Handle image update if a new image is provided
        if ($request->hasFile('image')) {
            $imagePath = 'category_images/' . basename($category->image);
    
            // Delete the old image if it exists
            if (Storage::exists($imagePath)) {
                Storage::delete($imagePath);
            }
    
            // Save the new image
            $image = $request->file('image');
            $newFileName = time() . '.' . $image->getClientOriginalExtension(); // Keep the original extension
            $image->storeAs('category_images', $newFileName, 'public'); // Store in the 'public' disk
            $imagePath = 'category_images/' . $newFileName;
        } else {
            // If no new image is provided, keep the old one
            $imagePath = $category->image;
        }
    
        // Update category details
        DB::table('category')->where('categoryname', $categoryName)->update([
            'options' => implode(',', $options), // Store the updated options as a comma-separated string
            'image' => $imagePath,
            'updated_at' => now(),
        ]);
    
        // Update the menu table to remove options from affected menu items
        foreach ($removedOptions as $removedOption) {
            DB::table('menu')
                ->where('category', $categoryName)
                ->where('option', 'like', '%' . $removedOption . '%') // Find menus with the removed option
                ->update([
                    'option' => DB::raw("REPLACE(option, '{$removedOption}', '')") // Remove the option from the menu options
                ]);
        }
    
        return response()->json(['success' => true, 'message' => 'Category updated successfully!']);
    }    
    
    public function deleteCategory(Request $request)
    {
        $request->validate([
            'categoryName' => 'required|string|max:255',
            'imageName' => 'required|string',
        ]);
    
        $categoryName = $request->categoryName;
    
        // Prevent deleting "ALL"
        if (strtoupper($categoryName) === 'ALL') {
            return response()->json(['success' => false, 'message' => "The 'ALL' category cannot be deleted."]);
        }
    
        // Get the category
        $category = DB::table('category')->where('categoryname', $categoryName)->first();
        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found.']);
        }
    
        // Delete category image
        $categoryImagePath = 'category_images/' . $request->imageName;
        if (Storage::disk('public')->exists($categoryImagePath)) {
            Storage::disk('public')->delete($categoryImagePath);
        }
    
        // Get and delete all related menu images
        $menuItems = DB::table('menu')->where('category', $categoryName)->get();
    
        foreach ($menuItems as $item) {
            if (!empty($item->image)) {
                $images = explode(',', $item->image); // Already has full path like 'menu_images/filename.jpg'
    
                foreach ($images as $imgPath) {
                    $imgPath = trim($img);
                    if (Storage::disk('public')->exists($imgPath)) {
                        Storage::disk('public')->delete($imgPath);
                    }
                }
            }
    
            DB::table('menu')->where('id', $item->id)->delete();
        }
    
        // Delete the category itself
        DB::table('category')->where('categoryname', $categoryName)->delete();
    
        return response()->json(['success' => true, 'message' => 'Category and related menu items deleted successfully.']);
    }
    public function saveMenu(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:1',
            'category' => 'required|string',
            'option' => 'nullable|array',
            'image.*' => 'nullable|image',
        ]);
    
        $name = $validated['name'];
        $description = $validated['description'];
        $price = $validated['price'];
        $category = $validated['category'];
        $options = $validated['option'] ?? [];
    
        // Check if a menu with the same name already exists
        $existingMenu = DB::table('menu')->where('name', $name)->first();
        if ($existingMenu) {
            // Only return the error message when you are on the 'admin/menu' page
            return redirect()->route('admin.menu')->with('error', 'Menu item with the same name already exists!');
        }
    
        // Convert options to comma-separated string
        $optionString = implode(',', $options);
    
        $imagePaths = [];
        if ($request->hasFile('image')) {
            foreach ($request->file('image') as $img) {
                if ($img && $img->isValid()) {
                    $filename = time() . '_' . uniqid() . '.' . $img->getClientOriginalExtension();
                    $img->storeAs('menu_images', $filename, 'public');
                    $imagePaths[] = 'menu_images/' . $filename;
                }
            }
        }
    
        $images = count($imagePaths) ? implode(',', $imagePaths) : null;
    
        DB::table('menu')->insert([
            'name' => $name,
            'description' => $description,
            'price' => $price,
            'category' => $category,
            'option' => $optionString,
            'image' => $images,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    
        // Update total in category table
        DB::table('category')
            ->where('categoryname', $category)
            ->increment('total');
    
        return redirect()->route('admin.menu')->with('success', 'Menu item added successfully!');
    }
    
public function deleteMenuItems(Request $request)
{
    $request->validate([
        'menuNames' => 'required|array',
        'menuNames.*' => 'string|max:255',
    ]);

    $menuNames = $request->menuNames;
    $categoryCountMap = []; // Track how many per category

    foreach ($menuNames as $menuName) {
        $menuItem = DB::table('menu')->where('name', $menuName)->first();

        if (!$menuItem) {
            continue;
        }

        // Count how many deleted per category
        $category = $menuItem->category;
        if (!isset($categoryCountMap[$category])) {
            $categoryCountMap[$category] = 0;
        }
        $categoryCountMap[$category] += 1;

        // Delete associated images
        if (!empty($menuItem->image)) {
            $images = explode(',', $menuItem->image);
            foreach ($images as $img) {
                $imgPath = trim($img); // Already includes menu_images/
                if (Storage::disk('public')->exists($imgPath)) {
                    Storage::disk('public')->delete($imgPath);
                }
            }
        }

        // Delete menu item
        DB::table('menu')->where('id', $menuItem->id)->delete();
    }

    // Decrement the total column in the category table
    foreach ($categoryCountMap as $categoryName => $count) {
        DB::table('category')
            ->where('categoryname', $categoryName)
            ->decrement('total', $count);
    }

    return response()->json(['success' => true, 'message' => 'Selected menu items deleted successfully.']);
}

public function updateMenu(Request $request)
{
    // Validate the request
    $validated = $request->validate([
        'id'           => 'required|integer|exists:menu,id',
        'name'         => 'required|string|max:255',
        'description'  => 'required|string',
        'price'        => 'required|numeric|min:1',
        'category'     => 'required|string',
        'option'       => 'nullable|string', // Expecting a comma-separated list of options
        'image.*'      => 'nullable|image',
        'image_names'  => 'nullable|string', // Comma-separated list of filenames shown
    ]);

    // 1) Fetch existing menu record
    $menu = DB::table('menu')->where('id', $validated['id'])->first();
    if (!$menu) {
        return redirect()->route('admin.menu')
                         ->with('error', 'Menu item not found.');
    }

    // 2) What images are currently in DB?
    $existingImages = $menu->image ? explode(',', $menu->image) : [];

    // 3) What does the form say we’re still showing?
    $retained = array_filter(explode(',', $request->input('image_names', '')));

    // 4) Delete only the ones the user actually removed
    $toDelete = array_diff($existingImages, $retained);
    foreach ($toDelete as $path) {
        Storage::disk('public')->delete('menu_images/' . basename($path));
    }

    // 5) Start our final list with what they kept
    $finalImages = $retained;

    // 6) Append any newly uploaded files
    if ($request->hasFile('image')) {
        foreach ($request->file('image') as $img) {
            if ($img->isValid()) {
                $filename = time() . '_' . uniqid() . '.' . $img->getClientOriginalExtension();
                $img->storeAs('menu_images', $filename, 'public');
                $finalImages[] = 'menu_images/' . $filename;
            }
        }
    }

    // 7) Process the options correctly
    // Convert the selected options string to a comma-separated list
    $optionString = $request->input('option', ''); // If no options are selected, it will be an empty string

    // 8) Update category totals if the category has changed
    if ($menu->category !== $validated['category']) {
        // Decrement total from the old category
        DB::table('category')
          ->where('categoryname', $menu->category)
          ->decrement('total');

        // Increment total in the new category
        DB::table('category')
          ->where('categoryname', $validated['category'])
          ->increment('total');
    }

    // 9) Save everything back to the menu table
    DB::table('menu')->where('id', $menu->id)->update([
        'name'        => $validated['name'],
        'description' => $validated['description'],
        'price'       => $validated['price'],
        'category'    => $validated['category'],
        'option'      => $optionString, // Save the comma-separated list of option names
        'image'       => count($finalImages) ? implode(',', $finalImages) : '', // Save images
        'updated_at'  => now(),
    ]);

    return redirect()->route('admin.menu')
                     ->with('success', 'Menu item updated successfully!');
} 
public function store(Request $request)
{
    $request->validate([
        'name'         => 'required|string|max:255',
        'description'  => 'required|string',
        'date'         => 'required|date_format:Y-m-d',
        'time'         => 'required|date_format:H:i',
        'selectedvenue'  => 'required|string',
    ]);

    $existingEvent = DB::table('events')->where('name', $request->name)->first();
    if ($existingEvent) {
        return response()->json(['error' => 'An event with this name already exists.'], 409);
    }

    $convertedTime = Carbon::createFromFormat('H:i', $request->time)->format('h:i A');
    $convertedDate = Carbon::createFromFormat('Y-m-d', $request->date)->format('m/d/Y');

    $images = [];
    $videos = [];

    if ($request->hasFile('eventMedia')) {
        foreach ($request->file('eventMedia') as $file) {
            $ext = $file->getClientOriginalExtension();
            $randomNumber = rand(100000, 999999);

            if (Str::startsWith($file->getMimeType(), 'image/')) {
                $filename = $randomNumber . '.jpg';
                $file->storeAs('event_images', $filename, 'public');
                $images[] = 'event_images/' . $filename;
            } elseif (Str::startsWith($file->getMimeType(), 'video/')) {
                $filename = $randomNumber . '.mp4';
                $file->storeAs('event_videos', $filename, 'public');
                $videos[] = 'event_videos/' . $filename;
            }
        }
    }

    if (empty($images) && empty($videos)) {
        return response()->json(['error' => 'Please upload at least one image or one video.'], 422);
    }
    $venue = $request->input('selectedvenue');

    if ($venue === "Other" && $request->filled('otherVenue')) {
        $venue = $request->otherVenue;
    } elseif ($venue === "Dande's Resto" && $request->filled('venueFloor')) {
        $venue = $request->venueFloor;
    }
    

    $eventDateTime = Carbon::createFromFormat('Y-m-d H:i', $request->date . ' ' . $request->time, 'Asia/Manila');
    $now = Carbon::now('Asia/Manila');

    // Compare date + hour + minute
    $isSameDate = $eventDateTime->toDateString() === $now->toDateString();
    $isSameHour = $eventDateTime->format('H') === $now->format('H');
    $isSameMinute = $eventDateTime->format('i') === $now->format('i');

    if ($isSameDate && $isSameHour && $isSameMinute) {
        $filter = 'Today';
    } elseif ($eventDateTime->greaterThan($now)) {
        $filter = 'Upcoming';
    } else {
        $filter = 'Past';
    }

    DB::table('events')->insert([
        'name'           => $request->name,
        'description'    => $request->description,
        'date'           => $convertedDate,
        'time'           => $convertedTime,
        'venue'          => $venue,
        'selectedvenue'  => $request->selectedvenue,
        'image'          => implode(',', $images),
        'video'          => implode(',', $videos),
        'Filter'         => $filter,
        'created_at'     => now(),
        'updated_at'     => now(),
    ]);

    return response()->json(['success' => 'Event saved successfully!']);
}
public function deleteEvents(Request $request)
{
    // Get the list of event IDs (either one or multiple)
    $eventIds = $request->input('eventIds');
    
    if (!is_array($eventIds)) {
        $eventIds = [$eventIds]; // Handle a single ID passed as a string
    }

    foreach ($eventIds as $id) {
        $event = DB::table('events')->where('id', $id)->first();
        if (!$event) continue;

        // Delete associated images and videos from storage
        if (!empty($event->image)) {
            $images = explode(',', $event->image);
            foreach ($images as $img) {
                $imgPath = trim($img);
                if (Storage::disk('public')->exists($imgPath)) {
                    Storage::disk('public')->delete($imgPath);
                }
            }
        }

        if (!empty($event->video)) {
            $videos = explode(',', $event->video);
            foreach ($videos as $video) {
                $videoPath = trim($video);
                if (Storage::disk('public')->exists($videoPath)) {
                    Storage::disk('public')->delete($videoPath);
                }
            }
        }

        // Delete the event from the database
        DB::table('events')->where('id', $id)->delete();
    }

    return response()->json(['success' => true, 'message' => 'Event(s) deleted successfully.']);
}

public function update(Request $request)
{
    try {
        // Validate request
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i',
            'selectedvenue' => 'required|string',
            'retained_images' => 'nullable|string', // Add this for tracking kept images
            'retained_videos' => 'nullable|string', // Add this for tracking kept videos
        ]);

        $event = DB::table('events')->where('name', $request->name)->first();
        if (!$event) {
            return response()->json(['error' => 'Event not found'], 404);
        }

        // Handle existing media removal
        $existingImages = !empty($event->image) ? explode(',', $event->image) : [];
        $existingVideos = !empty($event->video) ? explode(',', $event->video) : [];
        
        // Get retained files from request
        $retainedImages = !empty($request->retained_images) ? explode(',', $request->retained_images) : [];
        $retainedVideos = !empty($request->retained_videos) ? explode(',', $request->retained_videos) : [];

        // Remove files that were deleted in the UI
        foreach ($existingImages as $img) {
            if (!in_array($img, $retainedImages)) {
                if (Storage::disk('public')->exists($img)) {
                    Storage::disk('public')->delete($img);
                }
            }
        }

        foreach ($existingVideos as $vid) {
            if (!in_array($vid, $retainedVideos)) {
                if (Storage::disk('public')->exists($vid)) {
                    Storage::disk('public')->delete($vid);
                }
            }
        }

        // Handle new uploads
        $newImages = [];
        $newVideos = [];
        if ($request->hasFile('eventMedia')) {
            foreach ($request->file('eventMedia') as $file) {
                $randomNumber = rand(100000, 999999);
                if (Str::startsWith($file->getMimeType(), 'image/')) {
                    $filename = $randomNumber . '.jpg';
                    $file->storeAs('event_images', $filename, 'public');
                    $newImages[] = 'event_images/' . $filename;
                } elseif (Str::startsWith($file->getMimeType(), 'video/')) {
                    $filename = $randomNumber . '.mp4';
                    $file->storeAs('event_videos', $filename, 'public');
                    $newVideos[] = 'event_videos/' . $filename;
                }
            }
        }

        // Combine retained and new files
        $finalImages = array_merge($retainedImages, $newImages);
        $finalVideos = array_merge($retainedVideos, $newVideos);

        // Convert formats and handle venue
        $convertedTime = Carbon::createFromFormat('H:i', $request->time)->format('h:i A');
        $convertedDate = Carbon::createFromFormat('Y-m-d', $request->date)->format('m/d/Y');

        $venue = $request->selectedvenue;
        if ($venue === "Other" && $request->filled('otherVenue')) {
            $venue = $request->otherVenue;
        } elseif ($venue === "Dande's Resto" && $request->filled('venueFloor')) {
            $venue = $request->venueFloor;
        }

        // Update event
        $updateData = [
            'description' => $request->description,
            'date' => $convertedDate,
            'time' => $convertedTime,
            'venue' => $venue,
            'selectedvenue' => $request->selectedvenue,
            'image' => implode(',', $finalImages),
            'video' => implode(',', $finalVideos),
            'updated_at' => now(),
        ];

        DB::table('events')
            ->where('name', $request->name)
            ->update($updateData);

        return response()->json(['success' => true, 'message' => 'Event updated successfully']);

    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
    public function storeV(Request $request) 
    {
        // Add this check at the start
        if (DB::table('venue')->where('name', $request->venueName)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'A venue with this name already exists'
            ], 422);
        }

        try {
            // Validate request
            $validated = $request->validate([
                'venueName' => 'required|string|max:255|unique:venue,name',
                'venueLocation' => 'required|string',
                'venueCapacity' => 'required|integer|min:1',
                'venueOther' => 'required_if:venueLocation,Other',
                'floors' => 'required_if:venueLocation,Dande\'s Resto',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            // Handle image uploads
            $imageNames = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $randomNumber = Str::random(20);
                    $extension = $image->getClientOriginalExtension();
                    $fileName = $randomNumber . '.' . $extension;
                    
                    // Store image and add to array
                    $image->storeAs('venue_images', $fileName, 'public');
                    $imageNames[] = 'venue_images/' . $fileName;
                }
            }

            // Create venue data array
            $venueData = [
                'name' => $request->venueName,
                'location' => $request->venueLocation,
                'capacity' => $request->venueCapacity,
                'specifylocation' => $request->venueLocation === 'Other' ? $request->venueOther : "",
                'floorlevel' => $request->venueLocation === "Dande's Resto" ? $request->floors : "",
                'image' => !empty($imageNames) ? implode(',', $imageNames) : "",
                'created_at' => now(),
                'updated_at' => now()
            ];

            // Insert into database
            DB::table('venue')->insert($venueData);

            return response()->json([
                'success' => true,
                'message' => 'Venue created successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Venue creation error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while creating the venue'
            ], 500);
        }
    }
    public function deleteV(Request $request)
    {
        try {
            $venueName = $request->venueName;
            
            $venue = DB::table('venue')->where('name', $venueName)->first();
            
            if ($venue && $venue->image) {
                $images = explode(',', $venue->image);
                foreach ($images as $image) {
                    $filename = basename($image);
                    if (Storage::disk('public')->exists('venue_images/' . $filename)) {
                        Storage::disk('public')->delete('venue_images/' . $filename);
                    }
                }
            }
            
            DB::table('venue')->where('name', $venueName)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Venue deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting venue: ' . $e->getMessage()
            ], 500);
        }
    }

    public function deleteMultipleV(Request $request)
    {
        try {
            $request->validate([
                'venueNames' => 'required|array',
                'venueNames.*' => 'string'
            ]);

            $venueNames = $request->venueNames;
            $deletedCount = 0;
            
            DB::beginTransaction();
            
            try {
                foreach ($venueNames as $venueName) {
                    $venue = DB::table('venue')->where('name', $venueName)->first();
                    
                    if ($venue) {
                        // Delete associated images
                        if ($venue->image) {
                            $images = explode(',', $venue->image);
                            foreach ($images as $image) {
                                if (!empty($image)) {
                                    $filename = basename(trim($image));
                                    if (Storage::disk('public')->exists('venue_images/' . $filename)) {
                                        Storage::disk('public')->delete('venue_images/' . $filename);
                                    }
                                }
                            }
                        }
                        
                        // Delete venue record
                        if (DB::table('venue')->where('name', $venueName)->delete()) {
                            $deletedCount++;
                        }
                    }
                }
                
                DB::commit();
                
                return response()->json([
                    'success' => true,
                    'message' => $deletedCount . ' venue(s) deleted successfully'
                ]);
                
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error deleting venues: ' . $e->getMessage()
            ], 500);
        }
    }

    public function editV(Request $request)
    {
        try {
            // Validate request
            $validated = $request->validate([
                'venueName' => 'required|string|max:255',
                'venueLocation' => 'required|string',
                'venueCapacity' => 'required|integer|min:1',
                'venueOther' => 'required_if:venueLocation,Other',
                'floors' => 'required_if:venueLocation,Dande\'s Resto',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'retained_images' => 'nullable|string'
            ]);

            // Get the venue
            $venue = DB::table('venue')->where('name', $request->venueName)->first();
            if (!$venue) {
                return response()->json([
                    'success' => false,
                    'message' => 'Venue not found'
                ], 404);
            }

            // Handle existing images
            $existingImages = !empty($venue->image) ? explode(',', $venue->image) : [];
            $retainedImages = !empty($request->retained_images) ? explode(',', $request->retained_images) : [];

            // Remove deleted images from storage
            foreach ($existingImages as $image) {
                if (!in_array($image, $retainedImages)) {
                    if (Storage::disk('public')->exists($image)) {
                        Storage::disk('public')->delete($image);
                    }
                }
            }

            // Handle new image uploads
            $newImageNames = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $randomNumber = Str::random(20);
                    $extension = $image->getClientOriginalExtension();
                    $fileName = $randomNumber . '.' . $extension;
                    
                    // Store image and add to array
                    $image->storeAs('venue_images', $fileName, 'public');
                    $newImageNames[] = 'venue_images/' . $fileName;
                }
            }

            // Combine retained and new images
            $finalImages = array_merge($retainedImages, $newImageNames);

            // Create venue update data array
            $venueData = [
                'location' => $request->venueLocation,
                'capacity' => $request->venueCapacity,
                'specifylocation' => $request->venueLocation === 'Other' ? $request->venueOther : "",
                'floorlevel' => $request->venueLocation === "Dande's Resto" ? $request->floors : "",
                'image' => !empty($finalImages) ? implode(',', $finalImages) : "",
                'updated_at' => now()
            ];

            // Update venue in database
            DB::table('venue')
                ->where('name', $request->venueName)
                ->update($venueData);

            return response()->json([
                'success' => true,
                'message' => 'Venue updated successfully'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            // Log the error for debugging
            \Log::error('Venue update error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while updating the venue'
            ], 500);
        }
    }
    public function GA()
    {
        if (!session('admin_logged_in')) {
            return redirect('admin/login')->with('error', 'Please log in first.');
        }
        // Get menu names directly from database
        $menus = DB::table('menu')->select('id', 'name')->get();
        
        // Get venue names directly from database
        $venues = DB::table('venue')->select('id', 'name')->get();
        $promos = DB::table('promo')->get();
        
        return view('admin.promo', compact('menus', 'venues', 'promos'));
    }
  
    public function storePromo(Request $request)
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255|unique:promo,name',
        'description' => 'required|string',
        'menulist'    => 'required|string',
        'venue'       => 'required|string',
        'price' => ['required', 'regex:/^\d+(\.\d{0,2})?$/', 'numeric', 'min:0'], 
        'images'      => 'sometimes|array',
        'images.*'    => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);
    // 3) Upload each image under promo_images/ in the public disk
    $imagePaths = [];
    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $file) {
            $name      = Str::random(20) . '.' . $file->getClientOriginalExtension();
            $path      = $file->storeAs('promo_images', $name, 'public');
            $imagePaths[] = $path;              // e.g. "promo_images/abcdef1234.jpg"
        }
    }
    $price = number_format((float)$validated['price'], 2, '.', '');

    // 4) Prepare your insert array
    $promoData = [
        'name'        => $validated['name'],
        'description' => $validated['description'],
        'menulist'    => $validated['menulist'],
        'venue'       => $validated['venue'],
        'price' => number_format((float)$validated['price'], 2, '.', ''),
        'image'       => count($imagePaths) ? implode(',', $imagePaths) : null,
        'created_at'  => now(),
        'updated_at'  => now(),
    ];
    // 5) Run the insert
    DB::table('promo')->insert($promoData);

    // 6) Return JSON success
    return response()->json([
        'success' => true,
        'message' => 'Promo created successfully',
    ]);
}
public function deletePromos(Request $request)
{
    $request->validate([
        'promoNames' => 'required|array',
        'promoNames.*' => 'string|max:255',
    ]);

    $promoNames = $request->promoNames;
    
    foreach ($promoNames as $promoName) {
        $promo = DB::table('promo')->where('name', $promoName)->first();
        
        if (!$promo) {
            continue;
        }

        // Delete associated images
        if (!empty($promo->image)) {
            $images = explode(',', $promo->image);
            foreach ($images as $img) {
                $imgPath = trim($img); // Already includes promo_images/
                if (Storage::disk('public')->exists($imgPath)) {
                    Storage::disk('public')->delete($imgPath);
                }
            }
        }

        // Delete promo record
        DB::table('promo')->where('id', $promo->id)->delete();
    }

    return response()->json([
        'success' => true, 
        'message' => 'Selected promo(s) deleted successfully.'
    ]);
}

public function updatePromo(Request $request)
{
    try {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'menulist' => 'required|string',
            'venue' => 'required|string',
            'price' => ['required', 'regex:/^\d+(\.\d{0,2})?$/', 'numeric', 'min:0'],
            'images.*' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'retained_images' => 'nullable|string'
        ]);

        // Get the promo by original name
        $promo = DB::table('promo')->where('name', $request->original_name)->first();
        if (!$promo) {
            return response()->json(['success' => false, 'message' => 'Promo not found'], 404);
        }

        // Handle existing images
        $existingImages = !empty($promo->image) ? explode(',', $promo->image) : [];
        $retainedImages = array_filter(array_map('trim', explode(',', (string)$request->retained_images)));

        // Delete removed images from storage
        foreach ($existingImages as $image) {
            if ($image && !in_array($image, $retainedImages)) {
                if (Storage::disk('public')->exists($image)) {
                    Storage::disk('public')->delete($image);
                }
            }
        }

        // Handle new image uploads
        $newImages = [];
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                if ($image && $image->isValid()) {
                    $uniqueName = Str::random(20) . '.' . $image->getClientOriginalExtension();
                    $image->storeAs('promo_images', $uniqueName, 'public');
                    $newImages[] = 'promo_images/' . $uniqueName;
                }
            }
        }

        // Combine retained and new images, remove duplicates and empty values
        $finalImages = array_values(array_filter(array_unique(array_merge($retainedImages, $newImages))));

        // Update promo in database
        DB::table('promo')
            ->where('name', $request->original_name)
            ->update([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'menulist' => $validated['menulist'],
                'venue' => $validated['venue'],
                'price' => number_format((float)$validated['price'], 2, '.', ''),
                'image' => count($finalImages) ? implode(',', $finalImages) : null,
                'updated_at' => now()
            ]);

        return response()->json([
            'success' => true,
            'message' => 'Promo updated successfully'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error updating promo: ' . $e->getMessage()
        ], 500);
    }
}

}