let lastSearch = "";
let cachedNumber = 0;
let canScroll = true;

$(document).ready(function () {
  updateView(true);
  search();
  scrollPlaces();
});

// Favorites Events
function addFavoriteOrUnfavorite(
  $targetElement1,
  $targetElement2,
  onEvent = "click"
) {
  $targetElement1.on(onEvent, function () {
    const element = $(this);
    $.ajax({
      url: `api/${$(this).attr("place")}/favorite`,
      headers: {
        "X-CSRFToken": $("#csrf-token").attr("content"),
      },
      method: "POST",
      success: function (_response) {
        $targetElement2.fadeIn();
        element.fadeOut();
      },
      error: function (xhr, _status, _error) {
        console.error(xhr.responseText);
      },
    });
  });

  $targetElement2.on(onEvent, function () {
    const element = $(this);
    $.ajax({
      url: `api/${$(this).attr("place")}/favorite`,
      headers: {
        "X-CSRFToken": $("#csrf-token").attr("content"),
      },
      method: "POST",
      success: function (_response) {
        $targetElement1.fadeIn();
        element.fadeOut();
      },
      error: function (xhr, _status, _error) {
        console.error(xhr.responseText);
      },
    });
  });
}

// Get Places Events
function search() {
  function updateSearch() {
    let searchTerm = $("#search").val();

    if (searchTerm != lastSearch) {
      cachedNumber = 0;
      lastSearch = searchTerm;
      updateView(true);
    }
  }

  $("#searchForm").submit(function (event) {
    event.preventDefault();
    updateSearch();
  });

  $("#search-submit").on("click", function () {
    updateSearch();
  });
}

function scrollPlaces() {
  $(window).scroll(function () {
    if (
      canScroll &&
      $(window).scrollTop() + $(window).height() >= $(document).height() - 100
    ) {
      canScroll = false;
      setTimeout(function () {
        canScroll = true;
      }, 2000);
      updateView(false);
    }
  });
}

function updateView(deleteBefore) {
  $.ajax({
    url: `api/getPlaces`,
    method: "GET",
    data: {
      search: lastSearch,
      cachedNumber: cachedNumber,
      mode: mode1,
    },
    success: function (response) {
      cachedNumber += response.result.length;
      insertPlaces(response.result, deleteBefore);
    },
    error: function (xhr, _status, _error) {
      console.error(xhr.responseText);
    },
  });
}

function getOtherDependenciesAndInsert(places, i) {
  function isFavoritePlace(places, i) {
    $.ajax({
      url: `api/${places[i].id}/favorite`,
      method: "GET",
      success: function (response) {
        getBestTags(places, i, response.result);
      },
      error: function (xhr, _status, _error) {
        console.error(xhr.responseText);
      },
    });
  }
  function getBestTags(places, i, isFavorite) {
    $.ajax({
      url: `api/${places[i].id}/getBestTags`,
      method: "GET",
      data: {
        limit: 3,
      },
      success: function (response) {
        insertPlace(places, i, isFavorite, response.result);
      },
      error: function (xhr, _status, _error) {
        console.error(xhr.responseText);
      },
    });
  }

  isFavoritePlace(places, i);
}

// HTML Function Blocks
const STAR_PATH =
  "M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z";

function getRatingRange(rating) {
  return Math.floor(rating / 2);
}

function hasOddRating(rating) {
  return rating % 2 == 1;
}

function getStar(kind) {
  // kind: "full" | "half" | "empty"
  const half =
    kind == "half"
      ? `<defs><clipPath id="half-clip"><rect x="0" y="0" width="12" height="24"/></clipPath></defs>
         <path d="${STAR_PATH}" class="star-empty"/>
         <path d="${STAR_PATH}" clip-path="url(#half-clip)"/>`
      : `<path d="${STAR_PATH}"/>`;
  return `<svg class="star star-${kind}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${half}</svg>`;
}

function getFigure(place, isFavorite) {
  return `<figure class="place-image-container">
            <a href="/${place.id}/detalhe">
              <img src="${$(location).attr("origin")}${static1}${
    place.mainImage
  }" alt="${place.title}" loading="lazy"/>
            </a>
            <span class="rating-badge">${getStar("full")}${(
    place.rating / 2
  ).toFixed(1)}</span>
            <svg ${isFavorite ? "" : `style="display:none"`} place="${
    place.id
  }" class="heart" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#e42121"><path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z" fill="#e42121"/></svg>
            <svg ${isFavorite ? `style="display:none"` : ""} place="${
    place.id
  }" class="heart" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </figure>`;
}

function getTitleLocation(place) {
  return `<h3 class="place-card-title"><a href="/${place.id}/detalhe">${place.title}</a></h3>
                <span class="place-location"><svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlSpace="preserve"
                    viewBox="0 0 64 64"
                >
                    <path
                    fill="currentColor"
                    d="M32 0C18.746 0 8 10.746 8 24c0 5.219 1.711 10.008 4.555 13.93.051.094.059.199.117.289l16 24a4.001 4.001 0 0 0 6.656 0l16-24c.059-.09.066-.195.117-.289C54.289 34.008 56 29.219 56 24 56 10.746 45.254 0 32 0zm0 32a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
                    />
                </svg>${place.location}</span>`;
}

function getRating(place) {
  const full = getRatingRange(place.rating);
  const half = hasOddRating(place.rating) ? 1 : 0;
  let html = "";
  for (let i = 0; i < full; i++) html += getStar("full");
  if (half) html += getStar("half");
  for (let i = full + half; i < 5; i++) html += getStar("empty");
  return html + `<span>${place.reviewNumber} reviews</span>`;
}

function getDescription(place) {
  const truncatedDecription =
    place.description.length > 120
      ? place.description.substring(0, 120) + "..."
      : place.description;
  return `<p>${truncatedDecription}</p>`;
}

function getTags(tags) {
  let html = `<ul class="tag-list">`;
  for (let i = 0; i < tags.length; i++)
    html += `<li class="tag">${tags[i].name}</li>`;
  return html + `</ul>`;
}

function getDetailButton(place) {
  return `<a class="btn-detalhe" href="/${place.id}/detalhe">
            Saber mais
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </a>`;
}

function insertPlaces(places, deleteBefore) {
  if (deleteBefore) $("#places-section").empty();
  // Reserve a slot per place so cards keep the API order despite async loads
  for (let i = 0; i < places.length; i++) {
    $("#places-section").append(
      `<article class="place-card loading" id="place-${places[i].id}"></article>`
    );
    getOtherDependenciesAndInsert(places, i);
  }
}

// Main HTML Block
function insertPlace(places, i, isFavorite, bestTags) {
  const place = places[i];
  const $card = $(`#place-${place.id}`);
  $card.removeClass("loading").html(`
      ${getFigure(place, isFavorite)}
      <div class="place-card-body">
        ${getTitleLocation(place)}
        <div class="rating-container">
          ${getRating(place)}
        </div>
        ${getDescription(place)}
        <footer class="place-card-footer">
          ${getTags(bestTags)}
          ${getDetailButton(place)}
        </footer>
      </div>`);

  const $hearts = $card.find(".heart");
  addFavoriteOrUnfavorite($hearts.eq(0), $hearts.eq(1));
}
