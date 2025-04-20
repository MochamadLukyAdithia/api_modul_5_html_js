const apiUrl = "https://64fada7acb9c00518f7a4784.mockapi.io/users";
let isEditing = false;
let allUsers = []; 


function errorIfDataExists()
{
    const name = $("#name").val();
    const avatar = $("#avatar").val();
    
    if (!name || !avatar) {
        showNotification("Please fill in all fields", "error");
        return true;
    }
    
    const existingUser = allUsers.find(user => user.name === name && user.avatar !== avatar);
    
    if (existingUser) {
        showNotification("User already exists", "error");
        return true;
    }
    
    return false;
}
function showNotification(message, type = 'success') {
    const notification = $("#notification");
    const notificationText = $("#notificationText");
    const notificationIcon = $("#notificationIcon");
    
    notificationText.text(message);
    

    if (type === 'success') {
        notification.removeClass('bg-red-500 bg-yellow-500').addClass('bg-green-500 text-white');
        notificationIcon.removeClass().addClass('fas fa-check-circle');
    } else if (type === 'error') {
        notification.removeClass('bg-green-500 bg-yellow-500').addClass('bg-red-500 text-white');
        notificationIcon.removeClass().addClass('fas fa-exclamation-circle');
    } else if (type === 'warning') {
        notification.removeClass('bg-green-500 bg-red-500').addClass('bg-yellow-500 text-white');
        notificationIcon.removeClass().addClass('fas fa-exclamation-triangle');
    }
    
    notification.css('opacity', '1');
    
    setTimeout(() => {
        notification.css('opacity', '0');
    }, 3000);
}


function updateStatistics(totalCount, foundCount) {
    $("#totalUsers").text(totalCount);
    $("#foundUsers").text(foundCount);
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    $("#lastUpdated").text(timeString);
}


function fetchUsers() {
    $("#usersList").html(`
        <div class="flex justify-center items-center p-4">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span class="ml-2 text-gray-600">Loading data...</span>
        </div>
    `);
    
    $.ajax({
        url: apiUrl,
        method: "GET",
        dataType: "json",
        success: function(data) {
            allUsers = data; 
            
            if (data.length === 0) {
                $("#usersList").html('');
                $("#emptyState").removeClass('hidden');
                updateStatistics(0, 0);
                return;
            }
            
            $("#emptyState").addClass('hidden');
            renderUsers(data);
            updateStatistics(data.length, data.length);
        },
        error: function(xhr, status, error) {
            $("#usersList").html(`
                <div class="p-4 bg-red-50 border border-red-100 rounded-md text-red-600">
                    <p class="font-medium">Error loading data</p>
                    <p class="text-sm">${error}</p>
                </div>
            `);
            showNotification("Failed to load users", "error");
        }
    });
}


function renderUsers(users) {
    if (users.length === 0) {
        $("#usersList").html('');
        $("#emptyState").removeClass('hidden');
        return;
    }
    
    $("#emptyState").addClass('hidden');
    
    let html = '';
    $.each(users, function(index, user) {
        html += `
        <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex">
            <div class="w-20 p-4 bg-indigo-50 flex items-center justify-center">
                <img src="${user.avatar}" alt="${user.name}" class="w-12 h-12 rounded-full object-cover border-2 border-indigo-200">
            </div>
            <div class="flex-grow p-4">
                <h3 class="font-medium text-gray-800">${user.name}</h3>
                <p class="text-sm text-gray-500">ID: ${user.id}</p>
            </div>
            <div class="p-4 flex items-center space-x-2">
                <button class="view-btn p-2 bg-blue-50 text-blue-500 rounded-md hover:bg-blue-100 transition-colors" data-id="${user.id}" title="View">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="edit-btn p-2 bg-green-50 text-green-500 rounded-md hover:bg-green-100 transition-colors" data-id="${user.id}" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn p-2 bg-red-50 text-red-500 rounded-md hover:bg-red-100 transition-colors" data-id="${user.id}" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>`;
    });
    
    $("#usersList").html(html);
    

    $(".view-btn").click(function() {
        const userId = $(this).data('id');
        fetchUserDetail(userId);
    });
    
    $(".edit-btn").click(function() {
        const userId = $(this).data('id');
        editUser(userId);
    });
    
    $(".delete-btn").click(function() {
        const userId = $(this).data('id');
        confirmDelete(userId);
    });
}


function confirmDelete(userId) {
    if (confirm("Are you sure you want to delete this user?")) {
        deleteUser(userId);
    }
}


function fetchUserDetail(userId) {
    $.ajax({
        url: `${apiUrl}/${userId}`,
        method: "GET",
        dataType: "json",
        success: function(user) {
            $("#detailName").text(user.name);
            $("#detailId").text(user.id);
            $("#detailAvatar").attr('src', user.avatar);
            $("#userDetail").removeClass('hidden');
        },
        error: function(xhr, status, error) {
            showNotification("Failed to load user details", "error");
        }
    });
}


function editUser(userId) {
    $.ajax({
        url: `${apiUrl}/${userId}`,
        method: "GET",
        dataType: "json",
        success: function(user) {

            $("#userId").val(user.id);
            $("#name").val(user.name);
            $("#avatar").val(user.avatar);
            
        
            isEditing = true;
            $("#submitBtn").html('<i class="fas fa-save mr-2"></i><span>Update Data</span>');
     
            if (window.innerWidth < 768) {
                $('html, body').animate({
                    scrollTop: $("#userForm").offset().top - 20
                }, 500);
            }
            
            showNotification("User data loaded for editing", "warning");
        },
        error: function(xhr, status, error) {
            showNotification("Failed to load user for editing", "error");
        }
    });
}


function deleteUser(userId) {
    $.ajax({
        url: `${apiUrl}/${userId}`,
        method: "DELETE",
        success: function(response) {
            fetchUsers();
            showNotification("User deleted successfully");
        },
        error: function(xhr, status, error) {
            showNotification("Failed to delete user", "error");
        }
    });
}


function searchUsers(query) {
    if (!query) {
        renderUsers(allUsers);
        updateStatistics(allUsers.length, allUsers.length);
        return;
    }
    
    const filteredUsers = allUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase())
    );
    
    renderUsers(filteredUsers);
    updateStatistics(allUsers.length, filteredUsers.length);
}

$("#userForm").submit(function(event) {
    event.preventDefault();

    const name = $("#name").val();
    const avatar = $("#avatar").val();
    const userId = $("#userId").val();

    if (!isEditing && errorIfDataExists()) {
        return;
    }

    if (isEditing) {
        $.ajax({
            url: `${apiUrl}/${userId}`,
            method: "PUT",
            data: {
                name: name,
                avatar: avatar
            },
            success: function(response) {
                fetchUsers();
                resetForm();
                showNotification("User updated successfully");
            },
            error: function(xhr, status, error) {
                showNotification("Failed to update user", "error");
            }
        });
    } else {
        $.ajax({
            url: apiUrl,
            method: "POST",
            data: {
                name: name,
                avatar: avatar
            },
            success: function(response) {
                fetchUsers();
                resetForm();
                showNotification("User added successfully");
            },
            error: function(xhr, status, error) {
                showNotification("Failed to add user", "error");
            }
        });
    }
});


function resetForm() {
    $("#userForm")[0].reset();
    $("#userId").val("");
    isEditing = false;
    $("#submitBtn").html('<i class="fas fa-plus-circle mr-2"></i><span>Tambah Data</span>');
}

$("#searchInput").on("input", function() {
    const query = $(this).val();
    searchUsers(query);
});


$("#clearBtn").click(function() {
    resetForm();
});


$("#closeDetail, #closeDetailBtn").click(function() {
    $("#userDetail").addClass('hidden');
});


$("#userDetail").click(function(e) {
    if (e.target === this) {
        $(this).addClass('hidden');
    }
});


$(document).ready(function() {
    fetchUsers();
});