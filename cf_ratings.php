<?php
include_once(dirname(__FILE__)."/functions/cf.php");

$ret=cf_fetch_all_users();
//var_dump($ret);

$series=array();
foreach ($ret as $user => $value) {
    //echo $user;
    $line=array();
    $line["name"]=$user;
    $line["data"]=array();
    foreach ($value as $contest) {
        $line["data"][]=array(doubleval($contest["time"]),doubleval($contest["rating"]));
    }
    $series[]=$line;
}
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>BNUACM CodeForces Rating Page</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Le styles -->
    <link href="css/bootstrap.original.min.css" rel="stylesheet">
    <link href="css/bnuoj.css" rel="stylesheet">
    <link href="css/bootstrap-responsive.min.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <script src="js/jquery-1.9.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/highcharts.js"></script>
    <script src="js/bnuoj-ext.js"></script>

  </head>
  <body>
    <div id="container">
    </div>
  </body>
<script>
$(function () {
    var chart;
    $(document).ready(function() {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                zoomType: 'x',
                height: 550,
                type: 'line'
            },
            title: {
                text: 'CodeForces Rating Line'
            },
            xAxis: {
                labels: {
                    formatter: function () {
                        var date = new Date(this.value);
                        var year = date.getFullYear();
                        var month = date.getMonth()+1;
                        var day = date.getDate();
                        var formattedTime = month + '-' + day;
                        return formattedTime;
                    },
                    style: {}
                },
            },
            yAxis: {
                title: {
                    text: 'Ratings'
                },
                tickInterval: 500,
                plotBands: [
                    { from: 0, to: 1199, color: '#ccc' },
                    { from: 1200, to: 1349, color: '#afa' },
                    { from: 1350, to: 1499, color: '#7f7' },
                    { from: 1500, to: 1699, color: '#aaf' },
                    { from: 1700, to: 1899, color: '#f8f' },
                    { from: 1900, to: 2049, color: '#ffcc88' },
                    { from: 2050, to: 2199, color: '#ffbb55' },
                    { from: 2200, to: 2599, color: '#f77' },
                    { from: 2600, to: 5000, color: '#f33' }
                ]
            },
            tooltip: {
                formatter: function() {
                    var date = new Date(this.x);
                    var year = date.getFullYear();
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var formattedTime = year + '-' + month + '-' + day;

                    return '<b>'+ this.series.name +'</b><br/>'+
                    formattedTime +': '+ this.y;
                }
            },
            legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
                borderWidth: 0
            },
            series: <?=json_encode($series)."\n"?>
        });

        var d = new Date();
        chart.xAxis[0].setExtremes(Date.UTC(d.getFullYear(), d.getMonth()-3, d.getDate()), Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        chart.showResetZoom();
    });
    
});
</script>

</html>