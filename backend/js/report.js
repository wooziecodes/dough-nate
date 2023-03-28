//choi do here
$(document).ready(function () {
    getReports()
    getListingsWithCharityId()
})

function getListingsWithCharityId(charityId) {
    $(async () => {
        charityId = 'Z1JgdfJKXofMvB5pq7zf'
        var serviceUrl = "http://localhost:5004/listings/charity/" + charityId

        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    console.log(result.data[0].id)
           

                    const bakeryName = [];
                    const createdTime = [];
                    const listingId = [];
                    for(let i=0; i<result.data.length; i++){
                        // console.log(i);
                        console.log(result.data[i].createTime)
                        bakeryName.push(result.data[i].bakeryName);
                        createdTime.push(result.data[i].createTime);
                        listingId.push(result.data[i].id);
                    }
                    
                    if(bakeryName.length == 1){
                        $("#bakeryName").empty();
                        $("#bakeryName").append(`
                            <option value="${bakeryName}">${bakeryName} | </option>
                        `);
                    } else {
                        console.log('meow')
                        $("#bakeryName").empty()
                        for (let i = 0; i < bakeryName.length; i++) {
                            // const bakeryname = result.data[0].bakeryName[i]

                            $("#bakeryName").append(`
                                <option value="${listingId[i]}">${bakeryName[i]} || ${createdTime[i]}</option>
                            `)
                        }
                    }
                }
            }
        } catch(error) {
            alert("nihaoma")
            // alert(error.message)
        }
    })
}

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
    var reportWho = $('#reportWho').val()
    var reportText = $('#reportText').val()
    var listingId = $('#bakeryName').val()


    $(async () => {
        var serviceUrl = "http://localhost:5005/reports"
        data = JSON.stringify({
            reportWho: reportWho,
            reportText: reportText,
            listingId: listingId,
            reportStatus: "reviewing",
            reportType: 'bakery'
        })
        try {
            const response = await fetch(serviceUrl, {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: data
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status == 201) {
                    alert("Report added")
                    $("#newReportWho").val("")
                    $("#newReportText").val("")
                    $("#newListingId").val("")
                    $("#newReportStatus").val("")
                    $("#newReportType").val("")
                    // $("#newVolunteerId").val("")
                    // $("#newCharityName").val("")
                    // $('#newBakeryName').val('')
                    // getBakeries()
                }
            }
        } catch (error) {
            alert("Error creating report.")
            alert(error.message)
        }
    })
}


// function updateReport(id, report) {
//     $.ajax({
//         url: '/reports/' + id,
//         type: 'PUT',
//         contentType: 'application/json',
//         data: JSON.stringify(report),
//         success: function () {
//             // Refresh the report table
//             getReports()
//         }
//     })
// }

// function deleteReport(id) {
//     $.ajax({
//         url: '/reports/' + id,
//         type: 'DELETE',
//         success: function (data) {
//             alert('Report deleted successfully')
//             getReports()
//         },
//         error: function (xhr, status, error) {
//             var message = JSON.parse(xhr.responseText).error
//             alert('Error: ' + message)
//         }
//     })
// }