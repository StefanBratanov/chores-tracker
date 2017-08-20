$(document).ready(function() {

    function reloadPage(data) {
        location.reload();
    }

    function errorCallback(xhr, error) {
        if (xhr.status === 401) {
            window.location.replace('/login');
            return;
        }
        console.debug(xhr);
        console.debug(error);
        alert(xhr.status + ' ' + xhr.responseText);
    }

    t = $('#chorelist').DataTable({
        "language": {
            "emptyTable": "No chores. You can start adding by clicking on the \"Add new chore\" button"
        },
        "order": [],
        "columnDefs": [
            { "orderable": false, "className": "dt-center", "targets": "_all" },
            {
                "data": null,
                "defaultContent": "<button type=\'button\' class=\'updateRow btn btn-success\'><span class=\'fa fa-check\'></span></button>" +
                    "<button type=\'button\' style=\'margin-left:1%;\' data-provide=\'datepicker\' data-date-end-date=\'0d\' class=\'updateRowWithDatepicker btn btn-info\'><span class=\'fa fa-calendar\'></span></button>",
                "targets": -2
            },
            {
                "data": null,
                "defaultContent": "<button type=\'button\' class=\'deleteRow btn btn-danger\'><span class=\'fa fa-trash\'></span></button>",
                "targets": -1
            }
        ]
    });

    buttonsModal = {
        cancel: {
            label: '<i class="fa fa-times"></i> Cancel',
            className: 'btn-danger'
        },
        confirm: {
            label: '<i class="fa fa-check"></i> Confirm',
            className: 'btn-success'
        }
    }

    $("#logout").click(function() {
        $.ajax({
            url: "/auth/logout",
            type: 'GET',
            success: function(data) {
                window.location.replace('/login');
            },
            error: errorCallback
        });
    });

    $('#addChore').on('click', function() {
        bootbox.prompt({
            title: "Add New Chore",
            buttons: buttonsModal,
            callback: function(result) {
                if (result === null) {
                    return;
                }
                if (!result.replace(/\s/g, '').length) {
                    toastr.error('A Chore should not be empty.', 'Error!')
                    return false;
                }

                function choreExists() {
                    var flag = false;
                    $.ajax({
                        url: "/api/chores",
                        type: 'GET',
                        success: function(data) {
                            var allChores = data.map(function(data) {
                                return data.chore;
                            });
                            flag = allChores.some(chore => chore.trim() === result.trim());
                        },
                        error: errorCallback,
                        async: false
                    });
                    return flag;
                }

                if (choreExists()) {
                    toastr.warning('<b>' + result + '</b> chore already exists.');
                    return false;
                }

                //should not call this if there is error in getting the chores
                $.ajax({
                    method: "POST",
                    url: "/api/chores",
                    data: { chore: result },
                    success: reloadPage,
                    error: errorCallback
                });
            }
        });
    });

    function completeChoreAjaxCall(choreName, completedDate) {
        $.ajax({
            method: "PUT",
            url: "/api/chores",
            data: { chore: choreName, lastcompleted: completedDate },
            success: reloadPage,
            error: errorCallback
        });
    }

    $('#chorelist tbody').on('click', 'button.updateRow.btn.btn-success', function() {
        var buttonDom = this;
        var trRow = $(buttonDom).parents('tr');
        var choreName = trRow.children().eq(0).text();
        bootbox.confirm({
            title: "Complete this chore?",
            message: "Are you sure you have completed <b>" + choreName + "</b>?",
            buttons: buttonsModal,
            callback: function(result) {
                if (result === true) {
                    completeChoreAjaxCall(choreName, new Date());
                }
            }
        });
    });

    $('#chorelist tbody').on('changeDate', 'button.updateRowWithDatepicker.btn.btn-info', function(ev) {
            var completedDate = ev.date;
            var buttonDom = this;
            var trRow = $(buttonDom).parents('tr');
            var choreName = trRow.children().eq(0).text();
            bootbox.confirm({
                title: "Complete this chore?",
                message: "Are you sure you have completed <b>" + choreName + "</b> on " + moment(completedDate).format('Do MMM YYYY') + "?",
                buttons: buttonsModal,
                callback: function(result) {
                    if (result === true) {
                        completeChoreAjaxCall(choreName, completedDate);
                    }
                }
            });
        });

    $('#chorelist tbody').on('click', 'button.deleteRow.btn.btn-danger', function() {
        var buttonDom = this;
        var trRow = $(buttonDom).parents('tr');
        var choreName = trRow.children().eq(0).text();
        bootbox.confirm({
            title: "Delete this chore?",
            message: "Are you sure you want to delete <b>" + choreName + "</b> ? This cannot be undone",
            buttons: buttonsModal,
            callback: function(result) {
                if (result === true) {
                    $.ajax({
                        method: "DELETE",
                        url: "/api/chores",
                        data: { chore: choreName },
                        success: reloadPage,
                        error: errorCallback
                    });
                }
            }
        });
    });

});