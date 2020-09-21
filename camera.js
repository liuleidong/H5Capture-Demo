<script>
	// 优化retina, 在retina下这个值是2
	var ratio = window.devicePixelRatio || 1;
	// 缩略图大小
	var thumbnailWidth = 100 * ratio;
	var thumbnailHeight = 100 * ratio;
	// Web Uploader实例
	// 上传身份证正面
	uploader = WebUploader.create({
		// 自动上传。
		auto: true,
		// swf文件路径
		swf:'${baseRoot}/js/common/Uploader.swf',
		// 文件接收服务端。
		server: '${contextPath!''}/realNamePlatFormJson/uploadFile.action',
		// 选择文件的按钮。可选。
		// 内部根据当前运行是创建，可能是input元素，也可能是flash.
		pick: '#uploadIdcardFront',
		formData:{fileDir:'front${realNameId!}',upType:'1'},   //此次文件的多分片存储位置
		// 只允许选择文件，可选。
		accept: {
			title: 'Images',
			extensions: 'gif,jpg,jpeg,bmp,png',
			mimeTypes: 'image/*'
		},
		duplicate:true,
		compress:{
			compressSize:1024*1024
		}
	});

	uploader.on('startUpload', function (file,response ) {
		$("#cover").show();
		$("#phoneErrTip").css('display','none');
		$("#realNameErrTip").css('display','none');
		$("#infoErrTip").css('display','none');
	});

	// 当有文件添加进来的时候,展示图片
	uploader.on( 'fileQueued', function( file ) {
		// 创建缩略图
		uploader.makeThumb( file, function( error, src ) {
			if ( error ) {
				$img.replaceWith('<span>不能预览</span>');
				return;
			}
			//$("#upimgcont1").hide();
			//$("#upimgcont2").show();
			$("#showIdcardFront").attr("src",src);
			$("#backDiv").attr("class","uploadend");
		}, thumbnailWidth, thumbnailHeight );      
	});

	// 文件上传过程中创建进度条实时显示。
	uploader.on( 'uploadProgress', function( file, percentage ) {
		var $li = $( '#'+file.id ),
			$percent = $li.find('.progress span');

		// 避免重复创建
		if ( !$percent.length ) {
			$percent = $('<p class="progress"><span></span></p>')
					.appendTo( $li )
					.find('span');
		}

		$percent.css( 'width', percentage * 100 + '%' );
	});
	// 文件上传成功，给item添加成功class, 用样式标记上传成功。
	uploader.on( 'uploadSuccess', function( file ) {
		$( '#'+file.id ).addClass('upload-state-done');
	});

	// 文件上传失败，现实上传出错。
	uploader.on( 'uploadError', function( file ) {
		var $li = $( '#'+file.id ),
			$error = $li.find('div.error');

		// 避免重复创建
		if ( !$error.length ) {
			$error = $('<div class="error"></div>').appendTo( $li );
		}

		$error.text('上传失败');
	});
	
	// 完成上传完了，成功或者失败，先删除进度条。
	uploader.on( 'uploadComplete', function( file ) {
		  //发起合并请求
		  var fileName=file.name;
		  var suf=fileName.substring(fileName.indexOf(".")+1)
		  var realNameId = $("#realNameId").val();
		  var serialNumber = $("#serialNumber").val();
		  var areaCode = $("#areaCode").val();
		  $.ajax({
				url:'${contextPath!''}/realNamePlatFormJson/verIdCardFront.action',
				type:'post',
				data:{fileFileName:fileName,fileDir:'front${realNameId!}',realNameId:realNameId,serialNumber:serialNumber,areaCode:areaCode},
				success:function(res){

				},
				error:function(){
					$("#cover").hide();
					showErrInfoOrder("抱歉，系统错误","2");
				}
			
			});
	});
</script>