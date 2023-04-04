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
  $("#cover").hide();
  $("#map").hide();
  $("#report").hide();
  // Listen for authentication state changes
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      getListings(user.uid);
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
function getListings(uid) {
  $(async () => {
    var serviceUrl = "http://localhost:5006/users/" + uid;
    try {
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
          switch (result.data.userType) {
            case "charity":
              $("#charityTable").show();
              $("#report").show();
              break;
            case "bakery":
              $("#bakeryTable").show();
              break;
            case "volunteer":
              $("#volunteerTable").show();
              break;
          }
          greet(uid, result.data.userType);
          populateTable(uid, result.data.userType);
        }
      }
    } catch (error) {
      alert("There are no listings, or there is a problem.");
    }
  });
}

function greet(id, userType) {
  $(async () => {
    var serviceUrl = "http://localhost:";
    switch (userType) {
      case "charity":
        serviceUrl += "5002/charities/" + id;
        console.log('yes')
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

function populateTable(id, userType) {
  $(async () => {
    var serviceUrl = "http://localhost:5004/listings/";
    switch (userType) {
      case "charity":
        serviceUrl += "charity/" + id;
        break;
      case "bakery":
        serviceUrl += "bakery/" + id;
        break;
      case "volunteer":
        serviceUrl += "volunteer/" + id;
        break;
    }

    try {
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
          if (userType == "charity") {
            $("#charityTableBody").empty();
            for (listing of result.data) {
              var toAppend;
              //created (charity see), accepted (vol see), picking up, delivering, delivered
              switch (listing.status) {
                case "accepted":
                  toAppend = `
                                        <td class="align-middle text-warning">Searching for driver</td>
                                    `
                  break
                case ("pickingup"):
                  toAppend = `
                                        <td class="align-middle text-info">Driver is on the way to pick up</td>
                                    `;
                  break;
                case "delivering":
                  toAppend = `
                                        <td class="align-middle text-info">Driver is delivering
                                        <button type="button" class="btn" onclick="updateStatus('${listing.id}', 'delivered', '${id}')">Delivered</button>
                                        </td>
                                    `;
                  break;
                case "delivered":
                  toAppend = `
                                        <td class="align-middle text-success">Delivered</td>
                                    `;
                  break;
              }

              $("#charityTableBody").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    <td class="align-middle">${listing.allergens}</td>
                                    ${toAppend}
                                    <td class="align-middle mapbtn" onclick="displayMap('${listing.id}')">View map</td>
                                </tr>
                            `);
            }
          } else if (userType == "bakery") {
            $("#bakeryTableBody").empty();
            for (listing of result.data) {
              var toAppend;
              //created (charity see), accepted (vol see), picking up, delivering, delivered
              switch (listing.status) {
                case "created":
                  toAppend = `
                                        <td class="align-middle text-info">Created</td>
                                    `;
                  break;
                case "accepted":
                  toAppend = `
                                        <td class="align-middle text-warning">Accepted, searching for driver</td>
                                    `
                  break
                case ("pickingup"):
                  toAppend = `
                                        <td class="align-middle text-info">Driver is on the way to pick up
                                        <button type="button" class="btn" onclick="updateStatus('${listing.id}', 'pickedup', '${id}')">Picked up</button>
                                        </td>
                                    `;
                  break;
                case "delivering":
                  toAppend = `
                                        <td class="align-middle text-info">Driver is delivering</td>
                                    `;
                  break;
                case "delivered":
                  toAppend = `
                                        <td class="align-middle text-success">Delivered</td>
                                    `;
                  break;
              }

              $("#bakeryTableBody").append(`
                                <tr>
                                    <td class="align-middle">${listing.charityName
                  ? listing.charityName
                  : "-"
                }</td>
                                    <td class="align-middle">${listing.breadContent
                }</td>
                                    <td class="align-middle">${listing.allergens
                }</td>
                                    ${toAppend}
                                    <td class="align-middle mapbtn" onclick="displayMap('${listing.id
                }')">View map</td>
                                    <td class="align-middle"><button type="button" class="btn btn-danger" onclick="deleteListing('${listing.id
                }')">Delete</button></td>
                                </tr>
                            `);
            }
          } else {
            for (listing of result.data) {
              var toAppend;
              //created (charity see), accepted (vol see), picking up, delivering, delivered
              switch (listing.status) {
                case "pickingup":
                  toAppend = `
                                        <td class="align-middle text-info">Accepted. Please head to the bakery for pick up.</td>
                                    `;
                  break;
                case "delivering":
                  toAppend = `
                                        <td class="align-middle text-info">Picked up. Please proceed with delivery.</td>
                                    `;
                  break;
                case "delivered":
                  toAppend = `
                                        <td class="align-middle text-success">Delivered</td>
                                    `;
                  break;
              }

              await getAddress(listing.bakeryId).then((address) => {
                $("#volunteerTableBody").append(`
                                <tr>
                                    <td class="align-middle">${listing.bakeryName}</td>
                                    <td class="align-middle">${listing.charityName}</td>
                                    <td class="align-middle">${address}</td>
                                    <td class="align-middle">${listing.breadContent}</td>
                                    ${toAppend}
                                    <td class="align-middle mapbtn" onclick="displayMap('${listing.id}')">View map</td>
                                </tr>
                            `);
              });
            }
          }
        }
      }
    } catch (error) {
      alert("There are no listings, or there is a problem.");
    }
  });
}

function updateStatus(listingid, status, uid) {
  $(async () => {
    var serviceUrl = "http://localhost:5004/listings/" + listingid;
    if (status == "pickedup") {
      var data = JSON.stringify({
        status: "delivering",
      });
    } else {
      var data = JSON.stringify({
        status: "delivered",
      });
    }
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
          alert("Listing updated.");
          getListings(uid);
        }
      }
    } catch (error) {
      alert("Error updating bakery.");
    }
  });
}

async function getAddress(bakeryId) {
  var serviceUrl = "http://localhost:5001/bakeries/" + bakeryId;
  try {
    const response = await fetch(serviceUrl, {
      method: "GET",
    });
    const result = await response.json();
    if (response.ok) {
      if (response.status == 200) {
        return result.data.bakeryAddress;
      }
    }
  } catch (error) {
    alert("Error fetching bakery address.");
    return;
  }
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

function displayMap(listingid) {
  var serviceUrl = "http://localhost:5030/getMapInfo";
  $(async () => {
    const response = await fetch(serviceUrl, {
      method: "GET",
    });
  })

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

async function deleteListing(listingId) {
  var serviceUrl = "http://localhost:5004/listings/" + listingId;
  try {
    const response = await fetch(serviceUrl, {
      method: "DELETE",
    });
    // const result = await response.json()
    if (response.ok) {
      if (response.status == 200) {
        alert("Listing deleted successfully");
        location.reload();
      }
    }
  } catch (error) {
    alert("Error deleting listing.");
    return;
  }
}

$("#cover").click(function () {
  $("#cover").hide();
  $("#map").hide();
});
