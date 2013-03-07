window.onload = function () {
    console.log(document.getElementById("home_content").style.display);
    if (document.getElementById("home_content").style.display === 'block') {
        document.getElementsByClassName("home")[0].style.backgroundPosition = "100px 0px";
        document.getElementsByClassName("home")[0].style.height = "62px";
    }
    
    if (document.getElementById("features_content").style.display === "block") {
        document.getElementsByClassName("features")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("features")[0].style.height = "62px";
    }
    
    if (document.getElementById("gallery_content").style.display === "block") {
        document.getElementsByClassName("gallery")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("gallery")[0].style.height = "62px";
    }
    
    if (document.getElementById("download_content").style.display === "block") {
        document.getElementsByClassName("download")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("download")[0].style.height = "62px";
    }
    
    if (document.getElementById("community_content").style.display === "block") {
        document.getElementsByClassName("community")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("community")[0].style.height = "62px";
    }
    
    if (document.getElementById("help_content").style.display === "block") {
        document.getElementsByClassName("help")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("help")[0].style.height = "62px";
    }
}