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


// async function updateReport(id, report) {
//     console.log(id)
    
    
//     $.ajax({
//         url: 'http://localhost:5005/reports/' + id,
//         type: 'PUT',
//         contentType: 'application/json',
//         data: JSON.stringify(report),
//         success: function () {
//             // Refresh the report table
//             getReports()
//         }
//     })
// }



async function updateReport(id) {

    var serviceUrl = "http://localhost:5005/reports/" + id
    const response = await fetch(serviceUrl, {
        method: "GET"
    })
    const result = await response.json()
    var listingId = result.data.listingId

    // get banned Status - change address
    var serviceUrl = "http://localhost:5004/listings/" + listingId
    const response2 = await fetch(serviceUrl, {
        method: "GET"
    })
    const result2 = await response2.json()
    var isBanned = result2.data.isBanned
    

    if (isBanned) {
        data = JSON.stringify({
        isBanned: false
        
    })
    } else {
        data = JSON.stringify({
            isBanned: true
        })
    }


    var serviceUrl = "http://localhost:5004/bakeries/" + id 




    try {
        const response = await fetch(serviceUrl, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: data
        })
        const result = await response.json()
        if (response.ok) {
            if (response.status == 201) {
                alert("Accepted")
                retrieveUserType(user.uid)
            }
        }
    } catch (error) {
        alert("Error creating report.")
        alert(error.message)
    }
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