$(document).ready(function () {
    $("#cover").hide()
    uid = "sample"
    getListings(uid)
})

function getListings(uid) {
    $(async () => {
        var serviceUrl = "http://localhost:5006/users/" + uid
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    switch (result.data.userType) {
                        case ("charity"):
                            $("#charityTable").show()
                            break
                        case ("bakery"):
                            $("#bakeryTable").show()
                            break
                        case ("volunteer"):
                            $("#volunteerTable").show()
                            break
                    }
                    populateTable(result.data.id, result.data.userType)
                }
            }
        } catch (error) {
            alert("There are no listings, or there is a problem.")
        }
    })
}

function populateTable(id, userType) {
    $(async () => {
        var serviceUrl = "http://localhost:5004/listings/"
        switch (userType) {
            case ("charity"):
                serviceUrl += "/charity/" + id
                break
            case ("bakery"):
                serviceUrl += "/bakery/" + id
                break
            case ("volunteer"):
                serviceUrl += "/volunteer/" + id
                break
        }

        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    if (userType == "charity") {
                        $("#charityTableBody").empty()
                        for (listing of result.data) {
                            var toAppend
                            //created (charity see), accepted (vol see), picking up, delivering, delivered 
                            switch (listing.status) {
                                case ("accepted"):
                                    toAppend = `
                                        <td class="align-middle text-warning">Searching for driver</td>
                                    `
                                    break
                                case ("pickingup"):
                                    toAppend = `
                                        <td class="align-middle text-info">Driver is on the way to pick up</td>
                                    `
                                    break
                                case ("delivering"):
                                    toAppend = `
                                        <td class="align-middle text-info">Driver is delivering
                                        <button type="button" class="btn btn-success" onclick="updateStatus('${listing.id}', 'delivered')">Delivered</button>
                                        </td>
                                    `
                                    break
                                case ("delivered"):
                                    toAppend = `
                                        <td class="align-middle text-success">Delivered</td>
                                    `
                                    break
                            }

                            $("#charityTableBody").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    ${toAppend}
                                    <td class="align-middle mapbtn" onclick="displayMap('${listing.id}')">View map</td>
                                </tr>
                            `)

                        }
                    }
                    else if (userType == "bakery") {
                        $("#bakeryTableBody").empty()
                        for (listing of result.data) {
                            var toAppend
                            //created (charity see), accepted (vol see), picking up, delivering, delivered 
                            switch (listing.status) {
                                case ("created"):
                                    toAppend = `
                                        <td class="align-middle text-info">Created</td>
                                    `
                                    break
                                case ("accepted"):
                                    toAppend = `
                                        <td class="align-middle text-warning">Accepted, searching for driver</td>
                                    `
                                    break
                                case ("pickingup"):
                                    toAppend = `
                                        <td class="align-middle text-info">Driver is on the way to pick up
                                        <button type="button" class="btn btn-success" onclick="updateStatus('${listing.id}', 'pickedup')">Picked up</button>
                                        </td>
                                    `
                                    break
                                case ("delivering"):
                                    toAppend = `
                                        <td class="align-middle text-info">Driver is delivering</td>
                                    `
                                    break
                                case ("delivered"):
                                    toAppend = `
                                        <td class="align-middle text-success">Delivered</td>
                                    `
                                    break
                            }

                            $("#bakeryTableBody").append(`
                                <tr>
                                    <td class="align-middle">${listing.charityName}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    ${toAppend}
                                </tr>
                            `)

                        }
                    } else {
                        for (listing of result.data) {
                            var toAppend
                            //created (charity see), accepted (vol see), picking up, delivering, delivered 
                            switch (listing.status) {
                                case ("pickingup"):
                                    toAppend = `
                                        <td class="align-middle text-info">Accepted. Please head to the bakery for pick up.</td>
                                    `
                                    break
                                case ("delivering"):
                                    toAppend = `
                                        <td class="align-middle text-info">Picked up. Please proceed with delivery.</td>
                                    `
                                    break
                                case ("delivered"):
                                    toAppend = `
                                        <td class="align-middle text-success">Delivered</td>
                                    `
                                    break
                            }

                            var address = getAddress(listing.bakeryId)

                            $("#volunteerTableBody").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.charityName}</td>
                                    <td class="align-middle">${address}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    ${toAppend}
                                </tr>
                            `)

                        }
                    }
                }

            }
        } catch (error) {
            alert("There are no listings, or there is a problem.")
        }
    })
}

function updateStatus(listingid, status) {
    $(async () => {
        var serviceUrl = "http://localhost:5004/listings/" + listingid
        if (status == "pickedup") {
            var data = JSON.stringify({
                status: "delivering"
            })
        }
        else {
            var data = JSON.stringify({
                status: "delivered"
            })
        }
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
                if (response.status == 200) {
                    alert("Listing updated.")
                    uid = "sample"
                    getListings(uid)
                }
            }
        } catch (error) {
            alert("Error updating bakery.")
        }
    })
}

function getAddress(bakeryId) {
    $(async () => {
        var serviceUrl = "http://localhost:5001/bakery/" + bakeryId
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status == 200) {
                    return result.data.bakeryAddress
                }
            }
        } catch (error) {
            alert("Error fetching bakery address.")
            return
        }
    })
}

async function convertPostal(postals) {
    var toReturn = []
    var url = "https://developers.onemap.sg/commonapi/search?searchVal=" + postals[0] + "&returnGeom=Y&getAddrDetails=Y&pageNum=1"
    var response = await fetch(url)
    var data = await response.json()
    var lat = data.results[0].LATITUDE
    var long = data.results[0].LONGITUDE
    toReturn.push({
        "lat": lat,
        "long": long
    })

    if (postals.length > 1) {
        url = "https://developers.onemap.sg/commonapi/search?searchVal=" + postals[1] + "&returnGeom=Y&getAddrDetails=Y&pageNum=1"
        var response = await fetch(url)
        var data = await response.json()
        var lat = data.results[0].LATITUDE
        var long = data.results[0].LONGITUDE
        toReturn.push({
            "lat": lat,
            "long": long
        })
    } 

    return toReturn
}

function displayMap(listingid) {
    $(async () => {
        var serviceUrl = "http://localhost:5004/listings/" + listingid
        var postals = []
        const response = await fetch(serviceUrl, {
            method: "GET"
        })
        const result = await response.json()
        if (response.ok) {
            if (response.status == 200) {
                serviceUrl = "http://localhost:5001/bakeries/" + result.data.bakeryId
                const bresponse = await fetch(serviceUrl, {
                    method: "GET"
                })
                const bresult = await bresponse.json()
                postals.push(bresult.data.postal)
                if (getUserType() != "bakery") {
                    serviceUrl = "http://localhost:5002/charities/" + result.data.charityId
                    const cresponse = await fetch(serviceUrl, {
                        method: "GET"
                    })
                    const cresult = await cresponse.json()
                    postals.push(cresult.data.postal)
                }
            }
        }

        convertPostal(postals).then(async function (result) {
            const { Map } = await google.maps.importLibrary("maps");

            const position = { lat: parseFloat(result[0].lat), lng: parseFloat(result[0].long) }

            var map = new Map(document.getElementById("map"), {
                center: position,
                zoom: 13,
            });

            new google.maps.Marker({
                position: position,
                map,
                title: "A"
            })

            if (result.length > 1) {
                new google.maps.Marker({
                    position: { lat: parseFloat(result[1].lat), lng: parseFloat(result[1].long) },
                    map,
                    title: "B"
                })
            }
            $("#cover").show()     
            $("#map").show()    
        })
    })
}

function getUserType() {
    return "charity"
}

$("#cover").click(function() {
    $("#cover").hide()
    $("#map").hide()
})