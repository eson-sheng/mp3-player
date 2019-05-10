<?php
/**
 * Created by PhpStorm.
 * User: eson
 * Date: 2019-05-06
 * Time: 16:52
 */

namespace app\api\model;


use app\api\lib\ResponseCode;
use think\Model;

class WxLogin extends Model
{
    // 设置当前模型对应的完整数据表名称
    protected $table = 'wx_user';
    public $error = NULL;

    /**
     * @param $code
     * @return array
     */
    public function login ($code, $wx_info)
    {
        $app_id = config('wx')['app_id'];
        $secret = config('wx')['secret'];

        $url = "https://api.weixin.qq.com/sns/jscode2session?appid={$app_id}&secret={$secret}&js_code={$code}&grant_type=authorization_code";

        $json = file_get_contents($url);
        $info = json_decode($json, true);

        $this->error = ResponseCode::SUCCESS;
        return $this->_do_login($info, $wx_info);
    }

    private function _do_login ($info, $wx_info)
    {
        $param = [
            'wx_openid' => $info['openid'],
            'wx_session_key' => $info['session_key'],
            'wx_info' => $wx_info,
        ];

        $user_obj = WxLogin::get([
            'wx_openid' => $param['wx_openid']
        ]);

        if ($user_obj) {
            $user_obj->wx_session_key = $param['wx_session_key'];
            $user_obj->wx_info = $wx_info;
            $user_obj->save();
            $uid = $user_obj->id;
            /*扫描文件夹*/
            $bool = $this->scanDir("{$uid}-{$param['wx_openid']}");
        } else {
            $user = new WxLogin();
            $user->save($param);
            $uid = $user->id;
            /*创建文件夹*/
            $bool = $this->creatDir("{$uid}-{$param['wx_openid']}");
        }

        return [
            'uid' => $uid,
            'dir_status' => $bool,
        ];
    }

    private function creatDir ($dirName)
    {
        $upload_audio = __DIR__ . "/../../../public/upload_audio";
        if (!file_exists($upload_audio)) {
            mkdir($upload_audio, 0777);
        }

        if (!file_exists("{$upload_audio}/{$dirName}")) {
            return mkdir("{$upload_audio}/{$dirName}", 0777);
        }

        return true;
    }

    private function scanDir ($dirName, $init = true)
    {
        if ($init) {
            $path = __DIR__ . "/../../../public/upload_audio/{$dirName}";
        } else {
            $path = $dirName;
        }

        $uid = explode("-", $dirName)[0];
        $audio_model = new Audio();
        $ids = [];

        /*便利文件夹文件*/
        $handle = opendir($path);//打开目录句柄
        if ($handle) {
            while (($file = readdir($handle)) == true) {
                if ($file != '.' && $file != '..') {
                    $p = "{$path}/{$file}";
                    if (is_dir($p)) {
                        $this->scanDir($p, 0);
                    } else {

                        if (pathinfo($p, PATHINFO_EXTENSION) == 'mp3') {
                            $audio_info = $this->get_audio_info($p);
                            $jpg_info = $this->get_audio_jpg($p);

                            $src = str_replace(
                                __DIR__ . "/../../../public",
                                '',
                                $p
                            );

                            $db_param = [
                                'uid' => $uid,
                                'name' => $audio_info['title'],
                                'src' => $src,
                                'poster' => $jpg_info['img_src'],
                                'author' => $audio_info['artist'],
                                'length' => $audio_info['duration'],
                            ];

                            $db_ret = $audio_model->saveAudio($db_param);

                            if ($db_ret) {
                                $ids[] = $db_ret['id'];
                            }
                        }
                    }
                }
            }
        }

        $audio_model->db_dir_well($uid, $ids);
        return true;
    }

    private function get_audio_info ($file)
    {
        $command = sprintf('ffprobe "%s" 2>&1', $file);

        ob_start();
        passthru($command);
        $info = ob_get_contents();
        ob_end_clean();

        $data = array();
        if (preg_match("/Duration: (.*?), start: (.*?), bitrate: (\d*) kb\/s/", $info, $match)) {
            $data['file_name'] = pathinfo($file)['basename']; //文件名称
            $data['duration'] = $match[1]; //播放时间
            $arr_duration = explode(':', $match[1]);
            $data['seconds'] = $arr_duration[0] * 3600 + $arr_duration[1] * 60 + $arr_duration[2]; //转换播放时间为秒数
            $data['start'] = $match[2]; //开始时间
            $data['bitrate'] = $match[3]; //码率(kb)
        }
        if (preg_match("/artist          : (.*?)\n/", $info, $match)) {
            $data['artist'] = $match[1];
        }
        if (preg_match("/title           : (.*?)\n/", $info, $match)) {
            $data['title'] = $match[1];
        }
        if (isset($data['seconds']) && isset($data['start'])) {
            $data['play_time'] = $data['seconds'] + $data['start']; //实际播放时间
        }
        $data['size'] = filesize($file); //文件大小

        /*播放时间处理*/
        $data['duration'] = substr($data['duration'], 3, 5);

        return $data;
    }

    private function get_audio_jpg ($p)
    {
        $dirname = pathinfo($p, PATHINFO_DIRNAME);
        $filename = pathinfo($p, PATHINFO_FILENAME);
        $path = "{$dirname}/{$filename}";

        $command = sprintf(
            'ffmpeg -i "%s" -an -vcodec copy "%s" 2>&1',
            "{$path}.mp3",
            "{$path}.jpg"
        );

        ob_start();
        passthru($command);
        $info = ob_get_contents();
        ob_end_clean();

        $img_src = str_replace(
            __DIR__ . "/../../../public",
            '',
            "{$path}.jpg"
        );

        return [
            'img_src' => $img_src,
            'info' => $info,
        ];
    }

}