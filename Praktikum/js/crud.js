$(document).ready(function() {
    // Create form submission
    $("#createForm").submit(function(event) {
        event.preventDefault();
        
        // Get form data
        const name = $("#name").val();
        const avatar = $("#avatar").val();
        
        // Show loading state
        $("#result").html(`
        <div class="flex justify-center items-center p-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span class="ml-2 text-gray-600">Adding user...</span>
        </div>`);
        
        // Make POST request
        $.ajax({
            url: API_BASE_URL,
            method: "POST",
            data: {
                name: name,
                avatar: avatar
            },
            success: function(response) {
                // Format and display response
                const html = `
                <div class="bg-green-50 p-4 rounded-md">
                    <h3 class="font-semibold text-green-700 mb-2">
                        <i class="fas fa-check-circle mr-2"></i>User Successfully Added
                    </h3>
                    <div class="flex items-center mt-4">
                        <img src="${response.avatar}" alt="${response.name}" class="w-16 h-16 rounded-full object-cover border-2 border-green-200 mr-4">
                        <div>
                            <p><strong>ID:</strong> ${response.id}</p>
                            <p><strong>Name:</strong> ${response.name}</p>
                        </div>
                    </div>
                </div>`;
                
                // Update result div
                $("#result").html(html);
                
                // Clear form
                $("#createForm")[0].reset();
                
                // Show success notification
                showNotification("User successfully added");
            },
            error: function(xhr, status, error) {
                $("#result").html(formatErrorMessage(xhr, status, error));
                showNotification("Failed to add user", "error");
            }
        });
    });
    
    // Update form submission
    $("#updateForm").submit(function(event) {
        event.preventDefault();
        
        // Get form data
        const userId = $("#userId").val();
        const name = $("#updateName").val();
        const avatar = $("#updateAvatar").val();
        
        // Validate user ID
        if (!userId) {
            showNotification("Please provide a User ID", "error");
            return;
        }
        
        // Show loading state
        $("#result").html(`
        <div class="flex justify-center items-center p-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-gray-600">Updating user...</span>
        </div>`);
        
        // Make PUT request
        $.ajax({
            url: `${API_BASE_URL}/${userId}`,
            method: "PUT",
            data: {
                name: name,
                avatar: avatar
            },
            success: function(response) {
                // Format and display response
                const html = `
                <div class="bg-blue-50 p-4 rounded-md">
                    <h3 class="font-semibold text-blue-700 mb-2">
                        <i class="fas fa-check-circle mr-2"></i>User Successfully Updated
                    </h3>
                    <div class="flex items-center mt-4">
                        <img src="${response.avatar}" alt="${response.name}" class="w-16 h-16 rounded-full object-cover border-2 border-blue-200 mr-4">
                        <div>
                            <p><strong>ID:</strong> ${response.id}</p>
                            <p><strong>Name:</strong> ${response.name}</p>
                        </div>
                    </div>
                </div>`;
                
                // Update result div
                $("#result").html(html);
                
                // Show success notification
                showNotification("User successfully updated");
            },
            error: function(xhr, status, error) {
                $("#result").html(formatErrorMessage(xhr, status, error));
                showNotification("Failed to update user", "error");
            }
        });
    });
    
    // Delete button click
    $("#deleteBtn").click(function() {
        // Get user ID
        const userId = $("#userId").val();
        
        // Validate user ID
        if (!userId) {
            showNotification("Please provide a User ID", "error");
            return;
        }
        
        // Confirm deletion
        if (confirm("Are you sure you want to delete this user?")) {
            // Show loading state
            $("#result").html(`
            <div class="flex justify-center items-center p-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                <span class="ml-2 text-gray-600">Deleting user...</span>
            </div>`);
            
            // Make DELETE request
            $.ajax({
                url: `${API_BASE_URL}/${userId}`,
                method: "DELETE",
                success: function(response) {
                    // Format and display response
                    const html = `
                    <div class="bg-red-50 p-4 rounded-md">
                        <h3 class="font-semibold text-red-700 mb-2">
                            <i class="fas fa-check-circle mr-2"></i>User Successfully Deleted
                        </h3>
                        <div class="flex items-center mt-4">
                            <img src="${response.avatar}" alt="${response.name}" class="w-16 h-16 rounded-full object-cover border-2 border-red-200 mr-4">
                            <div>
                                <p><strong>ID:</strong> ${response.id}</p>
                                <p><strong>Name:</strong> ${response.name}</p>
                            </div>
                        </div>
                    </div>`;
                                        // Tampilkan hasil
                                        $("#result").html(html);

                                        // Reset form
                                        $("#userId").val("");
                                        $("#updateName").val("");
                                        $("#updateAvatar").val("");
                    
                                        // Notifikasi sukses
                                        showNotification("User successfully deleted");
                                    },
                                    error: function(xhr, status, error) {
                                        $("#result").html(formatErrorMessage(xhr, status, error));
                                        showNotification("Failed to delete user", "error");
                                    }
                                });
                            }
                        });
                    
                        // Search user by ID
                        $("#searchBtn").click(function() {
                            const userId = $("#userId").val();
                    
                            if (!userId) {
                                showNotification("Please enter a User ID to search", "error");
                                return;
                            }
                    
                            // Show loading state
                            $("#result").html(`
                            <div class="flex justify-center items-center p-4">
                                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                                <span class="ml-2 text-gray-600">Searching user...</span>
                            </div>`);
                    
                            $.ajax({
                                url: `${API_BASE_URL}/${userId}`,
                                method: "GET",
                                dataType: "json",
                                success: function(user) {
                                    const html = `
                                    <div class="bg-yellow-50 p-4 rounded-md">
                                        <h3 class="font-semibold text-yellow-700 mb-2">
                                            <i class="fas fa-search mr-2"></i>User Found
                                        </h3>
                                        <div class="flex items-center mt-4">
                                            <img src="${user.avatar}" alt="${user.name}" class="w-16 h-16 rounded-full object-cover border-2 border-yellow-200 mr-4">
                                            <div>
                                                <p><strong>ID:</strong> ${user.id}</p>
                                                <p><strong>Name:</strong> ${user.name}</p>
                                            </div>
                                        </div>
                                    </div>`;
                                    
                                    $("#result").html(html);
                                    showNotification("User found", "success");
                    
                                    // Autofill update fields
                                    $("#updateName").val(user.name);
                                    $("#updateAvatar").val(user.avatar);
                                },
                                error: function(xhr, status, error) {
                                    $("#result").html(formatErrorMessage(xhr, status, error));
                                    showNotification("User not found", "error");
                                }
                            });
                        });
                    });
                    
                    
                    // Format AJAX error
                    function formatErrorMessage(xhr, status, error) {
                        return `
                        <div class="bg-red-50 p-4 rounded-md">
                            <h3 class="font-semibold text-red-700 mb-2">
                                <i class="fas fa-times-circle mr-2"></i>Error Occurred
                            </h3>
                            <p><strong>Status:</strong> ${status}</p>
                            <p><strong>Error:</strong> ${error}</p>
                            <p class="text-sm mt-2">${xhr.responseText}</p>
                        </div>`;
                    }
                    