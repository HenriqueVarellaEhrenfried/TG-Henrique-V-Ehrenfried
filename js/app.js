var fs = require('fs')
var util  = require('util'),
    spawn = require('child_process').spawn


global.pyResult
global.datahandled
global.pythonCall = null
global.selected = {} //Hash that the key is the number of actor of datahandled+1 and the value is the selected parameters


Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function (){
    $('#textarea1').val('I like pizza. I like chocolate. I like to play games. Harry is a wizard');
    $('#textarea1').trigger('autoresize');
    $('select').material_select();
    $('.progress').hide();
    $('#show_result').hide();
})
function selectPythonCall(){
    if (document.getElementById('config1').checked){
        return 'python'
    }
    else{
        if(document.getElementById('config2').checked){
            return 'python3'
        }
        else{
            alert('Please set how python 3.5.X is called in your system')
            return 'none'
        }
    }

}
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

function extractData(json){
    var data = []
    var index = 1
    json.forEach(function(j){
      var temporary = {}
      var flag = 0      
      temporary['id']= index
      temporary['label'] = j.actor.capitalizeFirstLetter()
      temporary['actor']=j.actor
      temporary['action']=[]
      temporary.action.push(j.action+" "+j.complement)
      for (var i = 0; i < data.length;i++){
          if (data[i].label==temporary.label){
              data[i].action.push(temporary.action[0])
              flag=1
          }
      }
      if (flag==0){
        data.push(temporary)
        index=index+1
      }
    })
    global.datahandled = data    
    for (var i = 0; i < global.datahandled.length; i++){
        global.selected[i+1] = [];
    }
    return (data)
}

function analyseText(text){
    $('.progress').show();
    var python = selectPythonCall()
    var python = spawn(python, ["TG.py", text])   // TODO: Finish to build this part!!
    python.stdout.on('data', function (temp_result) {    // register one or more handlers
        global.pyResult = JSON.parse("" + temp_result)
        $('.progress').hide();
        $('#show_result').show();
        console.log(global.pyResult);
        datas = extractData(global.pyResult)

        var sel = document.getElementById('use_cases');
        var fragment = document.createDocumentFragment();

        datas.forEach(function(data, index) {
            var opt = document.createElement('option');
            opt.innerHTML = data.label;
            opt.value = data.id;
            fragment.appendChild(opt);
        });
        sel.appendChild(fragment);
        $('select').material_select();
    });
}
function triggerPython(){
    var enviroment = selectPythonCall()
    if (enviroment!='none'){
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
    else{
        alert("Please set how Python 3.5.X is called in your system")
    }
}
function set_active(){
    console.log()
}
function displayUseCases(ind){
    console.log(global.selected)
    var sel = document.getElementById('uc');
    var fragment = document.createDocumentFragment();
    var datas = global.datahandled[ind-1].action
    var id = 1
    $('.collection-item').remove()
    datas.forEach(function(data, index) {
        var opt = document.createElement('li');
        opt.innerHTML = data;

        var arrIndx = global.selected[String(ind)].indexOf(String(id))
        if (arrIndx > -1) {
            opt.className = "collection-item active";
        }
        else{
             opt.className = "collection-item";
        }        
        opt.onclick = function () {
            var elClass = this.className
            if(elClass.split(" ").length > 1){
                var value = this.getAttribute('value');
                var actor = $('select').val()
                var arrInd = global.selected[String(actor)].indexOf(value)
                if (arrInd > -1) {
                    global.selected[String(actor)].splice(arrInd, 1)
                }
                this.className = "collection-item"
            }
            else{
                var value = this.getAttribute('value');
                var actor = $('select').val()
                global.selected[String(actor)].push(value)
                this.className+=" active"
            }
        };
        opt.id = "cl-itm"
        opt.value = id;
        id = id + 1;
        fragment.appendChild(opt);
    });
    sel.appendChild(fragment);
}

function reset(){
    $('option').remove();
    $('select').material_select();
    $('.collection-item').remove()
    $('#show_result').hide();
}
function createXML(){
    var ind = 1
    var xmlUC = "<Software>"
    var total = Object.keys(global.selected).length    
    var j = 0;
    while (ind <= total){
        var selectedUC = global.selected[String(ind)]
        xmlUC+="\n\t<Actor>\n\t\t"+global.datahandled[ind-1].actor+"\n\t</Actor>"
        while(j < selectedUC.length){            
            xmlUC+="\n\t<UseCase>\n\t\t"+global.datahandled[ind-1].action[selectedUC[j]-1]+"\n\t</UseCase>"
            j++
        }
        j = 0;
        ind++
    } 
    xmlUC+="\n</Software>"
    $.getScript("js/download.js", function(){

        download(xmlUC,"SoftwareUseCases.xml","text/plain")

    });
}