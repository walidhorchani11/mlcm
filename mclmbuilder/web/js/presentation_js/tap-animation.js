/*
/!**
 * Created by argo on 18/01/17.
 *!/
$( document ).ready(function() {
/!*******************************************Animation_Tap**********************************************************!/
$(".sl-block").each(function () {
    if($(this).attr("data-block-anim")=="tap" &&  $(this).find((".sl-block-content")).attr("data-animation-type") != undefined && $(this).find((".sl-block-content")).attr("data-animation-type").indexOf("-tap")== -1)
    {
      //  ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out") ? $(this).find(".sl-block-content").show() : $(this).find(".sl-block-content").hide();
        (($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out") || ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit") ) ? $(this).find(".sl-block-content").css('opacity','1') : $(this).find(".sl-block-content").css('opacity','0') ;
        $(this).find((".sl-block-content")).attr("data-animation-type-tap",$(this).find((".sl-block-content")).attr("data-animation-type")+"-tap").removeAttr('data-animation-type');
        $(this).find(".sl-block-content").css( "transition-delay" ,'' );
        $(this).find(".sl-block-content").css( "transition-duration" ,'' );
    }
    else
        if( $(this).attr("data-block-anim")!="tap"  &&  ($(this).find((".sl-block-content")).attr("data-animation-type") == "fade-out-edit") )
        {
         $(this).find((".sl-block-content")).attr("data-animation-type","fade-out");
        }
});
/!***********************************************************************************************************************!/
$(".sl-block").click(function(){
    console.log("click");
    $(this).find(".sl-block-content").css('opacity','');
    var TypeAnimation= $(this).find((".sl-block-content")).attr("data-animation-type-tap");
    if(TypeAnimation != undefined)
    {
        var TDuration =parseInt($(this).find((".sl-block-content")).attr("data-duration-tap") );
        var Tdelay =parseInt( $(this).find((".sl-block-content")).attr("data-delay-tap"));
        if (TypeAnimation =="fade-in-tap")
        {   //console.log(TDuration);
            $(this).find(".sl-block-content").hide();
            $(this).find(".sl-block-content").delay( Tdelay ).fadeIn(TDuration);
        }
        else if ((TypeAnimation =="fade-out-tap") || (TypeAnimation =="fade-out-edit-tap"))
        {
            $(this).find(".sl-block-content").css('opacity','1').css('display','block');
            if($(this).find(".sl-block-content").css('opacity')=='1' &&  $(this).find(".sl-block-content").css('display')=='block'){
                $(this).find(".sl-block-content").delay( Tdelay ).fadeOut(TDuration);}
        }
        else if (TypeAnimation =="slide-up-tap")
        {
            $(this).find(" .sl-block-content").hide();
            $(this).find(" .sl-block-content").delay(Tdelay).show("slide", { direction: "down" }, TDuration);
        }
        if (TypeAnimation =="slide-down-tap")
        {
            $(this).find(" .sl-block-content").hide();
            $(this).find(" .sl-block-content").delay(Tdelay).show("slide", { direction: "up" }, TDuration);
        }
        else if (TypeAnimation =="slide-right-tap")
        {
            $(this).find(" .sl-block-content").hide();
            $(this).find(".sl-block-content").delay(Tdelay).show("slide", {
                direction: "left"
            }, TDuration);
        }
        else if (TypeAnimation =="slide-left-tap")
        {
            $(this).find(" .sl-block-content").hide();
            $(this).find(".sl-block-content").delay(Tdelay).show("slide", {
                direction: "right"
            }, TDuration);
        }
        else if (TypeAnimation =="scale-up-tap")
        {
            $(this).find(" .sl-block-content").hide();
            $(this).find(".sl-block-content ").delay(Tdelay).show('scale', {direction: 'horizontal'});
        }
        else if (TypeAnimation =="scale-down-tap")
        {
            $(this).find(".sl-block-content").hide();
            $(this).find(".sl-block-content ").delay(Tdelay).show("scale",
                {percent: 130, direction: 'horizontal'},TDuration);
        }
    }
});
/!********************************END_Animation_Tap*****************************************************************!/
});*/
