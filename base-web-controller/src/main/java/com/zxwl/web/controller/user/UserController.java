package com.zxwl.web.controller.user;

import com.zxwl.web.bean.common.QueryParam;
import com.zxwl.web.bean.po.role.UserRole;
import com.zxwl.web.bean.po.user.User;
import com.zxwl.web.bean.po.user.UserDefInfo;
import com.zxwl.web.controller.GenericController;
import com.zxwl.web.core.authorize.annotation.Authorize;
import com.zxwl.web.core.logger.annotation.AccessLogger;
import com.zxwl.web.core.message.ResponseMessage;
import com.zxwl.web.service.user.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.management.relation.RoleInfo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

import static com.zxwl.web.bean.po.user.User.Property.*;

/**
 * 后台管理用户控制器，继承自GenericController,使用rest+json
 * Created by generator 2015-8-26 10:35:57
 */
@RestController
@RequestMapping(value = "/user")
@AccessLogger("用户管理")
@Authorize(module = "user")
public class UserController extends GenericController<User, String> {

    //默认服务类
    @Resource
    private UserService userService;

    @Override
    public UserService getService() {
        return this.userService;
    }

    @Override
    public ResponseMessage list(QueryParam param) {
        param.excludes(password);
        return super.list(param)
                .exclude(User.class, password, modules, userRoles)
                .onlyData();
    }

    @Override
    public ResponseMessage info(@PathVariable("id") String id) {
        return super.info(id).exclude(User.class, password, modules);
    }

    @AccessLogger("禁用")
    @RequestMapping(value = "/{id}/disable", method = RequestMethod.PUT)
    @Authorize(action = "disable")
    public ResponseMessage disable(@PathVariable("id") String id) {
        getService().disableUser(id);
        return ResponseMessage.ok();
    }

    @AccessLogger("启用")
    @RequestMapping(value = "/{id}/enable", method = RequestMethod.PUT)
    @Authorize(action = "enable")
    public ResponseMessage enable(@PathVariable("id") String id) {
        getService().enableUser(id);
        return ResponseMessage.ok();
    }

    @AccessLogger("获取所有基地管理员")
    @RequestMapping(value = "/getFarmAdmin", method = RequestMethod.GET)
    @ResponseBody
    @Authorize(anonymous = true)
    public ResponseMessage listFarmAdmin(QueryParam param){
        param.setPaging(false);
        param.excludes(password);
        List list = new ArrayList();
        List<User> users = (List<User>)super.list(param)
                .exclude(User.class, password, modules, userRoles,roleInfo)
                .onlyData().getData();
        for(int i = 0;i<users.size();i++){
            User user = users.get(i);
            //因为字段过滤的问题不能过滤权限内容，所以先设空
            List<UserRole> roles = user.getUserRoles().stream().filter(role -> "farm-admin".equals(role.getRoleId())).collect(Collectors.toList());
            if(roles!=null&&roles.size()>0){
                HashMap<String,String> map = new HashMap<>();
                map.put("name",user.getName());
                map.put("id",user.getId());
                map.put("userName",user.getUsername());
                list.add(map);
            }
        }


        return ResponseMessage.ok(list);
    }
}
