/*
 * Copyright 2015-2016 http://zxwl.me
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.zxwl.web.controller.file;

import com.alibaba.fastjson.JSON;
import com.zxwl.web.bean.po.GenericPo;
import com.zxwl.web.core.utils.WebUtil;
import org.hsweb.commons.StringUtils;
import org.hsweb.expands.compress.Compress;
import org.hsweb.expands.compress.zip.ZIPWriter;
import org.hsweb.expands.office.excel.ExcelIO;
import org.hsweb.expands.office.excel.config.Header;
import com.zxwl.web.bean.po.resource.Resources;
import com.zxwl.web.core.authorize.annotation.Authorize;
import com.zxwl.web.core.exception.NotFoundException;
import com.zxwl.web.core.logger.annotation.AccessLogger;
import com.zxwl.web.core.message.ResponseMessage;
import com.zxwl.web.service.resource.FileService;
import com.zxwl.web.service.resource.ResourcesService;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.http.MediaType;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * 文件管理控制器，用于上传和下载资源文件
 *
 * @author zhouhao
 * @since 1.0
 */
@RestController
@RequestMapping(value = "/file")
@AccessLogger("文件管理")
// @Authorize
public class FileController {

    private org.slf4j.Logger logger = LoggerFactory.getLogger(this.getClass());

    @Resource
    private ResourcesService resourcesService;

    @Autowired(required = false)
    private CacheManager cacheManager;

    @Resource
    private FileService fileService;

    //文件名中不允许出现的字符 \ / : | ? < > "
    private static final Pattern fileNameKeyWordPattern = Pattern.compile("(\\\\)|(/)|(:)(|)|(\\?)|(>)|(<)|(\")");

    private static final Map<String, String> mediaTypeMapper = new HashMap<>();

    static {
        mediaTypeMapper.put("png", MediaType.IMAGE_PNG_VALUE);
        mediaTypeMapper.put("jpg", MediaType.IMAGE_JPEG_VALUE);
        mediaTypeMapper.put("jpeg", MediaType.IMAGE_JPEG_VALUE);
        mediaTypeMapper.put("gif", MediaType.IMAGE_GIF_VALUE);
        mediaTypeMapper.put("bmp", MediaType.IMAGE_JPEG_VALUE);
        mediaTypeMapper.put("json", MediaType.APPLICATION_JSON_VALUE);
        mediaTypeMapper.put("txt", MediaType.TEXT_PLAIN_VALUE);
        mediaTypeMapper.put("css", MediaType.TEXT_PLAIN_VALUE);
        mediaTypeMapper.put("js", "application/javascript");
        mediaTypeMapper.put("html", MediaType.TEXT_HTML_VALUE);
        mediaTypeMapper.put("xml", MediaType.TEXT_XML_VALUE);
        mediaTypeMapper.put("mp4", "video/mp4");
    }

    /**
     * 构建并下载excel
     *
     * @param name       excel文件名
     * @param headerJson 表头配置JSON 格式:{@link Header}
     * @param dataJson   数据JSON 格式:{@link List<Map<String,Object>}
     * @param response   {@link HttpServletResponse}
     * @throws Exception   构建excel异常
     * @throws IOException 写出excel异常
     */
    @RequestMapping(value = "/download/{name}.xlsx", method = {RequestMethod.POST})
    @AccessLogger("下载excel文件")
    public void downloadExcel(@PathVariable("name") String name,
                              @RequestParam("header") String headerJson,
                              @RequestParam("data") String dataJson,
                              HttpServletResponse response) throws Exception {
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(name, "utf-8") + ".xlsx");
        List<Header> headers = JSON.parseArray(headerJson, Header.class);
        List<Map> datas = JSON.parseArray(dataJson, Map.class);
        ExcelIO.write(response.getOutputStream(), headers, (List) datas);
    }

    /**
     * 构建并下载zip文件.仅支持POST请求
     *
     * @param name     文件名
     * @param dataStr  数据,jsonArray. 格式:[{"name":"fileName","text":"fileText"}]
     * @param response {@link HttpServletResponse}
     * @throws IOException      写出zip文件错误
     * @throws RuntimeException 构建zip文件错误
     */
    @RequestMapping(value = "/download-zip/{name:.+}", method = {RequestMethod.POST})
    @AccessLogger("下载zip文件")
    public void downloadZip(@PathVariable("name") String name,
                            @RequestParam("data") String dataStr,
                            HttpServletResponse response) throws IOException {
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(name, "utf-8"));
        ZIPWriter writer = Compress.zip();
        List<Map<String, String>> data = (List) JSON.parseArray(dataStr, Map.class);
        data.forEach(map -> writer.addTextFile(map.get("name"), map.get("text")));
        writer.write(response.getOutputStream());
    }

    /**
     * 构建一个文本文件,并下载.支持GET,POST请求
     *
     * @param name     文件名
     * @param text     文本内容
     * @param response {@link HttpServletResponse}
     * @throws IOException 写出文本内容错误
     */
    @RequestMapping(value = "/download-text/{name:.+}", method = {RequestMethod.GET, RequestMethod.POST})
    @AccessLogger("下载text文件")
    public void downloadTxt(@PathVariable("name") String name,
                            @RequestParam("text") String text,
                            HttpServletResponse response) throws IOException {
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(name, "utf-8"));
        response.getWriter().write(text);
    }


    /**
     * 使用restful风格,通过文件ID下载已经上传的文件,支持断点下载
     * 如: http://host:port/file/download/aSk2a/file.zip 将下载 ID为aSk2a的文件.并命名为file.zip
     *
     * @param id       文件ID
     * @param name     文件名
     * @param response {@link HttpServletResponse}
     * @param request  {@link HttpServletRequest}
     * @return 下载结果, 在下载失败时, 将返回错误信息
     * @throws IOException       读写文件错误
     * @throws NotFoundException 文件不存在
     */
    @RequestMapping(value = "/download/{id}/{name:.+}", method = RequestMethod.GET)
    @AccessLogger("下载文件")
    public ResponseMessage restDownLoad(@PathVariable("id") String id,
                                        @PathVariable("name") String name,
                                        HttpServletResponse response, HttpServletRequest request) throws Exception {
        return downLoad(id, name, response, request);
    }

    /**
     * 通过文件ID下载已经上传的文件,支持断点下载
     * 如: http://host:port/file/download/aSk2a/file.zip 将下载 ID为aSk2a的文件.并命名为file.zip
     *    http://host:port/file/render/a.jpg
     *
     * @param id       要下载资源文件的id
     * @param name     自定义文件名，该文件名不能存在非法字符.如果此参数为空(null).将使用文件上传时的文件名
     * @param response {@link HttpServletResponse}
     * @param request  {@link HttpServletRequest}
     * @return 下载结果, 在下载失败时, 将返回错误信息
     * @throws IOException       读写文件错误
     * @throws NotFoundException 文件不存在
     */
    @RequestMapping(value = {"/download/{id}", "/render/{id}"}, method = RequestMethod.GET)
    @AccessLogger("下载文件, 静态资源加载")
    public ResponseMessage downLoad(@PathVariable("id") String id,
                                    @RequestParam(value = "name", required = false) String name,
                                    HttpServletResponse response, HttpServletRequest request) throws Exception {
        // 根据 主键id, 文件md5 从数据库查找图片资源信息
        Resources resources = resourcesService.selectByPk(id);
        if(resources == null) {
            resources = resourcesService.selectByMd5(id);
        }
        if (resources == null || resources.getStatus() != 1)
            throw new NotFoundException("文件不存在");

        if (!"file".equals(resources.getType()))
            throw new NotFoundException("文件不存在");

        //获取contentType，默认application/octet-stream
        //如果是 mp4 类型，则对请求头做特殊处理
        String fileType = resources.getSuffix().toLowerCase();
        if ("mp4".equals(fileType)) {
            File f = new File(fileService.getFileBasePath().concat(resources.getPath().concat("/".concat(resources.getMd5()))));
            MultipartFileSender.fromPath(f.toPath()).with(request).with(response).serveResource();
            return null;
        }

        String contentType = mediaTypeMapper.get(resources.getSuffix().toLowerCase());
        if (contentType == null){
            contentType = "application/octet-stream";
        }
        //未自定义文件名，则使用上传时的文件名
        if (StringUtils.isNullOrEmpty(name))
            name = resources.getName();
        //如果未指定文件拓展名，则追加默认的文件拓展名
        if (!name.contains("."))
            name = name.concat(".").concat(resources.getSuffix());
        //关键字剔除
        name = fileNameKeyWordPattern.matcher(name).replaceAll("");
        int skip = 0;
        long fSize = resources.getSize();
        //尝试判断是否为断点下载
        try {
            //获取要继续下载的位置
            String Range = request.getHeader("Range").replaceAll("bytes=", "").replaceAll("-", "");
            skip = StringUtils.toInt(Range);
        } catch (Exception e) {
        }
        response.setContentLength((int) fSize);//文件大小
        response.setContentType(contentType);
        //response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(name, "utf-8"));
        //try with resource
        try (BufferedInputStream inputStream = new BufferedInputStream(fileService.readResources(resources));
             BufferedOutputStream stream = new BufferedOutputStream(response.getOutputStream())) {
            //断点下载
            if (skip > 0) {
                inputStream.skip(skip);
                response.setStatus(HttpServletResponse.SC_PARTIAL_CONTENT);
                String contentRange = new StringBuffer("bytes ").append(skip).append("-").append(fSize - 1).append("/").append(fSize).toString();
                response.setHeader("Content-Range", contentRange);
            }
            byte b[] = new byte[2048 * 10];
            while ((inputStream.read(b)) != -1) {
                stream.write(b);
            }
            stream.flush();
        } catch (IOException e) {
            logger.debug(String.format("download file error%s", e.getMessage()));
            throw e;
        }
        return null;

    }

    /**
     * 单文件上传，获取到文件流后,调用{@link FileService#saveFile(InputStream, String)}进行文件保存
     * 上传成功后,将返回资源信息如:{"id":"fileId","name":"fileName","md5":"md5"}
     *
     * @param file
     * @return 文件上传结果.
     * @throws IOException 文件保存错误
     */
    @RequestMapping(value = "/upload", method = RequestMethod.POST)
    @AccessLogger("单上传文件")
    public ResponseMessage upload(@RequestParam("file") MultipartFile file) throws IOException {
        Resources resources = null;
        if (!file.isEmpty()) {
            if (logger.isInfoEnabled())
                logger.info("start write file:{}", file.getOriginalFilename());
            String fileName = file.getOriginalFilename();
            resources = fileService.saveFile(file.getInputStream(), fileName);
            // resourcesList.add(resources);
        }

        //响应上传成功的资源信息
        return ResponseMessage.ok(resources);
    }

    /**
     * 上传文件,支持多文件上传.获取到文件流后,调用{@link FileService#saveFile(InputStream, String)}进行文件保存
     * 上传成功后,将返回资源信息如:[{"id":"fileId","name":"fileName","md5":"md5"}]
     *
     * @param files 文件列表
     * @return 文件上传结果.
     * @throws IOException 保存文件错误
     */
    @RequestMapping(value = "/upload-multi", method = RequestMethod.POST)
    @AccessLogger("多上传文件")
    public ResponseMessage uploadMulti(@RequestParam("file") MultipartFile[] files) throws IOException {
        if (logger.isInfoEnabled())
            logger.info(String.format("start upload , file number:%s", files.length));
        List<Resources> resourcesList = new LinkedList<>();
        for (int i = 0; i < files.length; i++) {
            MultipartFile file = files[i];
            if (!file.isEmpty()) {
                if (logger.isInfoEnabled())
                    logger.info("start write file:{}", file.getOriginalFilename());
                String fileName = file.getOriginalFilename();
                Resources resources = fileService.saveFile(file.getInputStream(), fileName);
                resourcesList.add(resources);
            }
        }//响应上传成功的资源信息
        return ResponseMessage.ok(resourcesList)
                .include(Resources.class, "id", "name", "md5");
    }

    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @AccessLogger("删除文件")
    @Authorize
    public ResponseMessage delete(@RequestParam("key") String key) {
        // 根据 主键id, 文件md5 从数据库查找图片资源信息
        Resources resources = resourcesService.selectByPk(key);
        if(resources == null) {
            resources = resourcesService.selectByMd5(key);
        }
        if (resources == null || resources.getStatus() != 1)
            throw new NotFoundException("文件不存在");

        // 不进行删除逻辑

        /*try {
            fileService.deleteResources(resources);
        } catch (IOException e) {
            logger.warn("Delete upload file error: {}", e.getMessage());
        }*/

        return ResponseMessage.ok().setMessage("删除成功");
    }

    @RequestMapping(value = "/imageUpload", method = RequestMethod.POST)
    @AccessLogger("上传文件")
    public Map<String, Object> imageUpload(@RequestParam("imgFile") MultipartFile imgFile, HttpServletRequest req) throws IOException {
        if (logger.isInfoEnabled())
            logger.info("start upload.");
        // List<Resources> resourcesList = new LinkedList<>();
        Resources resources = null;
        if (!imgFile.isEmpty()) {
            if (logger.isInfoEnabled())
                logger.info("start write file:{}", imgFile.getOriginalFilename());
            String fileName = imgFile.getOriginalFilename();
            resources = fileService.saveFile(imgFile.getInputStream(), fileName);
            // resourcesList.add(resources);
        }

        HashMap<String, Object> result = new HashMap<>();
        if(resources.getId() != null || !"".equals(resources.getId())){
            result.put("error", 0);
            result.put("url", WebUtil.getBasePath(req) + "file/image/" + resources.getId() + ".jpg");
        }
        else {
            result.put("error", 1);
            result.put("message", "上传图片失败");
        }

        //响应上传成功的资源信息
        return result;
    }

    @RequestMapping(value = "/image/{md5}", method = RequestMethod.GET)
    @AccessLogger("图片资源加载")
    @Authorize(anonymous = true)
    public ResponseMessage loadImage(@PathVariable("md5") String md5, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Resources resources = resourcesService.selectByMd5(md5);
        if(resources == null || resources.getStatus() != 1){        //用 "/image/{id}"也能请求到图片
            resources = resourcesService.selectByPk(md5);
        }
        if (resources == null || resources.getStatus() != 1) {
            throw new NotFoundException("文件不存在");
        } else {
            if (!"file".equals(resources.getType()))
                throw new NotFoundException("文件不存在");
            String name = resources.getName();

            //如果未指定文件拓展名，则追加默认的文件拓展名
            if (!name.contains("."))
                name = name.concat(".").concat(resources.getSuffix());
            //关键字剔除

            String contentType = "image/*";
            //获取contentType，默认image/*
            if(name != null && name.endsWith(".mp4")){
                contentType = "video/*";
            }

            name = fileNameKeyWordPattern.matcher(name).replaceAll("");
            int skip = 0;
            long fSize = resources.getSize();

            response.setContentLength((int) fSize);//文件大小
            response.setContentType(contentType);
            //response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(name, "utf-8"));
            //try with resource
            try (BufferedInputStream inputStream = new BufferedInputStream(fileService.readResources(resources));
                 BufferedOutputStream stream = new BufferedOutputStream(response.getOutputStream())) {
                byte b[] = new byte[2048 * 10];
                while ((inputStream.read(b)) != -1) {
                    stream.write(b);
                }
                stream.flush();
                stream.close();
            } catch (IOException e) {
                logger.debug(String.format("download file error%s", e.getMessage()));
                throw e;
            }
            return null;
        }
    }

    @RequestMapping(value = "/video/{md5}", method = RequestMethod.GET)
    @AccessLogger("视频资源加载")
    @Authorize(anonymous = true)
    public ResponseMessage loadVideo(@PathVariable("md5") String md5, HttpServletRequest request, HttpServletResponse response) throws IOException {
        Resources resources = resourcesService.selectByMd5(md5);
        if(resources == null || resources.getStatus() != 1){        //用 "/video/{id}"也能请求到图片
            resources = resourcesService.selectByPk(md5);
        }
        if (resources == null || resources.getStatus() != 1) {
            throw new NotFoundException("视频不存在");
        } else {
            if (!"file".equals(resources.getType()))
                throw new NotFoundException("视频不存在");

            //获取contentType，默认application/octet-stream
            String contentType = "video/*";
            String name = resources.getName();
            //如果未指定文件拓展名，则追加默认的文件拓展名
            if (!name.contains("."))
                name = name.concat(".").concat(resources.getSuffix());
            //关键字剔除
            name = fileNameKeyWordPattern.matcher(name).replaceAll("");
            int skip = 0;
            long fSize = resources.getSize();

            response.setContentLength((int) fSize);//文件大小
            response.setContentType(contentType);
            //response.setHeader("Content-disposition", "attachment;filename=" + URLEncoder.encode(name, "utf-8"));
            //try with resource
            try (BufferedInputStream inputStream = new BufferedInputStream(fileService.readResources(resources));
                 BufferedOutputStream stream = new BufferedOutputStream(response.getOutputStream())) {
                byte b[] = new byte[2048 * 10];
                while ((inputStream.read(b)) != -1) {
                    stream.write(b);
                }
                stream.flush();
                stream.close();
            } catch (IOException e) {
                logger.debug(String.format("download file error%s", e.getMessage()));
                throw e;
            }
            return null;
        }
    }

    /*@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
    @AccessLogger("上传文件")
    public Map<String, Object> fileUpload(MultipartFile file,HttpServletRequest request) throws IllegalStateException, IOException{
        if (logger.isInfoEnabled())
            logger.info("start upload.");
        String originalFilename = file.getOriginalFilename();
        String newFileName ="";
        String pic_path;
        // 上传图片
        if ( originalFilename != null && originalFilename.length() > 0) {
            //获取Tomcat服务器所在的路径
            String tomcat_path = System.getProperty( "user.dir" );
            System.out.println(tomcat_path);
            //获取Tomcat服务器所在路径的最后一个文件目录
            String bin_path = tomcat_path.substring(tomcat_path.lastIndexOf("\\")+1,tomcat_path.length());
            System.out.println(bin_path);
            //若最后一个文件目录为bin目录，则服务器为手动启动
            if(("bin").equals(bin_path)){//手动启动Tomcat时获取路径为：D:\Software\Tomcat-8.5\bin
                //获取保存上传图片的文件路径
                pic_path = tomcat_path.substring(0,System.getProperty( "user.dir" ).lastIndexOf("\\")) +"\\webapps"+"\\pic_file\\";
            }else{//服务中自启动Tomcat时获取路径为：D:\Software\Tomcat-8.5
                pic_path = tomcat_path+"\\webapps"+"\\pic_file\\";
            }
            // 新的图片名称
            newFileName = GenericPo.createUUID() + originalFilename.substring(originalFilename.lastIndexOf("."));
            logger.info("上传图片的路径：" + pic_path + newFileName);
            // 新图片
            File newFile = new File(pic_path + newFileName);
            // 将内存中的数据写入磁盘
            file.transferTo(newFile);
        }
        return null;
    }*/
}
