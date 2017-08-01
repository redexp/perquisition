define('views/form', [
	'view'
], function (
	View
) {

	function Form() {
		View.apply(this, arguments);

		this.callbacks = {};
	}

	View.extend({
		constructor: Form,

		ui: {
			form: '@root'
		},

		data: function () {
			return {
				errors: []
			};
		},

		submit: function (e) {
			e.preventDefault();

			var data = this.getValues();

			if (this.validate(data)) {
				this.save(data);
			}
		},

		getValues: function () {
			return deparam(this.ui.form.find(':input'));
		},

		validate: function (data) {
			data = data || this.getValues();

			var errors = [];

			this.trigger('validate', data, errors);
			this.callCallback('validate', data, errors);

			this.model('errors').reset(errors);

			return errors.length === 0;
		},

		save: function (data) {
			data = data || this.getValues();

			this.trigger('save', data);
			this.callCallback('save', data);
		},

		callCallback: function (name) {
			if (this.callbacks.hasOwnProperty(name)) {
				this.callbacks[name].apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},

		template: {
			'@form': {
				on: {
					'submit': 'submit'
				}
			}
		}
	});

	function deparam(inputs){
		var digit = /^\d+$/,
			keyBreaker = /([^\[\]]+)|(\[\])/g,
			data = {};

		for (var i = 0, iLen = inputs.length; i < iLen; i++) {
			var current = data,
				input = inputs[i];

			if (
				(input.type === 'radio' || input.type === 'checkbox') &&
				input.checked === false
			) {
				continue;
			}

			if (!input.name) continue;

			var value = input.value,
				parts = input.name.match(keyBreaker);

			for (var j = 0, jLen = parts.length - 1; j < jLen; j++) {
				var part = parts[j];

				if (!current[part]) {
					current[part] = parts[j + 1] === "[]" || digit.test(parts[j + 1]) ? [] : {}
				}

				current = current[part];
			}

			var lastPart = parts[jLen];

			if (lastPart === "[]") {
				current.push(value)
			}
			else {
				current[lastPart] = value;
			}
		}

		return data;
	}

	return Form;
});