<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-04-12
 * Time: 20:47
 */

namespace app\api\lib;

class ResponseCode
{
    // 成功
    const SUCCESS = 200;
    // 参数不完整
    const PARAMETER_INCOMPLETENESS = -4001;
    // 保存参数错误
    const SAVE_ERROR = -5001;
    // 获取参数错误
    const NOT_HAVE_DATA = -5004;

    const CODE_MAP = [
        self::SUCCESS => 'OKAY',
        self::PARAMETER_INCOMPLETENESS => '参数不完整',
        self::SAVE_ERROR => '保存参数错误',
        self::NOT_HAVE_DATA => '获取参数错误',
    ];
}