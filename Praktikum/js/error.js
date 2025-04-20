$(document).ready(function () {
    $("#errorBtn").click(function () {
        const url = $("#apiUrl").val();

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (data) {
                $("#result").html(`
                    <div class="text-green-600 font-semibold">
                        Data berhasil diambil: ${JSON.stringify(data)}
                    </div>
                `);
            },
            error: function (xhr, status, error) {
                $("#result").html(`
                    <div class="text-red-600 font-semibold">
                        Terjadi kesalahan saat mengambil data API:<br>
                        Status: ${status}<br>
                        Error: ${error}
                    </div>
                `);
                showNotification("Gagal memanggil API", "error");
            }
        });
    });
});
