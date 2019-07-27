### analyses各方接入方式

	1、script引用
	<script src="//analyses.huishoubao.com/public/js/analyses.js"></script>

	2、初始化
	@description 收集资源信息和错误日志，线上分析结果
	@method Performance.setConfig || ErrorReport.setConfig
	@params {Object} 传递参数
		@param {String} {require} api 接口地址
		@param {String} user_id 唯一标识符. 能获取则获取，不能获取传空
		@param {String} {require} app_name 业务方名称. 固定值, 由后端配置人员提供, 目前只支持{自有: ZiYou, 优品：YouPin, ....}
		@param {String} {require} call_name 上报方名称, 就是调用方. 取名遵循: 业务方_应用环境_应用名_N，比如：ZiYou_Pc_Official, 自有pc端官网

	配置错误日志
	ErrorReport.setConfig({
		api: "//analyses.huishoubao.com/api/v1/error-report",
		user_id: 'YSG123456',
		app_name: 'ZiYou',
		call_name: 'ZiYou_Pc_Official
	})

	配置资源性能
	Performance.setConfig({
		api: "//analyses.huishoubao.com/api/v1/performance-report",
		user_id: 'YSG123456',
		app_name: 'ZiYou',
		call_name: 'ZiYou_Pc_Official
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

