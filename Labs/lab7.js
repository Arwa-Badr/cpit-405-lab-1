// Step 1: Unsplash Access Key
const ACCESS_KEY = "6KjIgOTkg2SfK3iQE0WNZSCxS5Q7iJj9hGcLfZEeY8g";
const API_URL = "https://api.unsplash.com/search/photos";

const searchInput = document.getElementById("searchInput");
const gallery = document.getElementById("gallery");
const message = document.getElementById("message");

function buildUrl(query) {
  return `${API_URL}?query=${encodeURIComponent(query)}&per_page=12`;
}

function getQuery() {
  const query = searchInput.value.trim();
  if (!query) {
    showMessage("Enter a search term first.", true);
    return null;
  }
  return query;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

// ---------- 1. XMLHttpRequest ----------
function searchUsingXHR() {
  const query = getQuery();
  if (!query) return;

  const xhr = new XMLHttpRequest();
  xhr.open("GET", buildUrl(query));
  xhr.setRequestHeader("Authorization", `Client-ID ${ACCESS_KEY}`);
  xhr.onload = function () {
    if (xhr.status === 200) {
      displayPhotos(JSON.parse(xhr.responseText).results);
    } else {
      showMessage(`Request failed (${xhr.status}). Check your access key.`, true);
    }
  };
  xhr.onerror = function () {
    showMessage("Network error. Check your connection.", true);
  };
  xhr.send();
}

// ---------- 2. Fetch with promises ----------
function searchUsingFetchPromises() {
  const query = getQuery();
  if (!query) return;

  fetch(buildUrl(query), { headers: { Authorization: `Client-ID ${ACCESS_KEY}` } })
    .then((response) => {
      if (!response.ok) throw new Error(`Request failed (${response.status})`);
      return response.json();
    })
    .then((data) => displayPhotos(data.results))
    .catch((error) => showMessage(error.message, true));
}

// ---------- 3. Fetch with async/await ----------
async function searchUsingFetchAsync() {
  const query = getQuery();
  if (!query) return;

  try {
    const response = await fetch(buildUrl(query), {
      headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
    });
    if (!response.ok) throw new Error(`Request failed (${response.status})`);
    const data = await response.json();
    displayPhotos(data.results);
  } catch (error) {
    showMessage(error.message, true);
  }
}

// ---------- Create the DOM elements dynamically ----------
function displayPhotos(photos) {
  gallery.innerHTML = "";
  if (photos.length === 0) {
    showMessage("No photos found. Try a different search term.");
    return;
  }
  showMessage("");

  photos.forEach((photo) => {
    const link = document.createElement("a");
    link.href = photo.links.html;
    link.target = "_blank";
    link.rel = "noopener";

    const img = document.createElement("img");
    img.src = photo.urls.small;
    img.alt = photo.alt_description || `Photo by ${photo.user.name}`;
    img.title = `Photo by ${photo.user.name}`;

    link.appendChild(img);
    gallery.appendChild(link);
  });
}

// ---------- Event handlers ----------
document.getElementById("xhrBtn").addEventListener("click", searchUsingXHR);
document.getElementById("promiseBtn").addEventListener("click", searchUsingFetchPromises);
document.getElementById("asyncBtn").addEventListener("click", searchUsingFetchAsync);

// Keyboard: pressing Enter in the search box runs the async/await search
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") searchUsingFetchAsync();
});
