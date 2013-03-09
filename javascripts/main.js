var displayedPage = "home_content";
var highlightedButton = "home";

window.onload = function () {
    document.getElementsByClassName("home")[0].style.backgroundPosition = "100px 0px";
    document.getElementsByClassName("home")[0].style.height = "62px";
};

var menuClick = function (pageToDisplay, buttonToHighlight) {
    document.getElementsByClassName(highlightedButton)[0].style.backgroundPosition = "0px 0px";
    document.getElementsByClassName(highlightedButton)[0].style.height = "40px";
    document.getElementById(displayedPage).style.display = 'none';
    document.getElementById(pageToDisplay).style.display = 'block';
    document.getElementsByClassName(buttonToHighlight)[0].style.backgroundPosition = "-100px 0px";
    document.getElementsByClassName(buttonToHighlight)[0].style.height = "62px";
    displayedPage = pageToDisplay;
    highlightedButton = buttonToHighlight;
};