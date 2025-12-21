function toggleLightDark() {
    var element = document.body;
    element.classList.toggle("dark-mode");

    // Change sun and moon icon
    element = document.getElementById("btnToggle");
    element.classList.toggle("light");
    $("#btnToggle i").toggleClass("fa-moon-o fa-sun-o");

    // a elements
    var a = document.querySelectorAll("a");
    for (var i = 0; i < a.length; i++) {
        a[i].classList.toggle("dark-mode");
    }

    // Intro
    element = document.getElementById("intro");
    element.classList.toggle("dark-mode");

    // .icon-button
    var iconButtons = document.querySelectorAll(".icon-button");
    for (var i = 0; i < iconButtons.length; i++) {
        // iconButtons[i].classList.toggle("dark-mode");
    }

    // Footer
    element = document.getElementById("footer-text");
    element.classList.toggle("small text-white-50");
}
