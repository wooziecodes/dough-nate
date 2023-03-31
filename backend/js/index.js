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

                    } else if (info == "charity") {
                        for (listing of result.data) {
                            if (["created", "picking up", "delivering", "delivered"].includes(listing.status)) {
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