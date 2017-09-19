/* jshint node: true, esversion: 6 */
/* global CKEDITOR */
module.exports = function (template) {
	var inc = 0;

	return {
		name: 'ckeditor',
		template: template,
		props: {
			value: {
				type: String
			},
			global: {
				type: Object,
				default: function () {
					return {};
				}
			},
			id: {
				type: String,
				default: function () {
					return 'editor-' + (++inc);
				}
			},
			types: {
				type: String,
				default: function () {
					return 'classic';
				}
			},
			mode: {
				type: Number,
				default: function () {
					return 2;
				}
			},
			config: {
				type: Object,
				default: function () {
					return {};
				}
			}
		},
		computed: {
			instance: function () {
				return CKEDITOR.instances[this.id];
			}
		},
		beforeUpdate: function () {
			var start = this.$parent,
				current = this.$parent.$refs.edit;

			while (!current) {
				start = start.$parent;
				current = start.$refs.edit;
			}

			current.options.dirty = true;
			/*if (current.options.global) {
				current.updateJSON(start.meta, start.common, true);
			} else {
				current.updateJSON(start.meta, start.specific, true);
			}*/

			if (this.value !== this.instance.getData()) {
				this.instance.setData(this.value);
			}
		},
		mounted: function () {
			var config = {
				entities_latin: false,
				entities_additional: '',
				fillEmptyBlocks: false,
				enterMode: this.mode
			};

			if (config.enterMode !== 1) {
				config.toolbar = [
					{ name: 'clipboard', items: [ 'Cut', 'Copy', 'Paste', 'PasteText', '-', 'Undo', 'Redo' ] },
					'/',
					{ name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
					{ name: 'insert', items: [ 'Image', 'SpecialChar' ] },
					'/',
					{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat' ] }
				];
			}

			if (this.types === 'inline') {
				CKEDITOR.inline(this.id, Object.assign({}, config, this.config));
			} else {
				CKEDITOR.replace(this.id, Object.assign({}, config, this.config));
			}
			this.instance.on('change', () => {
				let html = this.instance.getData();
				if (html !== this.value) {
					this.$emit('input', html);
				}
			});
		},
		beforeDestroy: function () {
			if (this.instance) {
				this.instance.focusManager.blur(true);
				this.instance.removeAllListeners();
				this.instance.destroy();
				this.instance = null;
			}
		}
	};
};