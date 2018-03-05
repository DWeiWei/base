package com.zxwl.web.service.impl.syslog;

import com.zxwl.web.bean.po.syslog.SysLog;
import com.zxwl.web.dao.role.RoleMapper;
import com.zxwl.web.dao.syslog.SysLogMapper;
import com.zxwl.web.service.impl.AbstractServiceImpl;
import com.zxwl.web.service.syslog.SysLogService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @author dingww
 * @Description
 * @Date 2017/11/16 11:36
 */
@Service("sysLogService")
public class SysLogServiceImpl extends AbstractServiceImpl<SysLog, String> implements SysLogService{
    @Resource
    protected SysLogMapper sysLogMapper;

    @Override
    protected SysLogMapper getMapper() { return this.sysLogMapper; }
}
