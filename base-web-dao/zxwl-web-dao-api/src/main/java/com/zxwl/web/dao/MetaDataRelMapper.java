package com.zxwl.web.dao;

import com.zxwl.web.bean.MetaDataRel;

import java.util.List;

/**
 * MyBatis 资源、使用记录表 数据映射接口
 * Created by generator
 */
public interface MetaDataRelMapper extends GenericMapper<MetaDataRel,String> {

    public List<MetaDataRel> selectByRecordId(String recordId);

    public List<MetaDataRel> selectByDataId(String recordId);

    public int deleteByRecordId(String recordId);

    String selectByRecordId2MD5(String recordId);
}
