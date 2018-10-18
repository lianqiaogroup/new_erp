var _region = $("#_region").val();
//window.onerror = function(){return true;}
//function $(id){return document.getElementById(id);}
//function getHeight(){$("fahuo").style.height=$("forml").offsetHeight-85+"px";}
//window.onload = function(){getHeight();}
/*///////////////////////////////////////// ORDERJSFGX /////////////////////////////////////////*/
function postcheck(){

    try{
        if (document.form.name.value==""){
            alert('請填寫姓名！');
            document.form.name.focus();
            return false;
        }
        var name = /^[a-zA-Z\u4e00-\u9fa5\s]{2,}$/;
        if (!name.test(document.form.name.value)){
            alert('姓名格式不正確，請重新填寫！');
            document.form.name.focus();
            return false;
        }
    }
    catch(ex){
    }

    try{
        if (document.form.mob.value==""){
            alert('請填寫手機號碼！');
            document.form.mob.focus();
            return false;
        }
        switch(_region){
            case "台灣":
                if (/^09/.test(document.form.mob.value) && !/^\d{10}$/.test(document.form.mob.value)) {
                    alert('手機號碼格式不正確，請重新填寫！');
                    document.form.mob.focus();
                    return false;
                }
                if (!/^0\d{6,10}/.test(document.form.mob.value)) {
                    alert('手機號碼格式不正確，請重新填寫！');
                    document.form.mob.focus();
                    return false;
                }
                break;
            case "香港":

                break;
        }
    }
    catch(ex){
    }
    try{
        if (document.form.province.value==""){
            alert('请选择所在地区！');
            document.form.province.focus();
            return false;
        }
    }
    catch(ex){
    }
    try{
        if (document.form.address.value==""){
            alert('请填写详细地址！');
            document.form.address.focus();
            return false;
        }
    }
    catch(ex){
    }   
    return true;
}



/*///////////////////////////////////////// ORDERJSEND /////////////////////////////////////////*/
