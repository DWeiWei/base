package com.zxwl.web.bean;
import com.zxwl.web.bean.po.GenericPo;
/**
* 资源、使用记录表
* Created by generator Jul 21, 2017 2:15:55 AM
*/
public class MetaDataRel extends GenericPo<String>{
  		//图片id，与 t_metadata 表 u_id 关联
        private String dataId;
  		//类型： 0 图片，1 视频
        private int type;

        private String recordId;

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    /**
        * 获取 图片id，与 t_metadata 表 u_id 关联
        * @return String 图片id，与 t_metadata 表 u_id 关联
        */
        public String getDataId(){
			return this.dataId;
        }

        /**
        * 设置 图片id，与 t_metadata 表 u_id 关联
        */
        public void setDataId(String dataId){
        	this.dataId=dataId;
        }
        /**
        * 获取 类型： 0 图片，1 视频
        * @return int 类型： 0 图片，1 视频
        */
        public int getType(){
			return this.type;
        }

        /**
        * 设置 类型： 0 图片，1 视频
        */
        public void setType(int type){
        	this.type=type;
        }

    public MetaDataRel(String dataId, int type, String recordId) {
        this.dataId = dataId;
        this.type = type;
        this.recordId = recordId;
    }

    public interface Property extends GenericPo.Property{
                //图片id，与 t_metadata 表 u_id 关联
                 String dataId="dataId";
                 String recordId="recordId";
                //类型： 0 图片，1 视频
                 String type="type";
    	}
}