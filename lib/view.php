<?php
namespace lib;

class view{
    public $path;
    public $root_path;
    public $view;
    public $loader;

    public function __construct($path,$root_path='')
    {
          $this->path = $path;
          if(!$root_path){

              $root_path = app_path;
          }
          $this->root_path = $root_path;

          $loader = new \Twig_Loader_Filesystem([$this->path,$this->root_path]);
          $this->loader =  $loader;
          $this->view =  new \Twig_Environment($loader);
    }

    public function display($template,$arg=[]){
        //判断是否有该文件
        if(!is_file($this->path.'/'.$template))
        {
            $this->showPublicTemp($template,$arg);
        }else{
            //echo $pubDir;
            $this->view->display($template,$arg);
        }

    }
    public function embedStatScript($phase, $product){
        $json = array(
               'title'      => $product['title'],
               'product_id' => $product['product_id'],
               'template'    => $product['theme'],
               'type'        => $phase
        );
        $product  = json_encode($json);
        return $product;
        // echo "<!--STATISTICS -->\n";
        // echo "<script>{% include '/public/javascript/tongji.min.js' %}\n window.addEventListener('load', function(){ window.submitData(JSON.parse('$product')) });</script>";
    }
    public function render($template,$arg=[])
    {
       return $this->view->render($template,$arg);
    }
    public function showSuccessTemplates($theme,$data)
    {
        $template ='success.twig';
        $data['pageSign']="success";
        if(!is_file($this->path.'/'.$template))
        {
            $this->showPublicTemp($template,$data);
        }else{
            $this->view->display($template,$data);
        }
    }
    public function showErrorTemplates($data)
    {
        $this->view->display('error_pay.twig',$data);
    }
    public function show_404()
    {
        $this->loader->prependPath('public/theme');
        $this->view->display('404_template.twig');
    }

    public function showPublicErrorTemp($data){
        $this->loader->prependPath('public/theme');
        $this->view->display('public_errors_template.twig',$data);
    }

    public function showPublicTemp($template,$data){
        $this->loader->prependPath('public/theme');
        if(!is_file('public/theme/'.$template)){
            $this->show_404();
            exit;
        }
        $this->view->display($template,$data);
    }


}