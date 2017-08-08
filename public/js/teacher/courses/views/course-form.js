define('views/course-form', [
	'views/modal-form'
], function (
	ModalForm
) {

	function CourseForm() {
		ModalForm.apply(this, arguments);

		this.on('open', function (params) {
			this.model('course').set(params.course || CourseForm.prototype.data().course);
		});
	}

	ModalForm.extend({
		constructor: CourseForm,

		data: function () {
			return {
				course: {
					title: ''
				}
			};
		},

		template: function (extend) {
			return extend({},
				this.propValueTemplateOf('course')
			);
		}
	});

	return CourseForm;
});