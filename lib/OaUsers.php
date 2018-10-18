<?php

namespace lib;

class OaUsers {

    public $table = 'oa_users';

    public function __construct() {
        
    }

    /**
     * 获取boss的账号
     * @return string boss的账号
     */
    public function getBossUsername() {
        $where = ['manager_id' => 0, 'id_department[!]' => 0, 'username[!]' => '', 'password[!]' => '', 'ORDER' => ['uid']];
        $username = \lib\register::getInstance('db')->get($this->table, 'username', $where);
        return $username ? $username : 'wangjianxi';
    }

    /**
     * 获取上级账号
     * @param int $ad_member_id 优化师账号id
     * @return string 上级账号
     */
    public function findManagerUserName($ad_member_id) {

        if (empty($ad_member_id)) {//如果账号id为空，就直接返回boss账号
            return $this->getBossUsername(); //直接返回boss账号
        }

        //获取 $ad_member_id 对应的用户数据
        $data = \lib\register::getInstance('db')->get($this->table, ['manager_id', 'username', 'password', 'id_department'], ['uid' => $ad_member_id]);
        if (empty($data)) {//如果用户不存在，就直接返回boss账号
            return $this->getBossUsername();
        }

        $manager_id = $data['manager_id']; //上级id
        if (empty($manager_id)) {//如果是大boss，就直接返回 boss
            if ($data['username'] && $data['password'] && $data['id_department']) {//如果是在职人员，就返回账号
                return $data['username'];
            }

            return $this->getBossUsername(); //直接返回boss账号
        }

        //获取  $ad_member_id 的上级数据
        $managerData = \lib\register::getInstance('db')->get($this->table, ['username', 'uid', 'password', 'id_department'], ['uid' => $manager_id]);
        if (empty($managerData)) {
            return $this->getBossUsername(); //直接返回boss账号
        }

        if ($managerData['username'] && $managerData['password'] && $managerData['id_department']) {//如果是在职人员，就返回账号
            return $managerData['username'];
        }

        return $this->findManagerUserName($managerData['uid']);
    }

    /**
     * 通过中文名获取优化师账号
     * @param string $name_cn
     * @param int $ad_member_id 账号id
     * @return string 优化师账号
     */
    public function getUsernameByCn($name_cn, $ad_member_id = 0) {
        //离职人员：oa_users.password 为空
        //如果$name_cn 对应的优化师已经离职，就将该优化师对应的订单归属为主管，如果该部门没有主管就修改为归属的经理，如果没有经理就修改为归属的总监，如果没有总监，就修改为大boss。

        $where = ['name_cn' => $name_cn, 'username[!]' => '', 'password[!]' => '', 'id_department[!]' => 0];
        if (empty($ad_member_id)) {//如果优化师账号id为空，就根据 $name_cn 获取有效的优化师账号
            $username = \lib\register::getInstance('db')->get($this->table, 'username', $where);
            if (!empty($username)) {//如果是有效的优化师账号，就直接返回
                return $username;
            }
            //如果 $name_cn 没有对应的优化师账号，就返回boss账号
            return $this->findManagerUserName($ad_member_id);
        }

        //获取所有 $name_cn 对应的优化师账号
        $where['ORDER'] = 'uid';
        $data = \lib\register::getInstance('db')->select($this->table, ['uid', 'username'], $where);
        if (empty($data)) {//如果 $name_cn 没有对应的优化师账号，就返回$ad_member_id的上级账号
            return $this->findManagerUserName($ad_member_id); //获取$ad_member_id的上级账号
        }

        foreach ($data as $k => $v) {
            if (($v['uid'] == $ad_member_id)) {//如果是 $ad_member_id 对应的优化师账号，就直接返回该优化师账号
                return $v['username'];
            }
        }

        return $data[0]['username']; //返回名字是 $name_cn 的最早入职的优化师账号
    }

}
