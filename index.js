// Keep everything in anonymous function, called on window load.
if (window.addEventListener) {
    window.addEventListener('load', function () {
        var canvas, context, tool, saveButton, clearButton;

        function init() {
            document.getElementById("learnMoreButton").onclick = scrollToAbout;
            
        }

        function scrollToAbout(){
            var divID = '#about';
            $('html, body').animate({
                scrollTop: $(divID).offset().top
            }, 2000);
        }
        init();

    }, false);
}