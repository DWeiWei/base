package com.zxwl.web.service.impl;

import com.zxwl.web.bean.MetaDataRel;
import com.zxwl.web.dao.MetaDataRelMapper;
import com.zxwl.web.service.MetaDataRelService;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;

/**
 * 资源、使用记录表 服务类实现
 * Created by generator
 */
@Service("metaDataService")
public class MetaDataServiceRelImpl extends AbstractServiceImpl<MetaDataRel, String> implements MetaDataRelService {

    @Resource
    protected MetaDataRelMapper metaDataMapper;

    @Override
    protected MetaDataRelMapper getMapper() {
        return this.metaDataMapper;
    }

    @Override
    public List<MetaDataRel> selectByRecordId(String recordId) {
        return this.getMapper().selectByRecordId(recordId);
    }

    @Override
    public List<MetaDataRel> selectByDataId(String dataId) {
        return this.getMapper().selectByDataId(dataId);
    }

    @Override
    public int deleteByRecordId(String recordId){
        return this.getMapper().deleteByRecordId(recordId);
    }

    public String insert(MetaDataRel data) {
        return super.insert(data);
    }

    public int update(MetaDataRel data) {
        return super.update(data);
    }

    public int update(List<MetaDataRel> data) {
        return super.update(data);
    }

    @Override
    public String selectByRecordId2MD5(String recordId) {
        return this.getMapper().selectByRecordId2MD5(recordId);
    }
}
