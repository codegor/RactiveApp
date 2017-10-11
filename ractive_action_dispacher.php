<?php if(!defined('ABSPATH') && !defined('BASEPATH')) die('Direct access forbidden.');

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of webtransfer_dispacher
 *
 * @author esb
 */
abstract class Webtransfer_Dispacher{

  protected static $dir        = '';
  protected static $def_action = '';
  protected static $class      = '';
  protected static $view_dir   = 'views';
  protected static $view_arg   = array();
  protected static $ob         = false;

  public static function display_page($path_only = false){
    $class_name = strtolower(static::$class);
    require_once( static::$dir.$class_name.'_actions.php' );
    $action     = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';
    $name       = (empty($action)) ? static::$def_action : $action;
    if(isset($_GET['ver']) && $_GET['ver'] != WEBTRANSFER_VERSION){
      echo json_encode(array('status' => 'need_update', 'error' => 'The server have been updated! reloading...'));
      exit;
    }
    if(!in_array($name, [static::$def_action, 'index', 'logout', 'callback', 'get_site_status_callback', 'registerAppCallback', 'register_application', 'save', 'saved', 'reseted', 'req_reg_app', 'reset'])){
      if(NULL === check_csfr_token()){
        echo json_encode(array('status' => 'need_update', 'error' => 'You have long been inactive on the site, please log in again.'));
        exit;
      }
      if(!check_csfr_token()){
        echo json_encode(array('status' => 'error', 'error' => 'Bad security of request (bad csrf token). Maybe something wrong happened (you are hacked). Please reload page.'));
        exit;
      }
    }
    if(is_callable(array(static::$class.'_Actions', $name))){
      $arg = (array) call_user_func(array(static::$class.'_Actions', $name));
      if(self::isView($name)){
        if(static::$ob)
          ob_flush();
        if(!$path_only)
          self::view($name, $arg);
        else {
          self::view_set_arg($arg);
          return self::view_path($name);
        }
      }
    } else {
      echo _e("Такой страницы не существует");
    }
  }

  public static function view($name, array $arg = array()){
    $file = static::$dir.static::$view_dir.'/'.$name.'.php';
    extract($arg);
    include( $file );
  }

  public static function isView($name){
    return file_exists(static::$dir.static::$view_dir.'/'.$name.'.php');
  }

  public static function view_path($name){
    return static::$dir.static::$view_dir.'/'.$name.'.php';
  }

  public static function view_set_arg($arg){
    static::$view_arg = $arg;
  }

  public static function view_get_arg(){
    return static::$view_arg;
  }

}
