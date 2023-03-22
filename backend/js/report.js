//choi do here
// $(document).ready(function () {
//     reports = JSON.parse(reports)

//     for (report of reports) {
//         $('#reportTable').append(`
//         <tr>
//             <td>${report.reportStatus}</td>
//             <td>${report.reportText}</td>
//         </tr>
//     `)
//     }

// })

$(document).ready(function () {
    getReports()
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
                    ("#reportTable".empty())
                    var no = 1
                    for (report of result.data) {
                        $("#reportTable").append(`
                            <tr>
                                <th class="align-middle" scope="row">${no}</th>
                                <td class="align-middle">${report.reportWho}</th>
                                <td class="align-middle">${report.reportStatus}</td>
                                <td class="align-middle">${report.reportText}</td>
                                <td class="align-middle">${report.charityName}</td>
                                <td class="align-middle">${report.bakeryName}</td>
                                <td class="align-middle">
                                    <button type="button" class="btn btn-warning deleteBtn">Delete</button>
                                </td>
                                <td class="align-middle">
                                    <button type="button" class="btn btn-danger updateBtn">Update</button>
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
    deleteReport(id)
})

$(document).on("click", ".updateBtn", function () {
    var id = $(this).parent().siblings('.id').text()
    var report = {
        reportStatus: 'report reviewed, driver banned', // Replace with updated data
        // reportText: 'updated text',
        // Add other updated fields here
    }
    updateReport(id, report)
})


function addReport() {
    // var reportId = parseInt($('#newId').val())
    // var reportStatus = $('#reportStatus').val()
    // var listingId = $('#listingId').val()
    var reportWho = $('#reportWho').val()
    var reportText = $('#reportText').val()
    var volunteerId = $('#volunteerId').val()
    var charityName = $('#charityName').val()
    var bakeryName = $('#bakeryName').val()

    $.ajax({
        url: '/reports',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            // reportStatus: reportStatus,
            reportWho: reportWho,
            listingId: listingId,
            reportText: reportText,
            charityName: charityName,
            bakeryName: bakeryName,
            reportStatus: 'under review',
            volunteerId: volunteerId,
        }),
        success: function (data) {
            alert('Report added')
            // $('#newlistingId').val('')
            $('#newreportText').val('')
            $('#newreportWho').val('')
            $('#newVolunteerId').val('')
            $('#newCharityName').val('')
            $('#newBakeryName').val('')
            getReports()
        },
        error: function (xhr, status, error) {
            var message = JSON.parse(xhr.responseText).error
            alert('Error: ' + message)
        }
    })
}

function updateReport(id, report) {
    $.ajax({
        url: '/reports/' + id,
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
        url: '/reports/' + id,
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