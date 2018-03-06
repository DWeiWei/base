package com.zxwl.web.bean.po.dictionary;

import com.zxwl.web.bean.po.GenericPo;

import java.util.Date;

/**
 * @Author: dingww
 * @Date: 2018/3/6 14:23
 * @Description: 字典表
 */
public class Dictionary extends GenericPo<String> {
    /**
     * 父类ID
     */
    private String parentId;
    /**
     * 名称
     */
    private String name;

    /**
     * 值
     */
    private String value;
    /**
     * 编码
     */
    private String code;

    /**
     * 层级编码
     */
    private String levelCode;
    /**
     * 备注
     */
    private String remark;

    /**
     * 创建时间
     */
    private Date createDate;

    /**
     * 修改时间
     */
    private Date updateDate;

    /**
     * 创建人主键
     */
    private String creatorId;

    /**
     * 是否可用
     */
    private String status;

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLevelCode() {
        return levelCode;
    }

    public void setLevelCode(String levelCode) {
        this.levelCode = levelCode;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public interface Property extends GenericPo.Property {
        String parentId = "parentId";
        String name = "name";
        String value = "value";
        String code = "code";
        String levelCode = "levelCode";
        String remark = "remark";
        String createDate = "createDate";
        String updateDate = "updateDate";
        String creatorId = "creatorId";
        String status = "status";
    }
}
