# Performance-Testing with JMeter Recording 

Tested website name: JPet Store Demo Website

I’ve completed performance test on ❖frequently used API for JPet Store Demo  website. ❖ Run in non-GUI mode. ❖ Test Report Generate on HTML.

100 Concurrent Request with 1 Loop Count; Avg TPS for Total Samples is ~ 26.67 transactions/sec And Total Concurrent API requested: 1600.             
80 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 68 transactions/sec And Total Concurrent API requested: 12800.                       
100 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 125 transactions/sec And Total Concurrent API requested: 16000.                 
110 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 87 transactions/sec And Total Concurrent API requested: 17600.                       
120 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 78 transactions/sec And Total Concurrent API requested: 19200.                       
130 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 108 transactions/sec And Total Concurrent API requested: 20800.                       
150 Concurrent Request with 10 Loop Count; Avg TPS for Total Samples is ~ 95 transactions/sec And Total Concurrent API requested: 24000. 

While executed 110 concurrent request, found 181 request got connection timeout and error rate is 1.03%.

Summary: Server can handle almost concurrent 16800 API call with almost less than 1% error rate.


