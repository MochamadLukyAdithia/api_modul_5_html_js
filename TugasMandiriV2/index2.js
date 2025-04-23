const API_BASE_URL = "https://praktikum-paa.vercel.app/api/produk";
let isEditing = false;
let allUsers = [];

function errorIfDataExists() {
    const name = $("#name").val();
    const price = $("#price").val();
    const stock = $("#stock").val();
    if (!name || !price || !stock) {
        showNotification("Please fill in all fields", "error");
        return true;
    }
    if (!isEditing) {
        const existingUser = allUsers.find(user => user.name.toLowerCase() === name.toLowerCase());
        if (existingUser) {
            showNotification("Product already exists", "error");
            return true;
        }
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
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span class="ml-2 text-gray-600">Loading data...</span>
      </div>
    `);
    $.ajax({
        url: API_BASE_URL,
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (!response.success || !Array.isArray(response.data)) {
                showNotification("Invalid data format", "error");
                return;
            }
            allUsers = response.data;
            if (allUsers.length === 0) {
                $("#usersList").html('');
                $("#emptyState").removeClass('hidden');
                updateStatistics(0, 0);
                return;
            }
            $("#emptyState").addClass('hidden');
            renderUsers(allUsers);
            updateStatistics(allUsers.length, allUsers.length);
        },
        error: function(xhr, status, error) {
            $("#usersList").html(`
              <div class="p-4 bg-red-50 border border-red-100 rounded-md text-red-600">
                <p class="font-medium">Error loading data</p>
                <p class="text-sm">${error}</p>
              </div>
            `);
            showNotification("Failed to load products", "error");
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
          <div class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex items-center mb-2">
            <div class="flex-grow p-4">
              <h3 class="font-semibold text-gray-800 text-lg">${user.name}</h3>
              <p class="text-sm text-gray-500">ID: ${user.id}</p>
              <p class="text-sm text-gray-500">Harga: Rp${user.price.toLocaleString()}</p>
              <p class="text-sm text-gray-500">Stok: ${user.stock}</p>
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
    if (confirm("Apakah kamu yakin ingin menghapus produk ini?")) {
        deleteUser(userId);
    }
}

function fetchUserDetail(userId) {
    $.ajax({
        url: `${API_BASE_URL}/${userId}`,
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (!response.success || !response.data) {
                showNotification("Data produk tidak valid", "error");
                return;
            }
            const user = response.data;
            const createdDate = new Date(user.createdAt).toLocaleString('id-ID');
            const updatedDate = new Date(user.updatedAt).toLocaleString('id-ID');
            $("#detailName").text(user.name);
            $("#detailId").text(user.id);
            $("#detailPrice").text(`Rp${user.price.toLocaleString()}`);
            $("#detailStock").text(user.stock);
            $("#detailCreated").text(createdDate);
            $("#detailUpdated").text(updatedDate);
            $("#userDetail").removeClass("hidden");
        },
        error: function(xhr, status, error) {
            showNotification("Gagal memuat detail produk", "error");
        }
    });
}

function editUser(userId) {
    $.ajax({
        url: `${API_BASE_URL}/${userId}`,
        method: "GET",
        dataType: "json",
        success: function(response) {
            if (!response.success || !response.data) {
                showNotification("Data tidak valid untuk diedit", "error");
                return;
            }
            const user = response.data;
            $("#name").val(user.name);
            $("#price").val(user.price);
            $("#stock").val(user.stock);
            $("#userId").val(user.id);
            isEditing = true;
            $("#submitBtn").html('<i class="fas fa-save mr-2"></i><span>Update Data</span>');
            if (window.innerWidth < 768) {
                $("html, body").animate({
                    scrollTop: $("#userForm").offset().top - 20
                }, 500);
            }
            showNotification("Data produk siap untuk diedit", "warning");
        },
        error: function(xhr, status, error) {
            showNotification("Gagal memuat data untuk diedit", "error");
        }
    });
}

function deleteUser(userId) {
    $.ajax({
        url: `${API_BASE_URL}/${userId}`,
        method: "DELETE",
        success: function(response) {
            fetchUsers();
            showNotification("Produk berhasil dihapus");
        },
        error: function(xhr, status, error) {
            showNotification("Gagal menghapus produk", "error");
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
    const name = String($("#name").val());
    const price = Number($("#price").val());
    const stock = Number($("#stock").val());
    const userId = $("#userId").val();

    if (errorIfDataExists()) {
        return;
    }

    if (isEditing) {
        const requestData = {
            name: name,
            price: price,
            stock: stock
        };
        $.ajax({
            url: `${API_BASE_URL}/${userId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(requestData),
            success: function(response) {
                if (response.success) {
                    fetchUsers();
                    resetForm();
                    showNotification("Produk berhasil diperbarui");
                } else {
                    showNotification("Gagal memperbarui produk", "error");
                }
            },
            error: function(xhr, status, error) {
                showNotification("Gagal memperbarui produk", "error");
            }
        });
    } else {
        $.ajax({
            url: API_BASE_URL,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                name: name,
                price: price,
                stock: stock
            }),
            success: function(response) {
                if (response.success) {
                    fetchUsers();
                    resetForm();
                    showNotification("Produk berhasil ditambahkan");
                } else {
                    showNotification("Gagal menambahkan produk", "error");
                }
            },
            error: function(xhr, status, error) {
                showNotification("Gagal menambahkan produk", "error");
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
    $("#userDetail").addClass("hidden");
});

$("#userDetail").click(function(e) {
    if (e.target === this) {
        $(this).addClass("hidden");
    }
});

$(document).ready(function() {
    fetchUsers();
});