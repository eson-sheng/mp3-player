# 音乐mp3播放demo

## 部署说明

### 环境配置：
```json
{
    "nginx": "*",
    "mysql": "*",
    "php": ">=7.0.0",
    "ffmpeg": "*",
    "topthink/framework": "5.0.*",
    "ext-seaslog": "*"
}
```

### 安装`ffmpeg`
link：[https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)

### 服务端API目录
`./api`

### `nginx` 服务示例：
```conf
server {
    listen 80;
    server_name [域名];
    access_log  /home/wwwlogs/tp5-mp3_access.log;
    error_log   /home/wwwlogs/tp5-mp3_error.log;
    set         $root   /home/www/mp3-play/api/public;
    location ~ .*\.(gif|jpg|jpeg|bmp|png|ico|txt|js|css)$
    {
        root $root;
    }
    location / {
        root    $root;
        index   index.html index.php;
        if ( -f $request_filename) {
            break;
        }
        if ( !-e $request_filename) {
            rewrite ^(.*)$ /index.php/$1 last;
            break;
        }
    }
    location ~ .+\.php($|/) {
        fastcgi_pass    unix:/tmp/php-cgi.sock;
        fastcgi_split_path_info ^((?U).+.php)(/?.+)$;
        fastcgi_param   PATH_INFO          $fastcgi_path_info;
        fastcgi_param   PATH_TRANSLATED    $document_root$fastcgi_path_info;
        fastcgi_param   SCRIPT_FILENAME    $root$fastcgi_script_name;
        include         fastcgi_params;
    }
}
```

### `MySQL`数据库初始化文件：
`./api/sql/wxapi-mp3.sql`

### 配置文件：
- `./api/application/local_config.php`

```php
<?php
$SeasLog_base_path = __DIR__ . '/../runtime/seaslog';
SeasLog::setBasePath($SeasLog_base_path);

if (!empty($_COOKIE['PHPSESSID'])) {
    SeasLog::setRequestID($_COOKIE['PHPSESSID']);
}

return [
    // 应用调试模式
    'app_debug' => true,

    /* 微信小程序配置 */
    'wx' => [
        'app_id' => '***',
        'secret' => '***',
    ],
];
```

- `./api/application/local_database.php`

```php
<?php

return [
    // 服务器地址
    'hostname'        => 'localhost',
    // 数据库名
    'database'        => 'wxapi-mp3',
    // 用户名
    'username'        => 'root',
    // 密码
    'password'        => '***',
];
```

### 小程序目录
`./app`