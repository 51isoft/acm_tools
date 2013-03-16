<?php
include_once(dirname(__FILE__)."/../functions/global.php");
include_once(dirname(__FILE__)."/../functions/cf.php");

foreach ($config["cf"]["user_list"] as $user) {
    $data=cf_crawl_data($user);
    if ($data===false) continue;
    foreach ($data as $value) {
        $ctime=$value[0];
        $rating=$value[1];
        $contest=$value[4];
        $rank=$value[6];
        $db->query("select * from cf_ratings where username='".$db->escape($user)."' and time='".$db->escape($ctime)."'");
        if ($db->num_rows) continue;
        $db->query("insert into cf_ratings set username='".$db->escape($user)."'
                                        , rating='".$db->escape($rating)."'
                                        , time='".$db->escape($ctime)."'
                                        , rank='".$db->escape($rank)."'
                                        , contest='".$db->escape($contest)."'");
    }
}

?>
