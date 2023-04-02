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
      getListingsWithCharityId(user.uid);
    }
  });
});

function getListingsWithCharityId(charityId) {
  $(async () => {
    // charityId = 'rF0Wu8ezcsfKDPbCqf7hc3q2Jm62'
    var serviceUrl = "http://localhost:5004/listings/charity/" + charityId;

    try {
      const response = await fetch(serviceUrl, {
        method: "GET",
      });
      const result = await response.json();
      if (response.ok) {
        if (response.status === 200) {
          console.log(result.data[0].id);

          const bakeryName = [];
          const createdTime = [];
          const listingId = [];
          for (let i = 0; i < result.data.length; i++) {
            // console.log(i);
            console.log(result.data[i].createTime);
            bakeryName.push(result.data[i].bakeryName);
            createdTime.push(result.data[i].createTime);
            listingId.push(result.data[i].id);
          }

          if (bakeryName.length == 1) {
            $("#bakeryName").empty();
            $("#bakeryName").append(`
                            <option value="${bakeryName}">${bakeryName} | </option>
                        `);
          } else {
            console.log("meow");
            $("#bakeryName").empty();
            for (let i = 0; i < bakeryName.length; i++) {
              // const bakeryname = result.data[0].bakeryName[i]

              $("#bakeryName").append(`
                                <option class='option' value="${listingId[i]}">${bakeryName[i]} || ${createdTime[i]}</option>
                            `);
            }
          }
        }
      }
    } catch (error) {
      // alert("nihaoma")
      alert(error.message);
    }
  });
}

function addReport() {
  // var reportWho = $('#reportWho').val()
  var reportText = $("#reportText").val();
  var listingId = $("#bakeryName").val();
  // console.log(reportWho);

  $(async () => {
    var serviceUrl = "http://localhost:5005/reports";
    data = JSON.stringify({
      // reportWho: reportWho,
      reportText: reportText,
      listingId: listingId,
      reportStatus: "reviewing",
      reportType: "bakery",
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
          alert("Report added");
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
