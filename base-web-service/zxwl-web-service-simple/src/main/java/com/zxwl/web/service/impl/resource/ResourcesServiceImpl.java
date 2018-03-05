package com.zxwl.web.service.impl.resource;

import com.zxwl.web.bean.common.PagerResult;
import com.zxwl.web.bean.common.QueryParam;
import com.zxwl.web.bean.po.resource.PagerParamApi;
import com.zxwl.web.bean.po.resource.Resources;
import com.zxwl.web.core.utils.RandomUtil;
import com.zxwl.web.core.utils.WebUtil;
import com.zxwl.web.dao.resource.ResourcesMapper;
import com.zxwl.web.service.config.ConfigService;
import com.zxwl.web.service.impl.AbstractServiceImpl;
import com.zxwl.web.service.resource.FileService;
import com.zxwl.web.service.resource.ResourcesService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 资源服务类
 * Created by generator
 */
@Service("resourcesService")
public class ResourcesServiceImpl extends AbstractServiceImpl<Resources, String> implements ResourcesService {
    public static final String CACHE_KEY = "resources";
    @Resource
    protected ConfigService configService;

    @Resource
    protected FileService fileService;

    //默认数据映射接口
    @Resource
    protected ResourcesMapper resourcesMapper;

    //默认数据映射接口
    @Override
    protected ResourcesMapper getMapper() {
        return this.resourcesMapper;
    }


    @Override
    @Cacheable(value = CACHE_KEY, key = "'id.'+#id")
    @Transactional(readOnly = true)
    public Resources selectByPk(String id) {
        return super.selectByPk(id);
    }


    @Override
    @Transactional
    public int delete(String s) {
        try {
            fileService.deleteResources(s);
        } catch (IOException e) {
            logger.error(e.getMessage());
        }
        return super.delete(s);
    }

    public int deleteByMd5(String md5) {
        return getMapper().deleteByMd5(md5);
    }

    /**
     * 根据资源md5 查询资源信息
     *
     * @param md5 md5值
     * @return 资源对象
     * @throws Exception
     */
    @Cacheable(value = CACHE_KEY, key = "'md5.'+#md5")
    @Transactional(readOnly = true)
    public Resources selectByMd5(String md5) {
        return this.selectSingle(new QueryParam().where("md5", md5));
    }

    @Override
    public Map videoDetail(String videoId, String userId) {
        return getMapper().videoDetail(videoId,userId);
    }

    @Override
    public List<Map>  videoImgUrl(String videoId) {
        return getMapper().videoImgUrl(videoId);
    }

    /**
     * 根据用户 avatarId 获取用户头像地址
     * @param recordId
     * @return
     */
    @Override
    public Resources selectSingleImage(String recordId) {
        return getMapper().selectSingleImage(recordId);
    }

    /**
     * 根据用户 recordId 获取图像地址
     * @param basePath
     * @param recordId
     * @return String 图像地址实际请求路径
     */
    @Override
    public String selectSingleImage(String basePath, String recordId) {
        Resources resource = this.selectSingleImage(recordId);
        if (resource == null || resource.getMd5() == null || "".equals(resource.getMd5()))
            return "";
        StringBuffer sb = new StringBuffer();
        sb.append(basePath).append("file/image/").append(resource.getMd5()).append(".jpg");
        return sb.toString();
    }

    @Override
    public List<Resources> selectAllImage(String recordId) {
        return resourcesMapper.selectAllImage(recordId);
    }

    /**
     * 获取多张图片
     * @param basePath
     * @param recordId
     * @return
     */
    public List<String> selectImages(String basePath, String recordId) {
        List<String> imageUrls = new ArrayList<>();
        List<Resources> images = this.selectAllImage(recordId);
        for (Resources image : images) {
            if (image != null && image.getMd5() != null && !"".equals(image.getMd5())) {
                StringBuffer sb = new StringBuffer()
                        .append(basePath)
                        .append("file/image/")
                        .append(image.getMd5());
                imageUrls.add(sb.toString());
            }
        }
        return imageUrls;
    }

    @Override
    public PagerResult<Map> selectVideoListByUserId(PagerParamApi pagerParamApi,String userId) {
        PagerResult<Map> pagerResult = new PagerResult<>();
        List<Map> hashMapList = getMapper().selectVideoListByUserId(userId);
        int total = hashMapList.size();
        pagerResult.setTotal(total);
        if (total == 0) {
            pagerResult.setData(new ArrayList<>());
        } else {

            //根据实际记录数量重新指定分页参数
            pagerResult.setData(getMapper().pagerVideoListByUserId(pagerParamApi));
        }
        return pagerResult;
    }

    @Override
    public List<Map> userVideoListByUserId(String userId) {
        return getMapper().userVideoList(userId);
    }

    @Override
    public int updateStatus( String userId, String videoId, int status) {
        return getMapper().updateStatus(userId, videoId, status);
    }

    @Override
    public List<Resources> fridendVideoList(String friendId) {
        return getMapper().fridendVideoList(friendId);
    }

    @Override
    public List<Resources> VideoList() {
        return getMapper().VideoList();
    }

    @Override
    @Transactional(rollbackFor = Throwable.class)
    @Caching(evict = {
            @CacheEvict(value = CACHE_KEY, key = "'id.'+#data.id"),
            @CacheEvict(value = CACHE_KEY, key = "'md5.'+#data.md5")
    })
    public String insert(Resources data) {
        data.setId(this.newId(6));//6位随机id
        return super.insert(data);
    }

    public String newId(int len) {
        String id = RandomUtil.randomChar(len);
        for (int i = 0; i < 10; i++) {
            if (this.selectByPk(id) == null) {
                return id;
            }
        }  //如果10次存在重复则位数+1
        return newId(len + 1);
    }
}
