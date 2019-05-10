<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-04-12
 * Time: 20:46
 */

namespace app\api\lib;

class ResponseTools
{
    public static function return_error ($errno, $data = [], $status = false)
    {
        if ($errno == ResponseCode::SUCCESS) {
            $status = true;
        }

        if ($errno == null) {
            return json([
                'errno' => 0,
                'data' => [],
                'status' => $status,
                'error_msg' => '系统异常',
            ]);
        }

        $error_msg = ResponseCode::CODE_MAP[$errno];
        return json([
            'errno' => $errno,
            'data' => $data,
            'status' => $status,
            'error_msg' => $error_msg,
        ]);
    }
}