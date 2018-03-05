package com.zxwl.web.bean.po.syslog;

import com.zxwl.web.bean.po.GenericPo;


/**
 * @author dingww
 * @Description 系统操作日志
 * @Date 2017/11/16 11:05
 */
public class SysLog extends GenericPo<String> {
    //日志类型
    private String logType;
    //日志内容
    private String logDesc;
    //操作人
    private String operName;
    //操作时间
    private java.util.Date operDate;
    //操作人ID
    private String operId;

    public String getLogType() {
        return logType;
    }

    public void setLogType(String logType) {
        this.logType = logType;
    }

    public String getLogDesc() {
        return logDesc;
    }

    public void setLogDesc(String logDesc) {
        this.logDesc = logDesc;
    }

    public String getOperName() {
        return operName;
    }

    public void setOperName(String operName) {
        this.operName = operName;
    }

    public java.util.Date getOperDate() {
        return operDate;
    }

    public void setOperDate(java.util.Date operDate) {
        this.operDate = operDate;
    }

    public String getOperId() {
        return operId;
    }

    public void setOperId(String operId) {
        this.operId = operId;
    }

    public interface Property extends GenericPo.Property {
        /**
         * @see SysLog#logType
         */
        String logType = "logType";

        /**
         * @see SysLog#logDesc
         */
        String logDesc = "logDesc";

        /**
         * @see SysLog#operName
         */
        String operName = "operName";

        /**
         * @see SysLog#operDate
         */
        String operDate = "operDate";

        /**
         * @see SysLog#operId
         */
        String operId = "operId";
    }
}
