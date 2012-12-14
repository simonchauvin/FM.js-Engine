var start = function () {
    "use strict";
    //Load assets
    FMAssetManager.loadAssets();

	//Specify the folder in which you put {FM.js(engine);}
    FMParameters.libraryDirectory = "lib";

	//Start game
    var game = FMGame("canvas", "ExampleProject", 800, 600, menuState);
    game.run();
};

window.addEventListener("load", start, false);