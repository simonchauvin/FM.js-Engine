/**
 * Start menu state
 * @returns {___that0}
 */
function menuState() {
	"use strict";
	var that = Object.create(FMState());

	/**
	 * Initialize the menu
	 */
	that.init = function (game) {
		Object.getPrototypeOf(that).init(game);

		var title = FMGameObject(99);
		var sp = FMSpatialComponent(game.getScreenWidth() / 2 - 100, game.getScreenHeight() / 2 - 150, title);
		var text = FMTextRendererComponent("Example Project", title);
		text.setFormat('#fff', '30px sans-serif', 'middle');
		that.add(title);

		var startButton = FMGameObject(99);
		var sp = FMSpatialComponent(game.getScreenWidth() / 2 - 130, game.getScreenHeight() / 2 + 150, startButton);
		var text = FMTextRendererComponent("Press SPACE to start", startButton);
		text.setFormat('#fff', '30px sans-serif', 'middle');
		that.add(startButton);
	};

	/**
	 * Update of the menu state
	 */
	that.update = function (game, dt) {
		Object.getPrototypeOf(that).update(game, dt);

		if (game.isKeyPressed(FMKeyboard.SPACE)) {
			game.switchState(playState());
		}
	};

	return that;
}