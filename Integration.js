function onOpen(){
  SpreadsheetApp.getUi().createMenu('Bisk')
  .addItem('Format Chase CSV', 'formatChase')
  .addToUi();
}

function formatChase(){}

function analyze() {
  console.warn('<<<<<<<<<< ' + new Date)
  var sheet_name = 'Analysis',
      range = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name).getDataRange(),
      values = range.getValues(),
      n_rows = values.length,
      n_cols = values[0].length,
      headers = 1;
  
  return values.slice(headers).map(function(row, i){
    var what = row[0],
        when = row[1],
        
        amount = +what.match(/\d+\.?\d*/)[0],
        merchant = what.replace(/^.+at /,'').replace(/\.\.\.$/,'');
    
    return [amount, merchant]
    // TODO: cluster merchants
  });
}

//function mailSearch(){
//  var year = 2019,
//      dates = GmailApp.search('from:southwest after:'+year).map(function(thread){
//    return thread.getMessages().map(function(message){
//      return message.getPlainBody().match(new RegExp('\\d+/\\d+/'+year))
//      return [message.getDate(), message.getSubject()]
//    });
//  });
//  Logger.log(dates)
//}


//Logger: [19-02-11 18:20:43:037 PST] 
//[[Denver, Mon Jan 07 13:00:00 GMT-08:00 2019], 
//[Washington, D.C., Mon Jan 07 17:10:00 GMT-08:00 2019], 
//[Atlanta, Fri Jan 11 13:40:00 GMT-08:00 2019], 
//[Los Angeles, Fri Jan 11 16:40:00 GMT-08:00 2019], 
//[Puerto Vallarta, Thu Jan 31 11:35:00 GMT-08:00 2019], 
//[Los Angeles, Mon Feb 04 15:40:00 GMT-08:00 2019]]
function calSearch(){
  var events = CalendarApp.getDefaultCalendar().getEvents(new Date('Jan 01 2019'), new Date, {search:'flight'}).map(function(event){
    return [event.getTitle().replace(/^Flight to /,'').replace(/ \(.+$/, ''), event.getStartTime()];
  });
  Logger.log(events)
}