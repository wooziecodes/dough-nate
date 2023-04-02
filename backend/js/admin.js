//choi do here
$(document).ready(function () {
    getReports()
    // getListingsWithCharityId()
})
function getReports() {
    $(async () => {
        var serviceUrl = "http://localhost:5005/reports"
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    $("#reportTable").empty()
                    var no = 1
                    for (report of result.data) {
                        $("#reportTable").append(`
                            <tr>
                                <th class="align-middle" scope="row">${no}</th>
                                <td class="align-middle">${report.id}</th>
                                <td class="align-middle">${report.listingId}</td>
                                <td class="align-middle">${report.reportStatus}</td>
                                <td class="align-middle">${report.reportText}</td>
                                <td class="align-middle">${report.reportType}</td>
                                <td class="align-middle">
                                    <button type="button" class="btn btn-warning deleteBtn">Delete</button>
                                </td>
                                <td class="align-middle">
                                    <button type="button" class="btn btn-danger updateBtnBan">Ban</button>
                                </td>
                                <td class="align-middle">
                                    <button type="button" class="btn btn-success updateBtnNoBan">Don't Ban</button>
                                </td>
                                <td style="display: none" class="id">${report.id}</td>
                            </tr>
                        `)
                        no += 1
                    }
                }
            }
        } catch(error) {
            alert("There are no reports, or there is a problem.")
        }
    })
}
$(document).on("click", ".deleteBtn", function () {
    var id = $(this).parent().siblings('.id').text()
    console.log(id);
    deleteReport(id)
})

$(document).on("click", ".updateBtnBan", function () {
    var id = $(this).parent().siblings('.id').text()
    var report = {
        reportStatus: 'report reviewed, banned', // Replace with updated data
        // reportText: 'updated text',
        // Add other updated fields here
    }
    updateReport(id, report)
})
$(document).on("click", ".updateBtnNoBan", function () {
    var id = $(this).parent().siblings('.id').text()
    var report = {
        reportStatus: 'report reviewed, not banned', // Replace with updated data
        // reportText: 'updated text',
        // Add other updated fields here
    }
    updateReport(id, report)
})

async function updateReport(id, report) {
    $.ajax({
        url: 'http://localhost:5005/reports/' + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(report),
        success: function () {
            // Refresh the report table
            getReports()
        }
    })
}

function deleteReport(id) {
    $.ajax({
        url: 'http://localhost:5005/reports/' + id,
        type: 'DELETE',
        success: function (data) {
            alert('Report deleted successfully')
            getReports()
        },
        error: function (xhr, status, error) {
            var message = JSON.parse(xhr.responseText).error
            alert('Error: ' + message)
        }
    })
}