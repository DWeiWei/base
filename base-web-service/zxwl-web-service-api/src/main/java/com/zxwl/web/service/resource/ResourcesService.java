package com.zxwl.web.service.resource;

import com.zxwl.web.bean.common.PagerResult;
import com.zxwl.web.bean.po.resource.PagerParamApi;
import com.zxwl.web.bean.po.resource.Resources;
import com.zxwl.web.service.GenericService;

import java.util.List;
import java.util.Map;

/**
 * 资源服务类
 * Created by generator
 */
public interface ResourcesService extends GenericService<Resources, String> {
    /**
     * 根据资源md5 查询资源信息,如果没有资源则返回null
     *
     * @param md5 md5值
     * @return 资源对象
     */
    Resources selectByMd5(String md5);

    Map videoDetail (String goodsId ,String userId);

    List<Map>  videoImgUrl (String videoId);

    String selectSingleImage(String basePath, String recordId);

    Resources selectSingleImage(String recordId);

    List<Resources> selectAllImage(String recordId);

    List<String> selectImages(String basePath, String recordId);

    PagerResult<Map> selectVideoListByUserId (PagerParamApi pagerParamApi, String userId);

    List<Map> userVideoListByUserId ( String userId);

    List<Resources> fridendVideoList (String friendId);

    List<Resources> VideoList ();

    int updateStatus(String userId, String videoId, int status);

}
