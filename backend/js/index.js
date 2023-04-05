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
    }
  });
});

function logOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
      window.location.href = "login.html";
    })
    .catch((error) => {
      // An error happened.
    });
}

function greet(id, userType) {
  $(async () => {
    var serviceUrl = "http://localhost:";
    switch (userType) {
      case "charity":
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
            $("#current").text("Create Listing");
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
          $("#appendCard").empty();

          if (userType == "charity") {
            $(".report").show();
            let count = 0;
            let cardHtml = `<h1 class="mb-5">All Listings</h1>`;
            let rowsHtml = "";

            for (listing of result.data) {
              // Only show listings that meet the criteria
              if (listing.status == "created" && !listing.hidden) {
                // Build HTML for the card
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
            <div class="cardDetails">${listing.allergens.length > 0 ? listing.allergens : "-"
                  }</div>
            <div style="display: flex; justify-content: center;" class="gap-4 mt-3">
              <button type="button" class="btn" onclick="acceptOrder(this.id)" id=${listing.id
                  }>Accept</button>
            </div>
          </div>
        </div>
      </div>
    `;

                // Increment the counter
                count++;

                // If we have four or more cards, add a new row and reset the card HTML
                if (count % 4 == 0) {
                  rowsHtml += `<div class="row">${cardHtml}</div>`;
                  cardHtml = "";
                }
              }
            }

            // If there are remaining cards, add them to the last row
            if (cardHtml != "") {
              rowsHtml += `<div class="row">${cardHtml}</div>`;
            }

            // If there are no cards, show a message
            if (count == 0) {
              rowsHtml = `
    <h2 class="row" style="
      justify-content: center;
      max-width: 700px;
      padding: 15px 0;
      border: 1px dotted #56381c;
      border-radius: 14px;
      background-color:#fff6ee;
      margin: 200px auto;
    ">There are no Listings to show!</h2>
  `;
            }

            // Add the rows to the DOM
            $("#appendCard").empty().append(rowsHtml);
          } else if (userType == "volunteer") {
            let count = 0;
            let cardHtml = `<h1 class="mb-5">All Listings</h1>`;
            for (listing of result.data) {
              if (listing.status == "accepted") {
                count++;

                //allergens need to fix
                cardHtml += `
                            <div class="col-md-3">
                            <div class="card p-4" style="width: 18rem; display:inline-block; background-color: #faf7f5">
                                <div id="card-body">
                                <div class="cardTitle align-middle">Bakery Name:</div>
                                <div class="cardDetails">${listing.bakeryName
                  }</div>
                                <div class="cardTitle align-middle">Charity Name:</div>
                                <div class="cardDetails">${listing.charityName
                  }</div>
                                <div class="cardTitle align-middle">Bread Content:</div>
                                <div class="cardDetails">${listing.breadContent
                  }</div>
                                <div class="cardTitle align-middle">Release Time:</div>
                                <div class="cardDetails">${listing.releaseTime
                  }</div>
                                <div class="cardTitle align-middle">Allergens:</div>
                                <div class="cardDetails">${listing.allergens.length > 0
                    ? listing.allergens
                    : "-"
                  }</div>
                                <div style="display: flex; justify-content: center;" class="gap-4 mt-3">
                                <button type="button" class="btn" onclick="pickUpOrder(this.id)" id=${listing.id
                  }>pick up</button>
                                <button type="button" class="btn" style="text-decoration: none; background-color:#E2B582; " onclick="displayMap('${listing.id
                  }')">View map</button>
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
            if (count == 0) {
              $("#appendCard").append(
                `<h2 class="row"
                  style="
                  justify-content: center; 
                  max-width: 700px;
                  padding: 15px 0;
                  border: 1px dotted #56381c;
                  border-radius: 14px;
                  background-color:#fff6ee;
                  margin: 200px auto;
                  color: #56381c !important;
                      ">There are no Listings to show!</h2>`
              );
              cardHtml = "";
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
  if (allergen) {
    $("#allergenList").append(`
        <span class="badge text-bg-primary">${allergen}</span>
    `);
    $("#allergen").val("");
  } else {
    document.getElementById("error-allergen").style.display = "block";
  }
}

function addListing() {
  if ($("#breadContent").val() == "") {
    document.getElementById("error-bread").style.display = "block";
  } else {
    var allergens = [];

    $("#allergenList")
      .children()
      .each(function () {
        allergens.push($(this).text());
      });
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const date = new Date();
        const date2 = new Date(date.getTime() + 3 * 60 * 60 * 1000);

        const utcDate = date.toUTCString();
        const utcDate2 = date2.toUTCString();

        data = JSON.stringify({
          uid: user.uid,
          breadContent: parseInt($("#breadContent").val()),
          allergens: allergens,
          utcDate: utcDate,
          utcDate2: utcDate2,
        });

        var serviceUrl = "http://localhost:5020/addListing";
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
            if (response.status == 200) {
              alert("Listing created");
              $("#allergenList").empty();
              allergens = [];
              $("#breadContent").val("");
            }
          }
        } catch (error) {
          // alert("Error creating report.");
          // alert(error.message);
          document.getElementById("error-submit").style.display = "block";
        }
      }
    });
  }
}

function acceptOrder(listingId) {
  var id = listingId;
  // var serviceUrl = "http://localhost:5002"
  document.getElementById(id).className = "btn disabled";
  document.getElementById(id).innerHTML = "accepted";

  auth.onAuthStateChanged(async (user) => {
    if (user) {
      data = JSON.stringify({
        uid: user.uid,
        listingId: id,
      });
      var serviceUrl = "http://localhost:5038/order";
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
      // const response = await fetch(serviceUrl, {
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json",
      //   },
      //   method: "POST",
      //   body: obj
      // });
      // const result = await response.json();
      // if (response.ok) {
      //   if (response.satus == 200){
      //     alert("Accepted")
      //     retrieveUserType(user.uid)
      //   }
      // }

      // var serviceUrl = "http://localhost:5002/charities/" + user.uid;
      // const response = await fetch(serviceUrl, {
      //   method: "GET",
      // });
      // const result = await response.json();
      // var charityName = result.data.name;

      // var serviceUrl = "http://localhost:5004/listings/" + id;

      // data = JSON.stringify({
      //   charityId: user.uid,
      //   charityName: charityName,
      //   status: "accepted",
      //   //createTime: firestore.Timestamp.now()
      // });

      // try {
      //   const response = await fetch(serviceUrl, {
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //     method: "PUT",
      //     body: data,
      //   });
      //   const result = await response.json();
      //   if (response.ok) {
      //     if (response.status == 200) {
      //       alert("Accepted");
      //       retrieveUserType(user.uid);
      //     }
      //   }
      // } catch (error) {
      //   alert("Error creating report.");
      //   alert(error.message);
      // }
    }
  });
}
function pickUpOrder(listingId) {
  var id = listingId;

  document.getElementById(id).className = "btn disabled";
  //   document.getElementById(id).style = `font-size: 1px`

  auth.onAuthStateChanged(async (user) => {
    const date = new Date().getTime();
    const date2 = new Date(date + 1.5 * 60 * 60 * 1000);
    const utcDate = date2.toUTCString();
    if (user) {
      data = JSON.stringify({
        uid: user.uid,
        listingId: listingId,
        utcDate: utcDate,
      });
      var serviceUrl = "http://localhost:5033/pickup"
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
          alert("Accepted. Please proceed with pickup.");
          retrieveUserType(user.uid);
        }
      }
    }
  });
}

async function displayMap(listingid) {
  var serviceUrl = "http://localhost:5030/getMapInfo/" + listingid;
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      serviceUrl += "/" + user.uid;

      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      postals = result.data;
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
