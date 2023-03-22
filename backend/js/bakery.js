$(document).ready(function () {
    getBakeries()
})

function getBakeries() {
    $(async () => {
        var serviceUrl = "http://localhost:5001/bakeries"
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    $("#bakeryTable").empty()
                    var no = 1
                    for (bakery of result.data) {
                        $("#bakeryTable").append(`
                            <tr>
                                <th class="align-middle" scope="row">${no}</th>
                                <td class="align-middle">${bakery.bakeryName}</td>
                                <td class="align-middle">${bakery.bakeryAddress}</td>
                                <td class="align-middle">${bakery.bakeryPhone}</td>
                                <td class="align-middle">
                                    <button type="button" class="btn btn-warning deleteBtn">Delete</button>
                                </td>
                                <td style="display: none" class="email">${bakery.bakeryEmail}</td>
                            </tr>
                        `)
                        no += 1
                    }
                }
            }
        } catch (error) {
            alert("There are no bakeries, or there is a problem.")
        }
    })
}

$(document).on("click", ".deleteBtn", function () {
    var email = $(this).parent().siblings(".email").text()
    deleteBakery(email)
})

function addBakery() {
    var bakeryName = $("#newName").val()
    var bakeryAddress = $("#newAddress").val()
    var bakeryPhone = parseInt($("#newPhone").val())
    var bakeryEmail = $("#newEmail").val()

    $(async () => {
        var serviceUrl = "http://localhost:5003/bakeries"
        data = JSON.stringify({
            bakeryName: bakeryName,
            bakeryAddress: bakeryAddress,
            bakeryPhone: bakeryPhone,
            bakeryEmail: bakeryEmail,
            isBanned: false
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
                    alert("Bakery added")
                    $("#newName").val("")
                    $("#newAddress").val("")
                    $("#newPhone").val("")
                    $("#newEmail").val("")
                    getBakeries()
                }
            }
        } catch (error) {
            alert("Error creating bakery.")
        }
    })
}

function deleteBakery(email) {
    $(async () => {
        console.log(email)
        var serviceUrl = "http://localhost:5003/bakeries/" + email
        try {
            const response = await fetch(serviceUrl, {
                method: "DELETE"
            })
            const result = await response.json();
            if (response.ok) {
                if (response.status === 200) {
                    alert("Bakery has been deleted.")
                    getBakeries()
                }
            }
        } catch (error) {
            alert("There are no bakeries, or there is a problem.");
        }
    })
}