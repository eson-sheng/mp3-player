<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-04-12
 * Time: 20:45
 */

namespace app\api\validate;

use app\api\lib\ResponseCode;
use app\api\lib\ResponseTools;
use think\Validate;

class Lunbotu extends Validate
{
    public function get ($tu)
    {
        /*参数必传*/
        if (!$tu) {
            return ResponseTools::return_error(ResponseCode::PARAMETER_INCOMPLETENESS);
        }

        /*模块查找用户*/
        $lunbotu_model = new \app\api\model\Lunbotu();
        $data = $lunbotu_model->get_img_info();
        return ResponseTools::return_error($lunbotu_model->error, $data);
    }

    public function add ($title, $img, $href)
    {
        /*参数必传*/
        if (!$title || !$img || !$href) {
            return ResponseTools::return_error(ResponseCode::PARAMETER_INCOMPLETENESS);
        }

        $lunbotu_model = new \app\api\model\Lunbotu();
        $data = $lunbotu_model->add_img_info($title, $img, $href);
        return ResponseTools::return_error($lunbotu_model->error, $data);
    }
}