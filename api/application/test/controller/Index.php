<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-04-12
 * Time: 20:26
 */

namespace app\test\controller;

use think\Controller;

class Index extends Controller
{
    public function index ()
    {
        /*测试数据库*/
        $ret = \think\Db::name('test')->find();
        dump($ret);
    }
}