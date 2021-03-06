-- 建立数据库
CREATE DATABASE `wxapi-mp3` DEFAULT charset=utf8;
use `wxapi-mp3`;

-- 测试表建立
DROP TABLE IF EXISTS `test`;
CREATE TABLE IF NOT EXISTS `test`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `title` VARCHAR(128) NOT NULL COMMENT '测试',
  `time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '状态(单选):0=未激活,1=激活',
  PRIMARY KEY(`id`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='测试表管理';

INSERT INTO `test` (`title`) VALUES ('测试');

-- 微信用户表建立
DROP TABLE IF EXISTS `wx_user`;
CREATE TABLE IF NOT EXISTS `wx_user`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `wx_openid` VARCHAR(64) NOT NULL COMMENT '微信用户唯一标识 OpenID',
  `wx_session_key` VARCHAR(64) NOT NULL COMMENT '微信会话密钥 session_key',
  `wx_info` VARCHAR(256) NOT NULL COMMENT '微信用户信息',
  `reg_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `updata_time` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '状态(单选):0=未激活,1=激活',
  PRIMARY KEY(`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `wx_openid` (`wx_openid`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户管理';

-- 音频文件信息表建立
DROP TABLE IF EXISTS `audio`;
CREATE TABLE IF NOT EXISTS `audio`(
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `uid` INT UNSIGNED NOT NULL COMMENT '用户ID',
  `name` VARCHAR(128) NOT NULL COMMENT '音频名称',
  `poster` VARCHAR(256) NOT NULL COMMENT '图片地址',
  `src` VARCHAR(256) NOT NULL COMMENT '音频地址',
  `author` VARCHAR(128) NOT NULL COMMENT '作者名',
  `length` VARCHAR(32) NOT NULL COMMENT '时长',
  `time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  `status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '状态(单选):0=未激活,1=激活',
  PRIMARY KEY(`id`),
  UNIQUE KEY `src` (`src`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='音频文件信息表管理';

--