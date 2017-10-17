define('steps', [
	'jquery',
	'velocity'
], function (
	$
) {

	var prev = null;
	var body = $(document.body);
	var events = {};

	goToStep.on = function (id, callback) {
		var callbacks = events[id];
		if (!callbacks) {
			callbacks = events[id] = [];
		}

		callbacks.push(callback);
	};

	function goToStep(id) {
		if (prev) {
			prev[0].velocity('stop').css('display', 'block').addClass('active');
			prev[1].velocity('stop').css('display', 'none');
			prev = null;
		}

		var type = 'horizontal';

		if (id.indexOf('|') > -1) {
			id = id.split('|');
			type = id[1];
			id = id[0];
		}

		var step = $('#' + id),
			parent = step.parent(),
			steps = parent.children('.step'),
			active = steps.filter('.active'),
			sIndex = steps.index(step),
			aIndex = steps.index(active),
			direction = sIndex > aIndex ? 'next' : 'prev';

		if (sIndex === aIndex) return;

		goToStep.activeStep = id;

		var effects = getEffects(type);

		var d = $.Deferred();
		var p = d.promise();

		parent.height(active.outerHeight());

		step.addClass('stepping-next');
		active.addClass('stepping-active');
		body.addClass('stepping');

		parent.velocity({height: step.outerHeight()}, {duration: 500});

		step.velocity(effects[direction + 'Effects'][0], {duration: 500});
		active.velocity(effects[direction + 'Effects'][1], {duration: 500, complete: d.resolve});

		prev = [step, active];

		var args = Array.prototype.slice.call(arguments, 1);

		setTimeout(function () {
			if (events[id]) {
				events[id].forEach(function (callback) {
					callback.apply(null, args);
				});
			}
		}, 50);

		p.then(function () {
			body.removeClass('stepping');
			parent.css('height', '');
			clear(step);
			clear(active);
			step.addClass('active');
			active.removeClass('active');
			prev = null;
		});

		return p;
	}

	function getEffects(type) {
		switch (type) {
			case 'horizontal':
				return {
					nextEffects: [
						{opacity: [1, 0], translateX: [0, 20], translateZ: 0},
						{opacity: [0, 1], translateX: -20, translateZ: 0}
					],
					prevEffects: [
						{opacity: [1, 0], translateX: [0, -20], translateZ: 0},
						{opacity: [0, 1], translateX: 20, translateZ: 0}
					]
				};
			case 'vertical':
				return {
					nextEffects: [
						{opacity: [1, 0], translateY: [0, 20], translateZ: 0},
						{opacity: [0, 1], translateY: -20, translateZ: 0}
					],
					prevEffects: [
						{opacity: [1, 0], translateY: [0, -20], translateZ: 0},
						{opacity: [0, 1], translateY: 20, translateZ: 0}
					]
				};
		}
	}

	function clear(node) {
		node.removeClass('stepping-next stepping-active').css({transform: '', opacity: ''});
	}

	return goToStep;
});