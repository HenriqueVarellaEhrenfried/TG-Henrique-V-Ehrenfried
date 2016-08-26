var fs = require('fs')
var util  = require('util'),
    spawn = require('child_process').spawn

global.pyResult
global.datahandled
global.pythonCall = null


Array.prototype.contains = function(element){
    return this.indexOf(element) > -1;
};
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function (){
    $('#textarea1').val('A Company needs a new system called, Payroll System, to allow employees to record timecard information electronically and automatically generate paychecks based on the number of hours worked and total amount of sales(for commissioned employees). The new system will be state of art and will have a Windows-based desktop interface to allow employees to enter timecard information, enter purchase orders, change employee preferences (such as payment method) and create various reports. The system will run on individual employee desktops throughout the entire company.The system will retain information on all employees in the company. The system must pay each employee the correct amount, on time, by the method that they specify.Some employees work by the hour and are paid an hourly rate. They submit timecards that record the date and number of hours worked for a particular charge number. Some employees are paid a flat salary. Even though they are paid a flat salary, they submit timecards that record the date and hours worked. Some of the salaried employees also receive a commission based on their sales. They submit purchase orders that reflect the date and amount of the sale.One of the most requested features of the new system is employee reporting.Employees will be able to query the system for hours worked, totals of all hours billed to a project, total pay received year to date, etc.,Employees can choose their method of payment. They can have their paychecks mailed to the postal address of their choice, or they can request direct deposit and have their paycheck deposited into a bank account of their choosing. The employee may also choose to pick their paychecks up at the offices. The Payroll Administrator maintains employee information. He is responsible for adding new employees, deleting employees and changing all employee information such as name, address and payment classification(hourly, salaried, commissioned), as well as running administrative reports.The Payroll application will run automatically every Friday and on the last working day of month. It will pay the appropriate employees on those days. The system will be told what date employees are to be paid, so it will generate payments for records from the last time the employee was paid to the specified date. The new system is being designed so that the payroll will always be generated automatically and there will be need for any manual intervention');
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

function displayUseCases(ind){
    var sel = document.getElementById('uc');
    var fragment = document.createDocumentFragment();
    var datas = global.datahandled[ind-1].action
    var id = 1
    $('.collection-item').remove()
    datas.forEach(function(data, index) {
        var opt = document.createElement('li');
        opt.innerHTML = data;
        opt.className = "collection-item";
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