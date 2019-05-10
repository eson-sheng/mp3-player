<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-05-09
 * Time: 13:46
 */

namespace app\api\validate;


use app\api\lib\ResponseCode;
use app\api\lib\ResponseTools;
use think\Validate;

class Audio extends Validate
{
    public function check_getList ($uid)
    {
        /*参数必传*/
        if (!$uid) {
            return ResponseTools::return_error(ResponseCode::PARAMETER_INCOMPLETENESS);
        }

        $audio_model = new \app\api\model\Audio();
        $data = $audio_model->get_list($uid);
        return ResponseTools::return_error($audio_model->error, $data);
    }
}