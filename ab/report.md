# ab接口压力测试报告

	详细报告可参看ab/result/**

### 服务器配置
	单机, nginx反向代理
	测试机：*.*.235.17
	cpu：2
	内存：4

#  接口列表
### api/v1/error-report
	同时50个请求, 连续1000次
	ab -e error_count.csv -p error.json -T application/json -n 1000 -c 50 http://**.com/api/v1/error-report

	1、结果 {初次数据表量为0, 每次数据叠加}
		吞吐量：131ps
		用户平均请求等待时间：379ms
		服务器平均处理时间：7.58ms
		请求百分比：90% 336ms

	2、结果
		吞吐量：155ps
		用户平均请求等待时间：321ms
		服务器平均处理时间：6.43ms
		请求百分比：90% 353ms

	3、结果
		吞吐量：137ps
		用户平均请求等待时间：364ms
		服务器平均处理时间：7.29ms
		请求百分比：90% 412ms

	---------------------------------------------------------------

	同时100个请求, 连续2000次
	ab -e error_count.csv -p error.json -T application/json -n 2000 -c 100 http://**.com/api/v1/error-report

	1、结果 {数据表量为5000条}
		吞吐量：141ps
		用户平均请求等待时间：704ms
		服务器平均处理时间：7.04ms
		请求百分比：90% 699ms


### api/v1/performance-report
	同时50个请求, 连续1000次
	ab -e performance_count.csv -p performance.json -T application/json -n 1000 -c 50 http://**.com/api/v1/performance-report

	1、结果
		吞吐量：87.7ps
		用户平均请求等待时间：570ms
		服务器平均处理时间：11.4ms
		请求百分比：
			50% 324ms
			90% 1536ms

	2、结果
		吞吐量：85.48ps
		用户平均请求等待时间：584.9ms
		服务器平均处理时间：11.6ms
		请求百分比：
			50% 330ms
			90% 1706ms

	---------------------------------------------------------------

	同时100个请求, 连续2000次
	ab -e performance_count.csv -p performance.json -T application/json -n 2000 -c 100 http://**.com/api/v1/performance-report

	1、结果
		吞吐量：76.15ps
		用户平均请求等待时间：1313ms
		服务器平均处理时间：13.13ms
		请求百分比：
			50% 713ms
			90% 2030ms

	2、结果
		吞吐量：86.12ps
		用户平均请求等待时间：1161ms
		服务器平均处理时间：11.61ms
		请求百分比：
			50% 682ms
			90% 2030ms
