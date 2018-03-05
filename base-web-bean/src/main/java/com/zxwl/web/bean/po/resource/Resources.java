package com.zxwl.web.bean.po.resource;

import org.hsweb.commons.file.FileUtils;
import com.zxwl.web.bean.po.GenericPo;

/**
 * 资源
 * Created by generator
 */
public class Resources extends GenericPo<String> {
    private static final long serialVersionUID = 8910856253780046561L;

    //资源名称
    private String name;

    //店铺名称
    private String shopName;

    //店铺地址
    private String shopAddress;

    //好友名称
    private String userName;

    //好友头像
    private String userImg;

    //资源地址
    private String path;

    //创建时间
    private java.util.Date createDate;

    //创建人主键
    private String creatorId;

    //MD5校验值
    private String md5;

    //资源类型
    private String type;

    //资源分类
    private String classified;

    //文件大小
    private long size;

    //状态 0 表示公开，1表示不公开
    private int status;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserImg() {
        return userImg;
    }

    public void setUserImg(String userImg) {
        this.userImg = userImg;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getShopAddress() {
        return shopAddress;
    }

    public void setShopAddress(String shopAddress) {
        this.shopAddress = shopAddress;
    }

    public String getClassified() {
        return classified;
    }

    public void setClassified(String classified) {
        this.classified = classified;
    }


    public void setSize(long size) {
        this.size = size;
    }

    public long getSize() {
        return size;
    }

    /**
     * 获取 资源名称
     *
     * @return String 资源名称
     */
    public String getName() {
        if (this.name == null)
            return "";
        return this.name;
    }

    /**
     * 设置 资源名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取 资源地址
     *
     * @return String 资源地址
     */
    public String getPath() {
        if (this.path == null)
            return "";
        return this.path;
    }

    /**
     * 设置 资源地址
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * 获取 创建时间
     *
     * @return java.util.Date 创建时间
     */
    public java.util.Date getCreateDate() {
        return this.createDate;
    }

    /**
     * 设置 创建时间
     */
    public void setCreateDate(java.util.Date createDate) {
        this.createDate = createDate;
    }

    /**
     * 获取 创建人主键
     *
     * @return String 创建人主键
     */
    public String getCreatorId() {
        if (this.creatorId == null)
            return "";
        return this.creatorId;
    }

    /**
     * 设置 创建人主键
     */
    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    /**
     * 获取 MD5校验值
     *
     * @return String MD5校验值
     */
    public String getMd5() {
        if (this.md5 == null)
            return "";
        return this.md5;
    }

    /**
     * 设置 MD5校验值
     */
    public void setMd5(String md5) {
        this.md5 = md5;
    }

    /**
     * 获取 资源类型
     *
     * @return String 资源类型
     */
    public String getType() {
        if (this.type == null)
            return "";
        return this.type;
    }

    /**
     * 设置 资源类型
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取 状态
     *
     * @return int 状态
     */
    public int getStatus() {
        return this.status;
    }

    /**
     * 设置 状态
     */
    public void setStatus(int status) {
        this.status = status;
    }

    public String getSuffix() {
        /*String fileName = getName();
        return fileName == null?"":(fileName.contains(".")?fileName.substring(fileName.lastIndexOf("."), fileName.length()):"");*/

        return FileUtils.getSuffix(getName());
    }


public interface Property extends GenericPo.Property{
	/**
	 *
	 * @see Resources#userName
	 */
	String userName="userName";
    /**
     *
     * @see Resources#userImg
     */
    String userImg="userImg";
    /**
     *
     * @see Resources#name
     */
    String name="name";
    /**
     *
     * @see Resources#shopName
     */
    String shopName="shopName";
    /**
     *
     * @see Resources#shopAddress
     */
    String shopAddress="shopAddress";
	/**
	 *
	 * @see Resources#path
	 */
	String path="path";
	/**
	 *
	 * @see Resources#createDate
	 */
	String createDate="createDate";
	/**
	 *
	 * @see Resources#creatorId
	 */
	String creatorId="creatorId";
	/**
	 *
	 * @see Resources#md5
	 */
	String md5="md5";
	/**
	 *
	 * @see Resources#type
	 */
	String type="type";
	/**
	 *
	 * @see Resources#classified
	 */
	String classified="classified";
	/**
	 *
	 * @see Resources#size
	 */
	String size="size";
	/**
	 *
	 * @see Resources#status
	 */
	String status="status";
	}
}