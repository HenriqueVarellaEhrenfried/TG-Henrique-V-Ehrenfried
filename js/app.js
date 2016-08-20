var fs = require('fs')
var util  = require('util'),
    spawn = require('child_process').spawn

global.pyResult

$(document).ready(function (){
    $('#textarea1').val('New Text');
    $('#textarea1').trigger('autoresize');
    $('select').material_select();
})
function yesCheck() {
    if (document.getElementById('test1').checked) {
        document.getElementById('ies').style.display = 'none';
        document.getElementById('state').style.display = 'block';

    } 
    else {
        document.getElementById('state').style.display = 'none';
        document.getElementById('ies').style.display= 'block';
    }
};
function triggerPython(){
    if (document.getElementById('test1').checked){
        var file = $("#file_uploader").val()
        var file_splitted = file.split('.')
        if (file_splitted[file_splitted.length-1]=="txt"){
            fs.readFile(file, 'utf8', function (err,file_read) {
                if (err) {
                    return console.log(err);
                }
                var python = spawn('python', ["TG.py", file_read])   
                python.stdout.on('data', function (temp_result) {    // register one or more handlers
                    global.pyResult = "" + temp_result
                    console.log(global.pyResult);
                });            
            });
        }
        else{
            alert("File format is incorrect, please upload a .txt file")
        }     
        
    }
    else{
        var text = $("#textarea1").val()
    }
    console.log(text)
}
// function get_values() {
//     var selectedYears = $('#year_select').val();
    
//     var selectedStates = []; 
//     $('#state_select :selected').each(function(i, selected){ 
//       selectedStates[i] = $(selected).text(); 
//     });

//     var selectedIes = []; 
//     $('#ies_select :selected').each(function(i, selected){ 
//       selectedIes[i] = $(selected).text(); 
//     });

//     var selectedQueries = $('#query_select').val();

//     console.log(selectedYears);
//     console.log(selectedStates);
//     console.log(selectedIes);
//     console.log(selectedQueries);
// }