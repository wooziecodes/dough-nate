//weisheng do here

const firebaseConfig = {
    apiKey: "AIzaSyBaoic75rFEDPfz-hGlhDRfN6SQwTpeaBw",
    authDomain: "dough-nate.firebaseapp.com",
    projectId: "dough-nate",
    storageBucket: "dough-nate.appspot.com",
    messagingSenderId: "708520153741",
    appId: "1:708520153741:web:98b6ef93a1b0fc7a65c8c4",
    measurementId: "G-WTLBTLCP7K"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();

$(document).ready(function () {
    $(".newListingContainer").hide()


    // Listen for authentication state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            retrieveUserType(user.uid)
            console.log('User is signed in:', user);
        } else {
            // User is signed out
            console.log('User is signed out');
        }
    });
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
                    if (result.data.userType == "bakery") {
                        $(".newListingContainer").show()
                    }
                    showListings(result.data.userType, userid)
                }
            }
        } catch (error) {
            alert("Error retrieving user type")
        }
    })
}


function showListings(userType, userid) {
    $(async () => {
        if (userType == "bakery") {
            var serviceUrl = "http://localhost:5004/listings/" + userType + "/" + userid
        } else {
            var serviceUrl = "http://localhost:5004/listings"
        }


        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    console.log(result.data)
                    if (userType == "bakery") {
                        for (listing of result.data) {

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

                    } else if (userType == "charity") {
                        var count = 1;
                        for (listing of result.data) {
                            if (["picking up", "delivering", "delivered"].includes(listing.status) || (listing.status == "accepted" && listing.charityId == userid)) {
                                //allergens need to fix
                                $("#listings").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    <td class="align-middle">${listing.releaseTime}</td>
                                    <td class="align-middle">${listing.allergens}</td>
                                    <td class="align-middle"><button type="button" class="btn btn-secondary disabled">${listing.status}</button></td>
                                </tr>
                            `)

                            } else if (listing.status == "created") {
                                { 
                                    //allergens need to fix
                                    
                                    $("#listings").append(`
                                    <tr>
                                        <td class="align-middle">${listing.bakeryName}</td>
                                        <td class="align-middle">${listing.breadContent}</td>
                                        <td class="align-middle">${listing.releaseTime}</td>
                                        <td class="align-middle">${listing.allergens}</td>
                                        <td class="align-middle"><button type="button" class="btn btn-primary" onclick="acceptOrder(this.id)" id=${listing.id}>accept</button></td>
                                    </tr>
                                `)
    
                                }
                            }
                        count++;
                        } 
                        
                    } else if (info == "volunteer") {
                        for (listing of result.data) {
                            if (["accepted", "picking up", "delivering", "delivered"].includes(listing.status)) {
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

function addAllergen() {
    var allergen = $("#allergen").val()
    $("#allergenList").append(`
        <span class="badge text-bg-primary">${allergen}</span>
    `)
}

function addListing() {
    var breadContent = $("#breadContent").val()
    var allergens = []
    $("#allergenList").children().each(function () {
        allergens.push($(this).text())
    })
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            var serviceUrl = "http://localhost:5001/bakeries/" + user.uid
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            var bakeryName = result.data.name

            var serviceUrl = "http://localhost:5004/listings"

            data = JSON.stringify({
                allergens: allergens,
                bakeryId: user.uid,
                bakeryName: bakeryName,
                breadContent: parseInt($("#breadContent").val()),
                charityId: "",
                charityName: "",
                status: "created"
                //createTime: firestore.Timestamp.now()
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
                        alert("Listing created")
                    }
                }
            } catch (error) {
                alert("Error creating report.")
                alert(error.message)
            }
        }
    });
}
//filter by usertype

// function acceptOrder(userid) {
//     console.log(userid)
//     // document.getElementById("acceptButton"+count).innerHTML = `<button type="button" class="btn btn-secondary disabled">Accepted</button>`

// }
function acceptOrder(listingId) {
    var id = listingId

    document.getElementById(id).className = "btn btn-secondary disabled";
    document.getElementById(id).innerHTML = "accepted";


    auth.onAuthStateChanged(async (user) => {
        if (user) {


            var serviceUrl = "http://localhost:5002/charities/" + user.uid
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            var charityName = result.data.name

            var serviceUrl = "http://localhost:5004/listings/" + id 

            data = JSON.stringify({
                charityId: user.uid,
                charityName: charityName,
                status: "accepted"
                //createTime: firestore.Timestamp.now()
            })

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
    });
}

function updateStatus(listingid, status, uid) {
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
                
                }
            }
        } catch (error) {
            alert("Error updating bakery.")
        }
    })
}