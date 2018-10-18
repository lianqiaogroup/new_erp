<?php

namespace lib;

class orderSubmit {

    public $isAjax = 0;
    private $msg;
    private $success = false;
    private $lang;

    public function __construct($lang) {

        if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            $this->isAjax = 1;
        }
        $this->lang = $lang;
    }

    public function __get($key) {
        \lib\register::getInstance($key);
    }

    /**
     * 验证订单 post 数据
     * @param array $data   订单 post 数据
     * @param array $productData 产品数据
     * @return boolean 验证结果  true:验证通过  false:验证不通过
     */
    public function postCheck($data, $productData = []) {
        $number = intval($data['num']) ?: 1;
        if (strtoupper($_SERVER['REQUEST_METHOD']) != 'POST') {
            $this->msg = $this->lang['error_101'];
            return false;
        }
        if (!trim($data['name'])) {
            $this->msg = $this->lang['error_102'];
            return false;
        }
        if (!$data['address']) {
            $this->msg = $this->lang['error_103'];
            return false;
        }
        if (!$data['mob']) {
            $this->msg = $this->lang['error_104'];
            return false;
        }
        if ($number > 100 || $number < 1) {
            $this->msg = $this->lang['error_105'];
            return false;
        }
        if (empty($data['referer'])) {
            $this->msg = $this->lang['error_106'];
            return false;
        }
        if ($_SESSION['token'] != $data['token']) {
            if ($_COOKIE['formToken'] != $data['token']) {
                $this->msg = $this->lang['error_107'];
                return false;
            }
        }
        if ($data['combo_id'] == 'undefined' || $data['combo_id'] == '') {
            $this->msg = $this->lang['error_108'];
            return false;
        }

        $ruleData = [
            7 => "postal|" . $this->lang['error_116'] . "|int||length(6:6)", //新加坡地区邮编校验 校验规则：6数字
            3 => "postal|" . $this->lang['error_116'] . "|int||length(6:6)", //香港地区邮编校验 校验规则：6数字
        ];
        if (!empty($productData) && isset($ruleData[$productData['id_zone']])) {
            $validator = \lib\register::createInstance('\lib\Validator\Validator');
            $ruleStr = $ruleData[$productData['id_zone']];
            $isPass = $validator->doValidate($data, $ruleStr, true);
            if (!$isPass) {//如果验证不通过，就提示用户
                $this->msg = $validator->getMsg();
                return false;
            }
        }

        $this->success = true;
        return true;
    }

    /**
     * 获取错误信息
     * @return json|html 异步请求返回json  非异步请求返回html
     */
    public function getError() {
        if ($this->isAjax) {
            return $this->outputAjax();
        } else {
            $this->outputPost();
        }
    }

    /**
     * 获取 ajax 响应
     * @return json 
     */
    private function outputAjax() {
        if (!$this->success) {
            return json_encode(['ret_code' => 0, 'ret_msg' => $this->msg]);
        }
    }

    /**
     * 获取 html 响应
     * @return json 
     */
    private function outputPost() {
        //展示成果失败页面
        if (!$this->success) {
            $this->lang['msg'] = $this->msg;
            $data = ['lang' => $this->lang];
            \lib\register::getInstance('view')->showPublicErrorTemp($data);
        }
    }

}
