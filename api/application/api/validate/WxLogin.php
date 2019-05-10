<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-05-06
 * Time: 16:48
 */

namespace app\api\validate;


use app\api\lib\ResponseCode;
use app\api\lib\ResponseTools;
use think\Validate;

class WxLogin extends Validate
{
    public function get ($code, $info)
    {
        /*参数必传*/
        if (!$code || !$info) {
            return ResponseTools::return_error(ResponseCode::PARAMETER_INCOMPLETENESS);
        }

        $WxLogin_model = new \app\api\model\WxLogin();
        $data = $WxLogin_model->login($code, $info);
        return ResponseTools::return_error($WxLogin_model->error, $data);
    }
}