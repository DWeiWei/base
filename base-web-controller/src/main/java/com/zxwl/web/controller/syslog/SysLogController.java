package com.zxwl.web.controller.syslog;

import com.zxwl.web.bean.po.syslog.SysLog;
import com.zxwl.web.controller.GenericController;
import com.zxwl.web.core.authorize.annotation.Authorize;
import com.zxwl.web.core.logger.annotation.AccessLogger;
import com.zxwl.web.service.GenericService;
import com.zxwl.web.service.role.RoleService;
import com.zxwl.web.service.syslog.SysLogService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

/**
 * @author dingww
 * @Description
 * @Date 2017/11/16 11:42
 */
@RestController
@RequestMapping(value = "/syslog")
@AccessLogger("日志管理")
@Authorize(module = "syslog")
public class SysLogController extends GenericController<SysLog, String> {

    @Resource
    private SysLogService sysLogService;

    @Override
    public SysLogService getService() {
        return this.sysLogService;
    }
}
