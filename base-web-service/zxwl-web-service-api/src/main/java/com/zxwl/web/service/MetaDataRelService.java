package com.zxwl.web.service;

import com.zxwl.web.bean.MetaDataRel;

import java.util.List;

/**
 * 资源、使用记录表 服务类接口
 * Created by generator
 */
public interface MetaDataRelService extends GenericService<MetaDataRel, String> {

    public List<MetaDataRel> selectByRecordId(String recordId);

    public List<MetaDataRel> selectByDataId(String dataId);

    public int deleteByRecordId(String recordId);

    String selectByRecordId2MD5(String recordId);
}
