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
  // getReports()
  // getListingsWithCharityId()
  //   $(".report").hide();
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      getUserId(user.uid);
    }
  });
});

function getUserId(userId) {
  $(async () => {
    var serviceUrl = "http://localhost:5006/users/" + userId
    try {
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
          var userType = result.data.userType
        }
      }
    } catch (error) {
      alert("Error retrieving user type");
    }
    var serviceUrl = "http://localhost:5004/listings/";
    switch (userType) {
      case "bakery":
        serviceUrl += "bakery/" + userId
        var type = "bakeryId"
        break;
      case "volunteer":
        serviceUrl += "volunteer/" + userId;
        var type = "volunteerId"
        break;
    }

    try {
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
          var listings = [];
          for (var listing of result.data) {
            listings.push(listing.id);
          }
          var serviceUrl = "http://localhost:5005/reports"
          var reported = []
          try {
            const response = await fetch(serviceUrl, {
              method: "GET"
            })
            const result = await response.json()
            if (response.ok) {
              if (response.status === 200) {
                // console.log(result.data)
                for (var report of result.data) {
                  if (listings.includes(report.listingId)) {
                    if (!reported.includes(report.listingId)) {
                      reported.push(report.listingId)
                    }
                  }
                  console.log(reported)
                }
                console.log(reported)
                for (var listing of reported) {
                  $("#reports").append(`
                        <option value="${listing};${userId};${userType}">${report.id}</option>
                    `);
                }

              }
            }
          } catch (error) {
            alert("There are no reports, or there is a problem.")
          }

        }
      }
    } catch (error) {
      alert("You don't have any listings to make report!")
      //   alert(error.message);
    }





  });
}

function addAppeal() {
  // var reportWho = $('#reportWho').val()
  var appealWhy = $("#appealWhy").val();
  var listingId = $("#reports").val().split(";")[0];
  var userid = $("#reports").val().split(";")[1];
  var userType = $("#reports").val().split(";")[2];
  // console.log(reportWho);

  $(async () => {
    var serviceUrl = "http://localhost:5005/reports";
    data = JSON.stringify({
      // reportWho: reportWho,
      reportText: appealWhy,
      reportedUser: listingId,
      reportedBy: userid,
      type: "Appeal",
      userType: userType,
      
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
          alert("Appeal Added");
          // $("#newReportWho").val("")
          $("#newReportText").val("");
          $("#newListingId").val("");
          $("#newReportStatus").val("");
          $("#newReportType").val("");
          // $("#newVolunteerId").val("")
          // $("#newCharityName").val("")
          // $('#newBakeryName').val('')
        }
      }
    } catch (error) {
      alert(error.message);
      console.log("reportText", reportText);
      console.log("lisitgId", listingId);
    }
  });
}
