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
        document.getElementById('textarea').style.display = 'none';
        document.getElementById('uploader').style.display = 'block';

    } 
    else {
        document.getElementById('uploader').style.display = 'none';
        document.getElementById('textarea').style.display= 'block';
    }
};
function analyseText(text){
    var python = spawn('python', ["TG.py", text])   // TODO: Finish to build this part!!
    python.stdout.on('data', function (temp_result) {    // register one or more handlers
        global.pyResult = "" + temp_result
        console.log(global.pyResult);
        alert(text)
    });
}
function triggerPython(){
    if (document.getElementById('test1').checked){
        var file = $("#file_uploader").val()
        var file_splitted = file.split('.')
        if (file_splitted[file_splitted.length-1]=="txt"){
            fs.readFile(file, 'utf8', function (err,file_read) {
                if (err) {
                    return console.log(err);
                }
                 analyseText(file_read)          
            });
        }
        else{
            alert("File format is incorrect, please upload a .txt file")
        }     
        
    }
    else{
        var text = $("#textarea1").val()
        analyseText(text)
    }
}