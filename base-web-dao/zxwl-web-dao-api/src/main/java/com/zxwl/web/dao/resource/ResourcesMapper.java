package com.zxwl.web.dao.resource;

import com.zxwl.web.bean.po.resource.PagerParamApi;
import com.zxwl.web.dao.GenericMapper;
import com.zxwl.web.bean.po.resource.Resources;
import org.jboss.logging.Param;

import java.util.List;
import java.util.Map;

/**
* 资源数据映射接口
* Created by generator 
*/
public interface ResourcesMapper extends GenericMapper<Resources,String> {
    List<Resources> fridendVideoList (String friendId);

    //获取产品信息
    Map videoDetail (String videoId, String userId);

    //
    List<Map> videoImgUrl ( String videoId);

    //根据用户ID查询用户视频列表
    List<Map> userVideoList (String userId);

    //根据用户ID查询用户视频列表
    List<Map> totalUserVideoList (String userId);

    List<Map> selectVideoListByUserId (String userId);

    List<Map> pagerVideoListByUserId (PagerParamApi pagerParamApi);

    Resources selectSingleImage(String recordId);

    List<Resources> selectAllImage(String recordId);

    String selectUserAvatarByUserId(String userId);

    List<Resources> VideoList ();

    int updateStatus(String userId, String videoId, int status);
    int deleteByMd5(String md5);
}
