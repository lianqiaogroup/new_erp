<?php
namespace lib;

class blog{

    public $identity_tag;
    public $host;

    //二级目录
    public function setIdentityTag($value){

        $this->identity_tag = $value;
    }

    //域名
    public function setHost($value){
        $this->host = $value;
    }

    //获取基础信息
    public function getBlog(){
        $map['domain'] = $this->host;
        $map['identify_tag'] = $this->identity_tag;

        $ret  =  register::getInstance("db")->get('st_site_basic','*',$map);
        if(!$ret){
            return ['ret'=>500,'message'=>"找不到信息"];
        }
        $ret['author_thumb'] = get_image_path($ret['author_thumb']);
        $ret['product_img'] = get_image_path($ret['product_img']);
        $ret['site_master_graph'] = get_image_path($ret['site_master_graph']);
        $ret['site_bottom_img'] = get_image_path($ret['site_bottom_img']);
        $ret['site_content'] = get_content_path($ret['site_content']);
        $data['blog'] = $ret;
        $lang  = new \lib\lang($ret['language'],'');
        $data['lang'] = $lang->getLang();
        $data['comment']  = $this->getComment($ret['id'],$ret['comment_key_word'],$ret['comment_link']);
        $data['blogFriendPhotos'] = $this->getHeadPhotos(2,mt_rand(10,20),'friend');
        return $data;
    }

    //获取评论
    public function getComment($id,$keyWord,$link){

        $map['st_site_id'] = $id;
        $map['ORDER'] = ['comment_time'=>"DESC"];
        $map['LIMIT'] = [0,50];
        $data  =  register::getInstance("db")->select('st_site_comments','*',$map);
        $ret = [];
        $headImg = $total =[];

        //头像获取
        //$headPhotos =
        if($data){
            foreach ($data as $value){
                $key = $value['comment_sex'];
                if(isset($total[$key])){
                    $total[$key] += 1;
                }else{
                    $total[$key] = 1;
                }
            }

            foreach ($total as $key=>$value){
                $headImg[$key] = $this->getHeadPhotos($key,$value);
            }
            $replaceKeyWord = '<a class="btn" href="'.$link.'">'.$keyWord.'</a>';
            //头像随机
            foreach ($data as $rows){
                $rows['img'] = array_shift($headImg[$rows['comment_sex']]);
                if($rows['comment_praise'] > 9999){
                    $rows['comment_praise'] ='9999+';
                }

                if(strpos($rows['comment_content'],$keyWord) !==false){
                    $rows['comment_content'] = str_replace($keyWord,$replaceKeyWord,$rows['comment_content']);
                }

                $ret[] = $rows;
            }
        }
        return $ret;
    }

    //获取随机头像
    /**
     * @param int $sex 性别 2 随机 0 女 1 男
     * @param int $num 数量
     * @return array
     */
    public function getHeadPhotos($sex =1 ,$num=1, $type ='comment'){

          if($type == 'friend'){
              $prefixs = [IMGURL.'/headImg/friend'];
              $sex = 0;
          }else{
              $prefixs = [IMGURL.'/headImg/female',IMGURL.'/headImg/male'];
          }
          $row =[];
          $retKey = $this->createUniqueRand($num);
          foreach ($retKey as $value){

              if($sex ==0){
                  $prefix = $prefixs[0];
              }elseif($sex == 1){
                  $prefix = $prefixs[1];
              }else{
                  $rand = mt_rand(0,1);
                  $prefix = $prefixs[$rand];
              }

              $row[] = $prefix.$value.'.jpg';
          }
          return $row;

    }

    /**
     * @param $num
     * @return array|null
     * 随机数不重复
     */
    public function createUniqueRand($num){

        $count = 0;
        $return = [];
        while ($count < $num) {

            $return[] = mt_rand(1, 100);
            //array_unique
            $return = array_flip(array_flip($return));

            $count = count($return);
        }
        //为数组赋予新的键名
        shuffle($return);
        return $return;
    }
}