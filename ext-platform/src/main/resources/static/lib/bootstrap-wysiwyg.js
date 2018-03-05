/* http://github.com/mindmup/bootstrap-wysiwyg */
/*global jQuery, $, FileReader*/
/*jslint browser:true*/

(function ($) {
	'use strict';
    var uploadFileToServer = function(id, action, callback) {
        var loader = $.Deferred();
        $.ajaxFileUpload({
            url: action,
            secureurl: false,
            fileElementId: id,
            dataType: 'json',
            success: function (data, status) {
                if(typeof(data.error) != 'undefined'){
                    //后续处理
                    alert('上传失败了');
                }else{
                    //生成图片后，需要对<img>设置max-width:100%;
                    document.execCommand("insertimage", 0, data.filepath);
                }
            },
            error: function () {
                loader.reject("upload-failure", "");
            }
        })
        return loader.promise();
    };



        var images = {
            localId: [],
            serverId: []
        };
        var uploadImage = function(){
//        function uploadImage() {
            if (images.localId.length == 0) {
                Showbo.Msg.alert('请先选择图片');
                return;
            }
            var i = 0;
            wx.uploadImage({
                localId: images.localId[i],
                success: function (res) {
                    images.serverId = [];
                    images.serverId.push(res.serverId);
                    images.localId = [];
                    copyserver();
                },
                fail: function (res) {
                    alert('上传失败!');
                }
            });
            function copyserver() {
                var action=$('#pictureBtn').attr('action');
                var _csrf=$('#pictureBtn').attr('_csrf');
                var key=$('#pictureBtn').attr('key');
                $.ajax({
                    url: action,
                    type: 'POST',
                    dataType:"json",
                    data: {serverid: images.serverId[0], _csrf: _csrf},
                success: function (msg) {
                    if(msg.sign == 1){
                        document.execCommand("insertimage", 0,key+ msg.imgurl.arche);
                        $("#"+imgid+"_input").val(msg.imgurl.remote);
                    }else{
                        Showbo.Msg.alert('上传失败,程序员调试中,请稍后!');
                    }
                },
                error: function () {
                    alert("上传失败!");
                }
            })
        }
        };





	var readFileIntoDataUrl = function (fileInfo) {
		var loader = $.Deferred(),
			fReader = new FileReader();
		fReader.onload = function (e) {
			loader.resolve(e.target.result);
		};
		fReader.onerror = loader.reject;
		fReader.onprogress = loader.notify;
		fReader.readAsDataURL(fileInfo);
		return loader.promise();
	};
	$.fn.cleanHtml = function () {
		var html = $(this).html();
		return html && html.replace(/(<br>|\s|<div><br><\/div>|&nbsp;)*$/, '');
	};
	$.fn.wysiwyg = function (userOptions) {
		var editor = this,
			selectedRange,
			options,
			toolbarBtnSelector,
			updateToolbar = function () {
				if (options.activeToolbarClass) {
					$(options.toolbarSelector).find(toolbarBtnSelector).each(function () {
						var command = $(this).data(options.commandRole);
						if (document.queryCommandState(command)) {
							$(this).addClass(options.activeToolbarClass);
						} else {
							$(this).removeClass(options.activeToolbarClass);
						}
					});
				}
			},
			execCommand = function (commandWithArgs, valueArg) {
				var commandArr = commandWithArgs.split(' '),
					command = commandArr.shift(),
					args = commandArr.join(' ') + (valueArg || '');
				document.execCommand(command, 0, args);
				updateToolbar();
			},
			bindHotkeys = function (hotKeys) {
				$.each(hotKeys, function (hotkey, command) {
					editor.keydown(hotkey, function (e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							e.preventDefault();
							e.stopPropagation();
							execCommand(command);
						}
					}).keyup(hotkey, function (e) {
						if (editor.attr('contenteditable') && editor.is(':visible')) {
							e.preventDefault();
							e.stopPropagation();
						}
					});
				});
			},
			getCurrentRange = function () {
				var sel = window.getSelection();
				if (sel.getRangeAt && sel.rangeCount) {
					return sel.getRangeAt(0);
				}
			},
			saveSelection = function () {
				selectedRange = getCurrentRange();
			},
			restoreSelection = function () {
				var selection = window.getSelection();
				if (selectedRange) {
					try {
						selection.removeAllRanges();
					} catch (ex) {
						document.body.createTextRange().select();
						document.selection.empty();
					}

					selection.addRange(selectedRange);
				}
			},
			insertFiles = function (files,id, action) {
				editor.focus();
				$.each(files, function (index, fileInfo) {
					if (/^image\//.test(fileInfo.type)) {
						//$.when(readFileIntoDataUrl(fileInfo)).done(function (dataUrl) {
						//	execCommand('insertimage', dataUrl);
						//}).fail(function (e) {
						//	options.fileUploadError("file-reader", e);
						//});
                        //Ajaxfileupload上传
                        uploadFileToServer(id,action);
                        //uploadFileToServer(id,action, function(src) {
                        //    execCommand('insertimage', src);
                        //});
					} else {
						options.fileUploadError("unsupported-file-type", fileInfo.type);
					}
				});
			},
			markSelection = function (input, color) {
				restoreSelection();
				if (document.queryCommandSupported('hiliteColor')) {
					document.execCommand('hiliteColor', 0, color || 'transparent');
				}
				saveSelection();
				input.data(options.selectionMarker, color);
			},
			bindToolbar = function (toolbar, options) {
				toolbar.find(toolbarBtnSelector).click(function () {
					restoreSelection();
					editor.focus();
					execCommand($(this).data(options.commandRole));
					saveSelection();
				});
				toolbar.find('[data-toggle=dropdown]').click(restoreSelection);

				toolbar.find('input[type=text][data-' + options.commandRole + ']').on('webkitspeechchange change', function () {
					var newValue = this.value; /* ugly but prevents fake double-calls due to selection restoration */
					this.value = '';
					restoreSelection();
					if (newValue) {
						editor.focus();
						execCommand($(this).data(options.commandRole), newValue);
					}
					saveSelection();
				}).on('focus', function () {
					var input = $(this);
					if (!input.data(options.selectionMarker)) {
						markSelection(input, options.selectionColor);
						input.focus();
					}
				}).on('blur', function () {
					var input = $(this);
					if (input.data(options.selectionMarker)) {
						markSelection(input, false);
					}
				});
				//toolbar.find('input[type=file][data-' + options.commandRole + ']').change(function () {
                    $('#pictureBtn').click(function(){
					restoreSelection();
                        wx.chooseImage({
                            count:1,
                            success: function (res) {
                                images.localId = res.localIds;
                                uploadImage();
                            }
                        });

					//if (this.type === 'file' && this.files && this.files.length > 0) {
                     //   insertFiles(this.files, $(this).attr('id'),
                     //       $(this).attr('action'));
					//}
					saveSelection();
					this.value = '';
				});
			},
			initFileDrops = function () {
				editor.on('dragenter dragover', false)
					.on('drop', function (e) {
						var dataTransfer = e.originalEvent.dataTransfer;
						e.stopPropagation();
						e.preventDefault();
						if (dataTransfer && dataTransfer.files && dataTransfer.files.length > 0) {
							insertFiles(dataTransfer.files);
						}
					});
			};
		options = $.extend({}, $.fn.wysiwyg.defaults, userOptions);
		toolbarBtnSelector = 'a[data-' + options.commandRole + '],button[data-' + options.commandRole + '],input[type=button][data-' + options.commandRole + ']';
		bindHotkeys(options.hotKeys);
		if (options.dragAndDropImages) {
			initFileDrops();
		}
		bindToolbar($(options.toolbarSelector), options);
		editor.attr('contenteditable', true)
			.on('mouseup keyup mouseout', function () {
				saveSelection();
				updateToolbar();
			});
		$(window).bind('touchend', function (e) {
			var isInside = (editor.is(e.target) || editor.has(e.target).length > 0),
				currentRange = getCurrentRange(),
				clear = currentRange && (currentRange.startContainer === currentRange.endContainer && currentRange.startOffset === currentRange.endOffset);
			if (!clear || isInside) {
				saveSelection();
				updateToolbar();
			}
		});
		return this;
	};
	$.fn.wysiwyg.defaults = {
		hotKeys: {
			'ctrl+b meta+b': 'bold',
			'ctrl+i meta+i': 'italic',
			'ctrl+u meta+u': 'underline',
			'ctrl+z meta+z': 'undo',
			'ctrl+y meta+y meta+shift+z': 'redo',
			'ctrl+l meta+l': 'justifyleft',
			'ctrl+r meta+r': 'justifyright',
			'ctrl+e meta+e': 'justifycenter',
			'ctrl+j meta+j': 'justifyfull',
			'shift+tab': 'outdent',
			'tab': 'indent'
		},
		toolbarSelector: '[data-role=editor-toolbar]',
		commandRole: 'edit',
		activeToolbarClass: 'btn-info',
		selectionMarker: 'edit-focus-marker',
		selectionColor: 'darkgrey',
		dragAndDropImages: true,
		fileUploadError: function (reason, detail) { console.log("File upload error", reason, detail); }
	};
}(window.jQuery));
