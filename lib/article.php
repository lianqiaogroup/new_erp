<?php

namespace lib;

class article
{
    public $table = 'article';

    public function __construct($register, $serverName, $theme)
    {
        $this->register = $register;
        $this->domain = $serverName;
        $this->view = new \lib\view("home/$theme", app_path);
    }

    public function getArticle($id)
    {
        $map = ['AND' => ['is_del' => 0, 'article_id' => $id, 'domain[~]' => "%" . $_SERVER['HTTP_HOST']]];
        $ret = $this->register->get('db')->get('article', "*", $map);
        if (!$ret) {
            $this->register->get('view')->show_404();
            exit;
        }
        //获取主页信息
        $product = new \lib\home($this->register,$this->domain);
        $homeInfo = $product->getHomeInfo();
        $ret['info']['logo'] = $homeInfo['logo'];
        $ret['content'] = get_content_path($ret['content']);
        return $ret;
    }

    public function getAllArticleBy($domain,$ad_member)
    {
        // $uid = $this->register->get('db')->get('oa_users', "uid", ['name_cn'=>$ad_member]);
        // $data = $this->register->get('db')->select($this->table, '*', ['domain' => $domain, 'ORDER' => ['domain' => 'ASC', 'sort' => "DESC", 'article_id' => "DESC"]], 20);
        $data = $this->register->get('db')->select($this->table, '*', ['domain' => $domain, 'is_del'=>0, 'ORDER' => ['domain' => 'ASC', 'sort' => "DESC", 'article_id' => "DESC"]], 20);
        return $data;
    }
}
