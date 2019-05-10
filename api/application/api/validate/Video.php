<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-04-15
 * Time: 16:27
 */

namespace app\api\validate;

use app\api\lib\ResponseCode;
use app\api\lib\ResponseTools;
use think\Validate;

class Video extends Validate
{
    public function check_getList ($page)
    {
        /*参数必传*/
        if (!$page) {
            return ResponseTools::return_error(ResponseCode::PARAMETER_INCOMPLETENESS);
        }

        $video_model = new \app\api\model\Video();
        $data = $video_model->get_list($page);
        return ResponseTools::return_error($video_model->error, $data);
    }

    public function check_getVideoInfo ($id)
    {
        /*参数必传*/
        if (!$id) {
            return ResponseTools::return_error(ResponseCode::PARAMETER_INCOMPLETENESS);
        }

        $video_model = new \app\api\model\Video();
        $data = $video_model->getVideoInfo($id);
        return ResponseTools::return_error($video_model->error, $data);
    }

    public function add ($name, $author, $file)
    {
        /*参数必传*/
        if (!$name || !$author || !$file) {
            return ResponseTools::return_error(ResponseCode::PARAMETER_INCOMPLETENESS);
        }

        $video_model = new \app\api\model\Video();
        $data = $video_model->add_video_info($name, $author, $file);
        return ResponseTools::return_error($video_model->error, $data);
    }
}