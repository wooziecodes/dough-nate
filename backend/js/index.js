//weisheng do here

const firebaseConfig = {
  apiKey: "AIzaSyBaoic75rFEDPfz-hGlhDRfN6SQwTpeaBw",
  authDomain: "dough-nate.firebaseapp.com",
  projectId: "dough-nate",
  storageBucket: "dough-nate.appspot.com",
  messagingSenderId: "708520153741",
  appId: "1:708520153741:web:98b6ef93a1b0fc7a65c8c4",
  measurementId: "G-WTLBTLCP7K",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();
const date = new Date().getTime();
const newdate = new Date(date + 1.5 * 60 * 60 * 1000);

$(document).ready(function () {
  $(".newListingContainer").hide();
  $(".report").hide();
  $("#cover").hide();
  $("#map").hide();

  // Listen for authentication state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      retrieveUserType(user.uid);

      console.log("User is signed in:", user);
    } else {
      // User is signed out\
      console.log("User is signed out");
    }
  });

  console.log(newdate);
});

function greet(id, userType) {
  console.log(id, userType);
  $(async () => {
    var serviceUrl = "http://localhost:";
    switch (userType) {
      case "charity":
        console.log("hi");
        serviceUrl += "5002/charities/" + id;
        break;
      case "bakery":
        serviceUrl += "5001/bakeries/" + id;
        break;
      case "volunteer":
        serviceUrl += "5003/volunteers/" + id;
        break;
    }

    const response = await fetch(serviceUrl, {
      method: "GET",
    });
    const result = await response.json();
    if (response.ok) {
      if (response.status === 200) {
        $("#welcome").text("Welcome, " + result.data.name + "!");
      }
    }
  });
}

function retrieveUserType(userid) {
  $(async () => {
    var serviceUrl = "http://localhost:5006/users/" + userid;
    try {
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
          if (result.data.userType == "bakery") {
            $(".newListingContainer").show();
          }

          greet(userid, result.data.userType);
          showListings(result.data.userType, userid);
        }
      }
    } catch (error) {
      alert("Error retrieving user type");
    }
  });
}

function showListings(userType, userid) {
  $(async () => {
    if (userType == "bakery") {
      var serviceUrl =
        "http://localhost:5004/listings/" + userType + "/" + userid;
    } else {
      var serviceUrl = "http://localhost:5004/listings";
    }

    try {
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
            console.log('yes')
          $("#appendCard").empty();

          if (userType == "charity") {
            $(".report").show();
            let count = 0;
            let cardHtml = "";

<<<<<<< Updated upstream
            for (listing of result.data) {
              if (listing.status == "created") {
                count++;
=======
        try {
            const response = await fetch(serviceUrl, {
                method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
                if (response.status === 200) {
                    console.log(result.data)
                    if (userType == "charity") {
                        $(".report").show()
                        $("#listingsTable").append(`
                        <h1>All Listings</h1>
                        <table class="table">
                        <thead>
                          <tr style="font-weight: bolder !important">
                            <th scope="col">Bakery Name</th>
                            <th scope="col">Bread Content</th>
                            <th scope="col">Release Time</th>
                            <th scope="col">Allergens</th>
                            <th scope="col">Status</th>
                          </tr>
                        </thead>
                        <tbody id="listings"></tbody>
                      </table>`)
                        for (listing of result.data) {
                            if (listing.status == "created") {
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
     
                        } 
                        
                    } else if (userType == "volunteer") {
                        $("#listingsTable").append(`
                        <h1>All Listings</h1>
                        <table class="table">
                        <thead>
                          <tr style="font-weight: bolder !important">
                            <th scope="col">Bakery Name</th>
                            <th scope="col">Charity Name</th>
                            <th scope="col">Bread Content</th>
                            <th scope="col">Release Time</th>
                            <th scope="col">Allergens</th>
                            <th scope="col">Status</th>
                            <th scope="col"></th>
                          </tr>
                        </thead>
                        <tbody id="listings"></tbody>
                      </table>
                      `)
                        for (listing of result.data) {
                            if (listing.status == "accepted") {
                                { 
                                    //allergens need to fix
                                    
                                    $("#listings").append(`
                                    <tr>
                                        <td class="align-middle">${listing.bakeryName}</td>
                                        <td class="align-middle">${listing.charityName}</td>
                                        <td class="align-middle">${listing.breadContent}</td>
                                        <td class="align-middle">${listing.releaseTime}</td>
                                        <td class="align-middle">${listing.allergens}</td>
                                        <td class="align-middle"><button type="button" class="btn btn-primary" onclick="pickUpOrder(this.id)" id=${listing.id}>pick up</button></td>
                                        <td class="align-middle mapbtn" onclick="displayMap('${listing.id}')">View map</td>
                                    </tr>
                                `)
    
                                }
                            }
>>>>>>> Stashed changes

                //allergens need to fix
                cardHtml += `
          <div class="col-md-3">
            <div class="card p-4" style="width: 18rem; display:inline-block; background-color: #faf7f5">
              <div id="card-body">
                <div class="cardTitle align-middle">Bakery Name:</div>
                <div class="cardDetails">${listing.bakeryName}</div>
                
                <div class="cardTitle align-middle">Bread Content:</div>
                <div class="cardDetails">${listing.breadContent}</div>
                <div class="cardTitle align-middle">Release Time:</div>
                <div class="cardDetails">${listing.releaseTime}</div>
                <div class="cardTitle align-middle">Allergens:</div>
                <div class="cardDetails">${listing.allergens}</div>
                <div style="display: flex; justify-content: center;" class="gap-4 mt-3">
                <button type="button" class="btn" onclick="acceptOrder(this.id)" id=${listing.id}>Accept</button>
                </div>
              </div>
            </div>
          </div>
        `;

                // Add a new row after every 4 cards
                if (count % 4 == 0) {
                  $("#appendCard").append(`<div class="row">${cardHtml}</div>`);
                  cardHtml = "";
                }
              }
            }

            // Add the remaining cards
            if (cardHtml != "") {
              $("#appendCard").append(`<div class="row">${cardHtml}</div>`);
            }
            // $("#listingsTable").append(`
            //             <table class="table">
            //             <thead>
            //               <tr style="font-weight: bolder !important">
            //                 <th scope="col">Bakery Name</th>
            //                 <th scope="col">Bread Content</th>
            //                 <th scope="col">Release Time</th>
            //                 <th scope="col">Allergens</th>
            //                 <th scope="col">Status</th>
            //               </tr>
            //             </thead>
            //             <tbody id="listings"></tbody>
            //           </table>`);
            // for (listing of result.data) {
            //   if (listing.status == "created") {
            //     {
            //       //allergens need to fix

            //       $("#listings").append(`
            //                         <tr>
            //                             <td class="align-middle">${listing.bakeryName}</td>
            //                             <td class="align-middle">${listing.breadContent}</td>
            //                             <td class="align-middle">${listing.releaseTime}</td>
            //                             <td class="align-middle">${listing.allergens}</td>
            //                             <td class="align-middle"><button type="button" class="btn btn-primary" onclick="acceptOrder(this.id)" id=${listing.id}>accept</button></td>
            //                         </tr>
            //                     `);
            //     }
            //   }
            // }
          } else if (userType == "volunteer") {
            let count = 0;
            let cardHtml = "";

            for (listing of result.data) {
              if (listing.status == "accepted") {
                count++;

                //allergens need to fix
                cardHtml += `
          <div class="col-md-3">
            <div class="card p-4" style="width: 18rem; display:inline-block; background-color: #faf7f5">
              <div id="card-body">
                <div class="cardTitle align-middle">Bakery Name:</div>
                <div class="cardDetails">${listing.bakeryName}</div>
                <div class="cardTitle align-middle">Charity Name:</div>
                <div class="cardDetails">${listing.charityName}</div>
                <div class="cardTitle align-middle">Bread Content:</div>
                <div class="cardDetails">${listing.breadContent}</div>
                <div class="cardTitle align-middle">Release Time:</div>
                <div class="cardDetails">${listing.releaseTime}</div>
                <div class="cardTitle align-middle">Allergens:</div>
                <div class="cardDetails">${listing.allergens}</div>
                <div style="display: flex; justify-content: center;" class="gap-4 mt-3">
                <button type="button" class="btn" onclick="pickUpOrder(this.id)" id=${listing.id}>pick up</button>
                <button type="button" class="btn" style="text-decoration: none; background-color:#E2B582; " onclick="displayMap('${listing.id}')">View map</button>
                </div>
              </div>
            </div>
          </div>
        `;

                // Add a new row after every 4 cards
                if (count % 4 == 0) {
                  $("#appendCard").append(`<div class="row">${cardHtml}</div>`);
                  cardHtml = "";
                }
              }
            }

            // Add the remaining cards
            if (cardHtml != "") {
              $("#appendCard").append(`<div class="row">${cardHtml}</div>`);
            }
          }
        }
      }
    } catch (error) {
      alert("Error generating listings");
    }
  });
}

function addAllergen() {
  var allergen = $("#allergen").val();
  $("#allergenList").append(`
        <span class="badge text-bg-primary">${allergen}</span>
    `);
  $("#allergen").val("");
}

function addListing() {
  var breadContent = $("#breadContent").val();
  var allergens = [];

<<<<<<< Updated upstream
  $("#allergenList")
    .children()
    .each(function () {
      allergens.push($(this).text());
    });
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      var serviceUrl = "http://localhost:5001/bakeries/" + user.uid;
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      var bakeryName = result.data.name;

      var serviceUrl = "http://localhost:5004/listings";
      const date = new Date();
      const date2 = new Date(date.getTime() + 3 * 60 * 60 * 1000);

      const utcDate = date.toUTCString();
      const utcDate2 = date2.toUTCString();

      data = JSON.stringify({
        allergens: allergens,
        bakeryId: user.uid,
        bakeryName: bakeryName,
        breadContent: parseInt($("#breadContent").val()),
        charityId: "",
        charityName: "",
        status: "created",
        createTime: utcDate,
        releaseTime: utcDate2,
        deliverBy: "",
        volunteerId: "",
      });

      try {
        const response = await fetch(serviceUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: data,
        });
        const result = await response.json();
        if (response.ok) {
          if (response.status == 201) {
            alert("Listing created");
          }
        }
      } catch (error) {
        alert("Error creating report.");
        alert(error.message);
      }
    }
  });
=======
            var serviceUrl = "http://localhost:5004/listings"
            const date = new Date();
            const date2 = new Date(date.getTime() + 3 * 60 * 60 * 1000)
            
            const utcDate = date.toUTCString();
            const utcDate2 = date2.toUTCString();

            data = JSON.stringify({
                allergens: allergens,
                bakeryId: user.uid,
                bakeryName: bakeryName,
                breadContent: parseInt($("#breadContent").val()),
                charityId: "",
                charityName: "",
                status: "created",
                createTime: utcDate,
                releaseTime: utcDate2,
                deliverBy: "",
                volunteerId: ""
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
                        $("#allergenList").empty()
                        allergens = []
                        $("#breadContent").val("")

                    }
                }
            } catch (error) {
                alert("Error creating report.")
                alert(error.message)
            }

        }
    });

>>>>>>> Stashed changes
}
//filter by usertype

// function acceptOrder(userid) {
//     console.log(userid)
//     // document.getElementById("acceptButton"+count).innerHTML = `<button type="button" class="btn btn-secondary disabled">Accepted</button>`

// }
function acceptOrder(listingId) {
  var id = listingId;

  document.getElementById(id).className = "btn disabled";
  document.getElementById(id).innerHTML = "accepted";

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      var serviceUrl = "http://localhost:5002/charities/" + user.uid;
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      var charityName = result.data.name;

      var serviceUrl = "http://localhost:5004/listings/" + id;

      data = JSON.stringify({
        charityId: user.uid,
        charityName: charityName,
        status: "accepted",
        //createTime: firestore.Timestamp.now()
      });

      try {
        const response = await fetch(serviceUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: data,
        });
        const result = await response.json();
        if (response.ok) {
          if (response.status == 200) {
            alert("Accepted");
            retrieveUserType(user.uid);
          }
        }
      } catch (error) {
        alert("Error creating report.");
        alert(error.message);
      }
    }
  });
}
function pickUpOrder(listingId) {
  var id = listingId;

  document.getElementById(id).className = "btn disabled";
  //   document.getElementById(id).style = `font-size: 1px`

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      var serviceUrl = "http://localhost:5003/volunteers/" + user.uid;
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      var volunteerName = result.data.name;

      var serviceUrl = "http://localhost:5004/listings/" + id;
      const date = new Date().getTime;
      const date2 = new Date(date + 1.5 * 60 * 60 * 1000);

      const utcDate = date2.toUTCString();

      data = JSON.stringify({
        volunteerId: user.uid,
        volunteerName: volunteerName,
        status: "pickingup",
        deliverBy: utcDate,
      });

      try {
        const response = await fetch(serviceUrl, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "PUT",
          body: data,
        });
        console.log(response);
        const result = await response.json();
        if (response.ok) {
          if (response.status == 200) {
            alert("Listing picked up. Please proceed with delivery.");
            retrieveUserType(user.uid);
          }
        }
      } catch (error) {
        alert("Error creating report.");
        alert(error.message);
      }
    }
  });
}

function displayMap(listingid) {
  $(async () => {
    var serviceUrl = "http://localhost:5004/listings/" + listingid;
    var postals = [];
    const response = await fetch(serviceUrl, {
      method: "GET",
    });
    const result = await response.json();
    if (response.ok) {
      if (response.status == 200) {
        serviceUrl = "http://localhost:5001/bakeries/" + result.data.bakeryId;
        const bresponse = await fetch(serviceUrl, {
          method: "GET",
        });
        const bresult = await bresponse.json();
        postals.push({
          postal: bresult.data.postal,
          name: bresult.data.name,
        });
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            // User is signed in
            var serviceUrl = "http://localhost:5006/users/" + user.uid;
            try {
              const response = await fetch(serviceUrl, {
                method: "GET",
              });
              const uresult = await response.json();
              if (response.ok) {
                if (response.status === 200) {
                  userType = uresult.data.userType;
                  if (userType != "bakery" || result.data.charityId != "") {
                    serviceUrl =
                      "http://localhost:5002/charities/" +
                      result.data.charityId;
                    const cresponse = await fetch(serviceUrl, {
                      method: "GET",
                    });
                    const cresult = await cresponse.json();
                    postals.push({
                      postal: cresult.data.postal,
                      name: cresult.data.name,
                    });
                  }
                  convertPostal(postals).then(async function (result) {
                    const { Map } = await google.maps.importLibrary("maps");

                    const position = {
                      lat: parseFloat(result[0].lat),
                      lng: parseFloat(result[0].long),
                    };

                    var map = new Map($("#map")[0], {
                      center: position,
                      zoom: 13,
                    });

                    new google.maps.Marker({
                      position: position,
                      map,
                      title: result[0].name,
                    });

                    if (result.length > 1) {
                      new google.maps.Marker({
                        position: {
                          lat: parseFloat(result[1].lat),
                          lng: parseFloat(result[1].long),
                        },
                        map,
                        title: result[1].name,
                      });
                    }
                    $("#cover").show();
                    $("#map").show();
                  });
                }
              }
            } catch (error) {
              alert(error);
            }
          }
        });
      }
    }
  });
}

async function convertPostal(postals) {
  var toReturn = [];
  var url =
    "https://developers.onemap.sg/commonapi/search?searchVal=" +
    postals[0]["postal"] +
    "&returnGeom=Y&getAddrDetails=Y&pageNum=1";
  var response = await fetch(url);
  var data = await response.json();
  var lat = data.results[0].LATITUDE;
  var long = data.results[0].LONGITUDE;
  toReturn.push({
    lat: lat,
    long: long,
    name: postals[0]["name"],
  });

  if (postals.length > 1) {
    url =
      "https://developers.onemap.sg/commonapi/search?searchVal=" +
      postals[1]["postal"] +
      "&returnGeom=Y&getAddrDetails=Y&pageNum=1";
    var response = await fetch(url);
    var data = await response.json();
    var lat = data.results[0].LATITUDE;
    var long = data.results[0].LONGITUDE;
    toReturn.push({
      lat: lat,
      long: long,
      name: postals[1]["name"],
    });
  }

  return toReturn;
}

$("#cover").click(function () {
  $("#cover").hide();
  $("#map").hide();
});
