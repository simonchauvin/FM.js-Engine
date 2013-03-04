window.onload = function() {
    if (document.getElementById("home_content").style.visibility == 'hidden') {
        document.getElementsByClassName("home")[0].style.backgroundPosition = "100px 0px";
        document.getElementsByClassName("home")[0].style.height = "62px";
    }
    
    if (document.getElementById("features_content")) {
        document.getElementsByClassName("features")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("features")[0].style.height = "62px";
    }
    
    if (document.getElementById("gallery_content")) {
        document.getElementsByClassName("gallery")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("gallery")[0].style.height = "62px";
    }
    
    if (document.getElementById("download_content")) {
        document.getElementsByClassName("download")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("download")[0].style.height = "62px";
    }
    
    if (document.getElementById("community_content")) {
        document.getElementsByClassName("community")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("community")[0].style.height = "62px";
    }
    
    if (document.getElementById("help_content")) {
        document.getElementsByClassName("help")[0].style.backgroundPosition = "-100px 0px";
        document.getElementsByClassName("help")[0].style.height = "62px";
    }
}