package com.zxwl.web.bean.po;


import com.alibaba.fastjson.annotation.JSONField;
import org.hsweb.commons.MD5;

import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 通用的PO对象，实现基本的属性和方法。新建的PO都应继承该类
 * Created by 浩 on 2015-07-20 0020.
 */
public class GenericPo<PK> implements Serializable, Cloneable {
    private static final long serialVersionUID = 9197157871004374522L;

    static char[] chars = {
            'a', 'b', 'c', 'd', 'e', 'f', 'g',
            'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u',
            'v', 'w', 'x', 'y', 'z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F', 'G',
            'H', 'I', 'J', 'K', 'L', 'M', 'N',
            'O', 'P', 'Q', 'R', 'S', 'T', 'U',
            'V', 'W', 'X', 'Y', 'Z'
    };

    /**
     * 主键
     */
    private PK id;

    public PK getId() {
        return id;
    }

    public void setId(PK id) {
        this.id = id;
    }

    /**
     * 自定义属性
     */
    @JSONField(serialize=false)
    private Map<String, Object> properties;

    public <T> T setProperty(String attr, T value) {
        if (properties == null) properties = new LinkedHashMap<>();
        properties.put(attr, value);
        return value;
    }

    @SuppressWarnings("unchecked")
    public <T> T getProperty(String attr) {
        if (properties == null) return null;
        return ((T) properties.get(attr));
    }

    @Override
    public int hashCode() {
        if (getId() == null) return 0;
        return getId().hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null) return false;
        return this.hashCode() == obj.hashCode();
    }


    /**
     * 创建一个主键
     *
     */
    public static String createUID() {
        return randomChar(6);
    }

    /**
     * 创建一个 UUID 主键
     *
     */
    public static String createUUID() {
        return MD5.encode(UUID.randomUUID().toString());
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }

    public interface Property {
        /**
         * 主键
         *
         * @see GenericPo#id
         */
        String id = "id";

        /**
         * 其他属性
         *
         * @see GenericPo#properties
         */
        String properties = "properties";
    }

    /**
     * 随机生成由0-9a-zA-Z组合而成的字符串
     *
     * @param len 字符串长度
     * @return 生成结果
     */
    public static String randomChar(int len) {
        StringBuffer shortBuffer = new StringBuffer();
        String uuid = UUID.randomUUID().toString().replace("-", "");
        for (int i = 0; i < len; i++) {
            String str = uuid.substring(i * 4, i * 4 + 4);
            int x = Integer.parseInt(str, 16);
            shortBuffer.append(chars[x % 0x3E]);
        }
        return shortBuffer.toString();
    }
}
