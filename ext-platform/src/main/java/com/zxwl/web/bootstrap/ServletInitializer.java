package com.zxwl.web.bootstrap;

import com.zxwl.web.Run;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.web.SpringBootServletInitializer;

/**
 * Project: zxwl-framework
 * Author: Sendya <18x@loacg.com>
 * Date: 2017/6/7 16:18
 */
public class ServletInitializer extends SpringBootServletInitializer {

    static {
        System.setProperty("spring.output.ansi.enabled", "ALWAYS");
       // System.setProperty("logging.config", "classpath:config/logback-prod.xml");//外部tomcat部署日志输入有问题
    }

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(Run.class);
    }

}
