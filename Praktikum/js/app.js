// Configuration
const API_BASE_URL = "https://64fada7acb9c00518f7a4784.mockapi.io/users";

// Utility functions
function showNotification(message, type = 'success') {
    const notification = $("#notification");
    const notificationText = $("#notificationText");
    
    // Set notification text
    notificationText.text(message);
    
    // Set notification style based on type
    if (type === 'success') {
        notification.removeClass('bg-red-500 bg-yellow-500').addClass('bg-green-500');
        notification.find('i').removeClass().addClass('fas fa-check-circle mr-2');
    } else if (type === 'error') {
        notification.removeClass('bg-green-500 bg-yellow-500').addClass('bg-red-500');
        notification.find('i').removeClass().addClass('fas fa-exclamation-circle mr-2');
    } else if (type === 'warning') {
        notification.removeClass('bg-green-500 bg-red-500').addClass('bg-yellow-500');
        notification.find('i').removeClass().addClass('fas fa-exclamation-triangle mr-2');
    }
    
    // Show notification
    notification.css('opacity', '1');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.css('opacity', '0');
    }, 3000);
}

// Function to format user data for display
function formatUserData(user) {
    return `
    <div class="flex items-center p-3 border-b border-gray-200 hover:bg-gray-50 transition duration-150">
        <div class="flex-shrink-0 mr-4">
            <img src="${user.avatar}" alt="${user.name}" class="w-12 h-12 rounded-full object-cover border-2 border-indigo-200">
        </div>
        <div class="flex-grow">
            <h3 class="font-medium text-gray-800">${user.name}</h3>
            <p class="text-sm text-gray-500">ID: ${user.id}</p>
        </div>
    </div>`;
}

// Function to format error message
function formatErrorMessage(xhr, status, error) {
    return `
    <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">Error Occurred</h3>
                <div class="mt-2 text-sm text-red-700">
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Error:</strong> ${error}</p>
                    <p><strong>Status Code:</strong> ${xhr.status}</p>
                    <p><strong>Response:</strong> ${xhr.responseText || "No response"}</p>
                </div>
            </div>
        </div>
    </div>`;
}

// Index page functionality - Fetch and display users
$(document).ready(function() {
    // Check if we're on the index page
    if ($("#refreshBtn").length > 0) {
        // Set up event listener for refresh button
        $("#refreshBtn").click(function() {
            fetchUsers();
        });
        
        // Automatically fetch users on page load
        fetchUsers();
    }
});

function fetchUsers() {
    // Show loading state
    $("#result").html(`
    <div class="flex justify-center items-center p-4">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span class="ml-2 text-gray-600">Loading data...</span>
    </div>`);
    
    // Make AJAX request
    $.ajax({
        url: API_BASE_URL,
        method: "GET",
        dataType: "json",
        success: function(data) {
            if (data.length === 0) {
                $("#result").html(`
                <div class="text-center py-8">
                    <i class="fas fa-users text-gray-300 text-4xl mb-2"></i>
                    <p class="text-gray-500">No users found</p>
                </div>`);
                return;
            }
            
            let html = `<div class="divide-y divide-gray-200">`;
            
            // Loop through each user and format
            data.forEach(user => {
                html += formatUserData(user);
            });
            
            html += `</div>`;
            
            // Update result div with user data
            $("#result").html(html);
            
            // Show success notification
            showNotification("Data successfully loaded");
        },
        error: function(xhr, status, error) {
            $("#result").html(formatErrorMessage(xhr, status, error));
            showNotification("Failed to load data", "error");
        }
    });
}