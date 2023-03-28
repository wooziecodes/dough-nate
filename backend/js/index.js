//weisheng do here
$(document).ready(function () {
    bakery = "zwxvGoUR8LTAOw2uzrxI24WAEnE2"
    charity = "wXjex84ieu8KvvKnXMti"
    volunteer = "7ILUdTNmiXV1vWn8RZF9"
    retrieveUserType(charity)

})

function retrieveUserType(userid) {
    $(async () => {
        var serviceUrl = "http://localhost:5006/users/" + userid
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    console.log(result.data.userType)
                    showListings(result.data.userType)
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
                    if (info == "bakery") {
                        for (listing of result.data) {
                            if (listing.status == "created" ) {
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

                    } else if (info == "charity") {
                        for (listing of result.data) {
                            if (listing.status == "delivered") {
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
                    } else if (info == "volunteer") {
                        for (listing of result.data) {
                            if (listing.status == "created" && listing.bakeryId == info) {
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
