function validate_url(str) {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  return !!str.match(regex);
}

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('scroll', function() {
    let header = document.getElementsByTagName('header')[0];
    let cutoff = header.getBoundingClientRect().height - 53;

    let y = window.scrollY;
    if (y > cutoff) y = cutoff;

   header.style.transform = 'translateY(' + (y * -1) + 'px)';
  });

  let timeout;
  function randomSpin() {
    let duration = Math.floor(Math.random() * 2000) + 1000;
    let animation = (duration % 2) + 1;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      document.querySelector('.rotation').style.animation = duration + 'ms linear'  +' '+ 'spin' + animation;

      randomSpin();
    }, duration);
  }
  if (document.querySelector('.rotation')) {
    randomSpin();
  }

    $('.delete').click(function (e) {
      e.preventDefault();
      var target = $(e.target);

      $.post(target.attr('href'), {}, function (data) {
        console.log(data);
        if (data.success) {
          target.parent().addClass('removed');
          setTimeout(() => {
            target.parent().remove();
          }, 2000)
        }
      })
    })


    $("#create_game_form").submit(function (e) {
        e.preventDefault();

        var has_error = false;
        $(".error_message").remove()

        if (!$("#name").val()) {
          has_error = true;
          $("#name").parent().append($(`<span class="error_message"></span>`).html("Required field."))
        }

        if (!$("#developer").val()) {
          has_error = true;
          $("#developer").parent().append($(`<span class="error_message"></span>`).html("Required field."))
        }

        if (!$("#image").val()) {
          has_error = true;
          $("#image").parent().append($(`<span class="error_message"></span>`).html("Required field."))

        }

        if (!$("#category").val()) {
          has_error = true;
          $("#category").parent().append($(`<span class="error_message"></span>`).html("Required field."))

        }


        if (!validate_url($("#url_site").val())) {
          has_error = true;
          $("#url_site").parent().append($(`<span class="error_message"></span>`).html("This field requires a link."))

        }

        if (!validate_url($("#url_video").val())) {
          has_error = true;
          $("#url_video").parent().append($(`<span class="error_message"></span>`).html("This field requires a link."))
        }

        if (!has_error) {
          e.target.submit()
        } else {
          document.getElementsByClassName('error_message')[0].scrollIntoView();
        }

      }
    )

  }
)
