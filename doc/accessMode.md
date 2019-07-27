### analyses各方接入方式

	1、script引用
	<script src="//analyses.huishoubao.com/public/js/analyses.js"></script>

	2、初始化
	@description 收集资源信息和错误日志，线上分析结果
	@method Performance.setConfig || ErrorReport.setConfig
	@params {Object} 传递参数
		@param {String} api 接口地址
		@param {String} user_id 能获取则获取，不能获取传空，唯一标识符
		@param {String} app_name 项目名 {自有: ZiYou, 优品：YouPin, ....}

	配置错误日志
	ErrorReport.setConfig({
		api: "//analyses.huishoubao.com/api/v1/error-report",
		user_id: 'YSG123456',
		app_name: 'ZiYou'
	})

	配置资源性能
	Performance.setConfig({
		api: "//analyses.huishoubao.com/api/v1/performance-report",
		user_id: 'YSG123456',
		app_name: 'ZiYou'
	})


### 注意
	所有js文件，建议放在</body>前，尽可能不要放置在header之间, 伪代码：
	<body>
		<div>xxxxx</div>
		<script>analyses.js</script>
		<script>
			调用上述初始化代码
		</script>
		<script>verdon.js</script>
		<script>xxx.js</script>
	</body>

