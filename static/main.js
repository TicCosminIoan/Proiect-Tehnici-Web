
function validate_url(str)
{
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    
    if (str.match(regex)) {
      return true;
    } else {
      return false;
    }
}


$(function()
{
    $("#create_game_form").submit(function(e){
        e.preventDefault()
        var has_error=false;
        $(".error_message").remove()

        if($("#name").val())
        {
                has_error=true;
                $("#name").parent().append($(`<span class="error_message"></span>`).html("Required field."))

        }

        if(!validate_url($("#site_link").val()))
        {
                has_error=true;
                $("#site_link").parent().append($(`<span class="error_message"></span>`).html("This field requires a link."))

        }

        if(!validate_url($("#gameplay_link").val()))
        {
                has_error=true;
                $("#gameplay_link").parent().append($(`<span class="error_message"></span>`).html("This field requires a link."))

        }

        if(!validate_url($("#artwork").val()))
        {
                has_error=true;
                $("#artwork").parent().append($(`<span class="error_message"></span>`).html("This field requires a link."))

        }


        if(!has_error)
        {
            e.target.submit()
        }

        }  
    )
    
}

)