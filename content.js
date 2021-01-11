var pageNo = 1;
var query = "";
let temp_value = "";
chrome.storage.local.get(["phasersTo"], function (items) {
  query += items.phasersTo
    .map((val, ind) => {
      return val + " OR ";
    })
    .join("");
  temp_value += items.phasersTo
    .map((val, ind) => {
      if (ind === items.phasersTo.length - 1) {
        return val;
      }
      return val + ",";
    })
    .join("");
  query += items.phasersTo[items.phasersTo.length - 1];
  refreshPage();
  console.log("inside map", query);
});
console.log("inside query", query);
function refreshPage() {
  console.log("query", query);
  $("#queryBox").val(temp_value);
  chrome.runtime.sendMessage(
    { type: "getUrls", pageNo: pageNo, query: "(" + query + ")" },
    function (response) {
      $("#pageNumber").html(pageNo);

      console.log("Sent Something");
      console.log(response);

      $("#totalResults").html(response.totalResults);

      $("#feed").empty();

      for (var k in response.articles) {
        list_item =
          "<span class='parss-title'><a href='" +
          response.articles[k].url +
          "'>" +
          response.articles[k].title +
          "</a></span>";
        list_item +=
          "<span class='parss-date'>" +
          response.articles[k].publishedAt +
          "</span>";
        list_item +=
          "<span class='parss-image'><img width='60px' height='60px' src='" +
          response.articles[k].urlToImage +
          "'></img></span>";
        list_item +=
          "<span class='parss-description'>" +
          response.articles[k].description +
          "</span>";

        $("#feed").append("<li>" + list_item + "</li>");
      }
    }
  );
}

function nextPage() {
  pageNo = pageNo + 1;
  refreshPage();
}

function previousPage() {
  if (pageNo < 2) return;
  pageNo = pageNo - 1;
  refreshPage();
}

document.addEventListener("click", function (e) {
  console.log(e.srcElement.attributes[0].nodeValue);
  if (e.target.nodeName == "A") {
    var win = window.open(e.srcElement.attributes[0].nodeValue, "_blank");
    if (win) win.focus();

    return;
  }
  if (e.target.id == "queryBoxSubmit") {
    console.log("Caught Query Box");
    console.log($("#queryBox").val());
    let value = $("#queryBox").val();
    let temp_query = value.split(",");
    chrome.storage.local.get(["phasersTo"], function (items) {
      console.log("items:", items);
    });
    // chrome.storage.local.get(
    //   /* String or Array */ ["phasersTo"],
    //   function (items) {
    //     let temp = items.phasersTo;
    //     // console.log("temp", temp);
    //     // console.log("items.phasers", items.phasersTo);

    // temp.push(temp_query);
    chrome.storage.local.set({ phasersTo: temp_query }, function () {
      //  Data's been saved boys and girls, go on home
      $("#queryBox").val(temp_value);
      console.log("Stored Locally");
    });
    //   }
    // );

    refreshPage();
  }
  console.log(e);
  console.log(e.target.id);
  switch (e.target.id) {
    case "nextPage":
      nextPage();
      break;
    case "previousPage":
      previousPage();
      break;
  }
});

refreshPage();
