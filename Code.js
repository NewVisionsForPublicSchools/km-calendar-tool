var LOGSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('logSsId'));
var STAFFLIST = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('staffListId')).getSheetByName('Master');



function getMeetings(){
	// Declare variables
	var srMgmt, calendars, start, end, meetings;

	// Get list of senior management emails
	srMgmt = NVSL.getRowsData(STAFFLIST).filter(function(e){
		return e.jobClass == 'NV Senior Management';
	});

	// Get calendars for senior management
	calendars = srMgmt.map(function(e){
		var cal = CalendarApp.getCalendarById(e.workEmail);
		var toss = !cal ? (CalendarApp.subscribeToCalendar(e.workEmail), CalendarApp.getCalendarById(e.workEmail)) : cal;
		return toss;
	});

	// Get meetings for senior management and filter for at least two participants
	start = new Date('2016', '0', '1');
	end = new Date('2016', '1', '1');
	meetings = calendars.map(function(e){
		return e.getEvents(start, end);
	}).reduce(function(a,b){
		return a.concat(b);
	}).filter(function(e){
		return e.getGuestList().length > 0;
	});
	debugger;

	// Write meetings to log
}