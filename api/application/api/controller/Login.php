<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-05-06
 * Time: 16:44
 */

namespace app\api\controller;


use app\api\validate\WxLogin;
use think\Controller;

class Login extends Controller
{
    public function index ()
    {
        $code = $this->request->param('code', FALSE);
        $info = $this->request->param('info', FALSE);

        $validate_WxLogin = new WxLogin();
        return $validate_WxLogin->get($code, $info);
    }
}