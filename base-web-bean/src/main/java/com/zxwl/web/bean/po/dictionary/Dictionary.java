package com.zxwl.web.bean.po.dictionary;

import com.zxwl.web.bean.po.GenericPo;

import java.util.Date;

/**
 * @Author: dingww
 * @Date: 2018/3/6 14:23
 * @Description: 字典表
 */
public class Dictionary  extends GenericPo<String> {
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
}
