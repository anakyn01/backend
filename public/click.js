$(function(){//문서가 로드되기전에 실행하는걸 방지
    $(".menu-toggle-btn").click(function(){
        $(".gnb").stop().slideToggle("fast");
    });
});