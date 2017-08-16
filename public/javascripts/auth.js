$(document).ready(function() {

    function logAndDisplayError(xhr, error) {
        console.debug(xhr);
        console.debug(error);
        alert(xhr.status + ' ' + xhr.responseText);
    }

    function loginErrorCallback(xhr, error) {
        if (xhr.status === 404) {
            toastr.error('Invalid Login.', 'Error!');
        } else {
            logAndDisplayError(xhr, error);
        }
    }

    function signupErrorCallback(xhr, error, username) {
        if (xhr.status === 400) {
            var responseText = JSON.parse(xhr.responseText);
            if (responseText !== null && responseText['name'] === 'SequelizeUniqueConstraintError') {
                toastr.error('The user <b>' + username + ' </b>is an existing user. Please choose another one', 'Error!');
            } else {
                logAndDisplayError(xhr, error);
            }
        } else {
            logAndDisplayError(xhr, error);
        }
    }

    function formValuesGiven(serializedFormData) {
        var formValues = {};
        Array.from(serializedFormData).forEach((data) => {
            formValues[data.name] = data.value;
        })
        return formValues;
    }

    function onlyWhitespace(input) {
        return !input.replace(/\s/g, '').length
    }

    $('#loginform').on('submit', function(e) {

        e.preventDefault();

        var formValues = formValuesGiven($(this).serializeArray());

        $.ajax({
            method: "POST",
            url: "/auth/login",
            data: { username: formValues['username'], password: formValues['password'] },
            success: function(data) {
                window.location.replace("/");
            },
            error: loginErrorCallback
        });

    });

    $('#signupform').on('submit', function(e) {

        e.preventDefault();

        var formValues = formValuesGiven($(this).serializeArray());

        var username = formValues['username'];
        var password = formValues['password'];

        if (onlyWhitespace(username) || onlyWhitespace(password)) {
            toastr.error('Username and/or password should not be empty.', 'Error!');
            return false;
        }

        $.ajax({
            method: "POST",
            url: "/auth/register",
            data: { username: username, password: password },
            success: function(data) {
                $('#signupbox').hide();
                $('#loginbox').show();
                toastr.info('User <b>' + username + '</b> successfully created. Please log in.',
                    {timeout: 4000});
            },
            error: function(xhr, error) {
                signupErrorCallback(xhr, error, username);
            }
        });

    });

});