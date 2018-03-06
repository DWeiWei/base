package com.zxwl.web.service.impl.dictionary;

import com.zxwl.web.bean.po.dictionary.Dictionary;
import com.zxwl.web.dao.dictionary.DictionaryMapper;
import com.zxwl.web.service.dictionary.DictionaryService;
import com.zxwl.web.service.impl.AbstractServiceImpl;

import javax.annotation.Resource;

/**
 * @Author: dingww
 * @Date: 2018/3/6 14:23
 * @Description: 字典服务
 */
public class DictionaryServiceImpl extends AbstractServiceImpl<Dictionary, String>  implements DictionaryService{

    @Resource
    protected DictionaryMapper dictionaryMapper;

    @Override
    protected DictionaryMapper getMapper() {
        return this.dictionaryMapper;
    }
}
