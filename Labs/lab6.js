
// Get HTML elements
const likeBtn = document.getElementById("likeBtn");
const dislikeBtn = document.getElementById("dislikeBtn");

const likeCount = document.getElementById("likeCount");
const dislikeCount = document.getElementById("dislikeCount");

const commentInput = document.getElementById("commentInput");
const submitBtn = document.getElementById("submitBtn");
const clearBtn = document.getElementById("clearBtn");

const commentsList = document.getElementById("commentsList");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");


// COOKIE FUNCTIONS

function setCookie(name, value) {
    document.cookie =
        name + "=" + encodeURIComponent(value) +
        "; max-age=31536000; path=/; SameSite=Lax";
}

function getCookie(name) {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")) {
            return decodeURIComponent(
                cookie.substring(name.length + 1)
            );
        }
    }

    return "";
}

function deleteCookie(name) {
    document.cookie =
        name + "=; max-age=0; path=/; SameSite=Lax";
}


// INITIALIZE DATA FROM COOKIES

let likes = Number(getCookie("likes")) || 0;
let dislikes = Number(getCookie("dislikes")) || 0;

let userVote = getCookie("userVote");

let comments = [];

try {
    comments = JSON.parse(getCookie("comments") || "[]");

    if (!Array.isArray(comments)) {
        comments = [];
    }
} catch {
    comments = [];
}

let userCommented = getCookie("userCommented");


// UPDATE COUNTERS

function updateCounters() {
    likeCount.textContent = likes;
    dislikeCount.textContent = dislikes;
}


// DISPLAY COMMENTS

function displayComments() {
    commentsList.innerHTML = "";

    comments.forEach(function(comment) {
        const li = document.createElement("li");

        li.textContent = comment;

        commentsList.appendChild(li);
    });
}


// UPDATE BUTTONS

function updateButtons() {
    if (userVote !== "") {
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
    } else {
        likeBtn.disabled = false;
        dislikeBtn.disabled = false;
    }
}


// LOAD SAVED DATA WHEN PAGE OPENS

updateCounters();
displayComments();
updateButtons();


// LIKE BUTTON

likeBtn.addEventListener("click", function() {

    if (userVote !== "") {
        message.textContent = "You have already voted!";
        return;
    }

    likes++;

    userVote = "like";

    setCookie("likes", likes);
    setCookie("userVote", userVote);

    updateCounters();
    updateButtons();

    message.textContent = "You liked this!";
});


// DISLIKE BUTTON

dislikeBtn.addEventListener("click", function() {

    if (userVote !== "") {
        message.textContent = "You have already voted!";
        return;
    }

    dislikes++;

    userVote = "dislike";

    setCookie("dislikes", dislikes);
    setCookie("userVote", userVote);

    updateCounters();
    updateButtons();

    message.textContent = "You disliked this!";
});


// SUBMIT COMMENT

submitBtn.addEventListener("click", function() {

    const comment = commentInput.value.trim();

    if (comment === "") {
        message.textContent = "Please write a comment!";
        return;
    }

    if (userCommented === "true") {
        message.textContent = "You have already commented!";
        return;
    }

    comments.push(comment);

    userCommented = "true";

    setCookie("comments", JSON.stringify(comments));
    setCookie("userCommented", userCommented);

    displayComments();

    commentInput.value = "";

    message.textContent = "Comment submitted successfully!";
});


// CLEAR COMMENT INPUT

clearBtn.addEventListener("click", function() {

    commentInput.value = "";

    message.textContent = "";
});


// RESET EVERYTHING

resetBtn.addEventListener("click", function() {

    likes = 0;
    dislikes = 0;

    comments = [];

    userVote = "";
    userCommented = "";

    deleteCookie("likes");
    deleteCookie("dislikes");
    deleteCookie("userVote");
    deleteCookie("comments");
    deleteCookie("userCommented");

    updateCounters();
    displayComments();
    updateButtons();

    commentInput.value = "";

    message.textContent = "Everything has been reset!";
});

