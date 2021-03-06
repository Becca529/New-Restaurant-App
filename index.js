'use strict';

const endPoint = "https://rebecca-proxy.herokuapp.com/search?";
const apiKey = "L5ajM8gfrQwxwZ3bNzPL8C-x9gEJFLw0_1uyMy8uX8OYlrSgcf-ycpV8KJb2IHkZLR44a58d9Pj9bTCbl_qLccf6ARo48L3yANun1U9Vrkr0QNXtIggADvacgtmGW3Yx"

//Captures zip code from text input and pass it to getDataFromAPI()
function submitButton() {
  $('.js-search-results').html("");
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-search-location');
    const query = queryTarget.val();
    $('.js-search-location').val("");
    $('.js-results-title').html("Results for " + query);
    getDataFromApi(query, displaySearchData);
  });
}

// .ajax method to retrieve and display data from Yelp API
function getDataFromApi(searchTerm, callback) {
  displayLoadingMessage();
  $('.js-search-results').html();
  const settings = {
    url: endPoint,
    data: {
      term: 'restaurant',
      location: `${searchTerm}`,
      limit: 40,
      attributes: 'hot_and_new'
    },
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);

}

//Displays search results on page by calling renderResult() for each returned search item
function displaySearchData(data) {
  console.log(data.businesses.length);
  if (data.businesses.length === 0) {
    const results = noRestaurantsMessage();
    $('.js-search-results').prop('hidden', false);
    $('.js-search-results').html(results);
  }
   else {
    const results = data.businesses.map((item, index) => renderResult(item));
    $('.js-search-results').prop('hidden', false);
    $('.js-search-results').html(results);
   }
}

function noRestaurantsMessage() {
  return `
  <p> No restaurants currently available for that zip code</p>
  `
}
function displayLoadingMessage() {
  const loadMessage = `
  <div class="loader"></div>`
  $('.js-search-results').html(loadMessage);
}

//Renders returned search items
function renderResult(result) {
  let categoriesArray = result.categories.map((item, index) => item.title);
  let price = checkIfMissing(result);
  let phoneNumber = checkIfEmpty(result);


  return `
      <div class = "result   col-4">
        <div class= "result-image">
          <img class= "rest-image" src="${result.image_url}">
        </div>
        <div class="rest-name-container">
          <h2 class = "rest-name">${result.name}</h2>
        </div>
        <div class="rest-details">
            <h3 class="category">${categoriesArray.join(", ")}</h3>
            <ul class = "rest-rating">
              <li class="yelp-review-link">Yelp Review: <a target="_blank" href="${result.url}">${result.rating}/5</a></li>
              <li># Reviewers: ${result.review_count}</li>
              <li>Price: ${price}</li>
            </ul>
            <p class="address"> ${result.location.display_address}</p>
            <p class="phone-number">${phoneNumber}</p>
            <div class="results-links">
              <a href="https://www.google.com/maps/dir/?api=1&destination=${result.location.display_address}&travelmode=driving" class="link-btn" target="_blank">Get Driving Directions<span class="arrow">></span></a>
              <a href="https://m.uber.com/ul/?action=setPickup&client_id=fr5WnHzC0LfJYA4NzW8bwH_eS42b1oEx&pickup=my_location&dropoff[formatted_address]=${result.location.display_address}&dropoff[latitude]=${result.coordinates.latitude}&dropoff[longitude]=${result.coordinates.longitude}" class="link-btn" target="_blank">Get an Uber<span class="arrow">></span></a>
            </div>
          </div>
      </div>
    `
}

function checkIfMissing (result) {
 if (result.hasOwnProperty("price") != true) {
  return "N/a";
 }
 else return result.price;
}

function checkIfEmpty (result) {
  if (result.display_phone == "") {
   return "Phone: N/a";
  }
  else return result.display_phone
 }


// when the page loads call submitButton
$(submitButton); 
