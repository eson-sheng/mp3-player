<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-05-09
 * Time: 13:38
 */

namespace app\api\controller;


use think\Controller;

class Audio extends Controller
{
    public function list()
    {
        $uid = $this->request->param('uid', FALSE);

        $validate_Aideo = new \app\api\validate\Audio();
        return $validate_Aideo->check_getList($uid);
    }
}