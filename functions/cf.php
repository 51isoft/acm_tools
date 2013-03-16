<?php
//put some global functions here
include_once(dirname(__FILE__)."/global.php");
include_once(dirname(__FILE__)."/simple_html_dom.php");

function cf_crawl_data($user) {
    $url="http://codeforces.com/profile/".$user;
    $content=file_get_contents($url);
    if (strstr($content,"data.push")===false) return false;
    $pos1=strpos($content,"data.push(")+strlen("data.push(");
    $pos2=strpos($content,");",$pos1);
    $str=substr($content,$pos1,$pos2-$pos1);
    $res=json_decode($str);
    return $res;
}

function cf_fetch_all_users() {
    global $db;
    $ret=array();
    foreach ((array) $db->get_results("select * from cf_ratings order by time asc",ARRAY_A) as $value) {
        $ret[$value["username"]][]=$value;
    }
    return $ret;
}

?>