<?php
namespace lib;

use lib\register;
class FacebookUser {
    private $_db;
    private $table = 'facebook_user';

    public function __construct() {
        if (register::getInstance("db")) {
            $this->_db = register::getInstance('db');
        }
    }

    public function getByUid($uid) {
        if (!$uid) {
            return false;
        }
        $table = $this->table;
        return $this->_db->get($table, '*', [
                'facebook_uid' => $uid
        ]);
    }

    public function insert($insert_data = []) {
        if (!$insert_data || !is_array($insert_data)) {
            return false;
        }
        $table = $this->table;
        $insert_data['created_time'] = time();
        return $this->_db->insert($table, $insert_data);
    }

    public function updateById($id, $update_data) {
        if (!$id || !$update_data) {
            return false;
        }
        $table = $this->table;
        return $this->_db->update($table, $update_data, [
                'id' => $id
        ]);
    }

}