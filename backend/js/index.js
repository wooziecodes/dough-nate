//weisheng do here
$(document).ready(function () {
    info = retrieveUserType()

    showListings(info)
})

function retrieveUserType() {
    $(async () => {
        var serviceUrl = "http://localhost:5005/users"
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    console.log(result.data.userType)
                    return [result.data.userType, result.data.id]
                }
            }
        } catch (error) {
            alert("Error retrieving user type")
        }
    })
}


function showListings(info) {
    $(async () => {
        var serviceUrl = "http://localhost:5004/listings"
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    console.log(result.data)
                    if (info[0] == "bakery") {
                        for (listing of result.data) {
                            if (listing.status == "created" && listing.bakeryId == info[1]) {
                                //allergens need to fix
                                $("#listings").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    <td class="align-middle">${listing.releaseTime}</td>
                                    <td class="align-middle">${listing.allergens}</td>

                                </tr>
                            `)
                            }

                        }

                    } else if (info[0] == "charity") {
                        for (listing of result.data) {
                            if (listing.status == "created"  ) {
                                //allergens need to fix
                                $("#listings").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    <td class="align-middle">${listing.releaseTime}</td>
                                    <td class="align-middle">${listing.allergens}</td>

                                </tr>
                            `)
                            }

                        }
                    } else if (info[0] == "volunteer") {
                        for (listing of result.data) {
                            if (listing.status == "created" && listing.bakeryId == info[1]) {
                                //allergens need to fix
                                $("#listings").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    <td class="align-middle">${listing.releaseTime}</td>
                                    <td class="align-middle">${listing.allergens}</td>

                                </tr>
                            `)
                            }

                        }
                    }
                }
            }
        } catch (error) {
            alert("Error generating listings")
        }
    })
}
