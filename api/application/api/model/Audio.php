<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-05-09
 * Time: 10:22
 */

namespace app\api\model;


use app\api\lib\ResponseCode;
use think\Db;
use think\Model;

class Audio extends Model
{
    public $error = NULL;

    public function get_list ($uid)
    {
        $audio = new Audio();

        $audio_res = $audio
            ->where('uid','eq',$uid)
            ->column('name,poster,src,author,length', 'id');

        if (!$audio_res) {
            $this->error = ResponseCode::NOT_HAVE_DATA;
            return [];
        }

        /*数据修改去除关联键值为索引键值*/
        $arr = [];
        foreach ($audio_res AS $k => $v) {
            $arr[] = $v;
        }

        $this->error = ResponseCode::SUCCESS;
        return $arr;
    }

    public function saveAudio ($param)
    {
        $audio_obj = Audio::get([
            'src' => $param['src']
        ]);

        if ($audio_obj) {
            return [
                'id' => $audio_obj->id
            ];
        }

        $audio_model = new Audio();
        $audio_model->save($param);
        return [
            'id' => $audio_model->id
        ];
    }

    public function db_dir_well ($uid, $ids)
    {
        $bindParam = [
            'uid' => $uid
        ];

        if ($ids) {
            $ids_str = implode(",", $ids);

            $sql = "
                DELETE FROM `audio` WHERE `id` NOT IN ({$ids_str}) AND `uid` = :uid
            ";

        } else {
            $sql = "
                DELETE FROM `audio` WHERE `uid` = :uid
            ";
        }

        Db::query($sql, $bindParam);
        Db::execute($sql, $bindParam);
    }
}