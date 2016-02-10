var LOGSS = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('logSsId'));
var STAFFLIST = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('staffListId')).getSheetByName('Master');



function getMeetings(){
	// Declare variables
	var srMgmt, calendars, start, end, meetings, records;

	// Get list of senior management emails
	srMgmt = NVSL.getRowsData(STAFFLIST).filter(function(e){
		return e.jobClass == 'NV Senior Management';
	});

	// Get calendars for senior management and subscribe if not already
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

	// Write meetings to log
	records = meetings.map(function(e){
		var evt = {
			createdBy: e.getCreators().join(),
			dateCreated: e.getDateCreated(),
			owner: e.getCreators().join(),
			title: e.getTitle(),
			start: e.getStartTime(),
			end: e.getEndTime(),
			guests: parseGuestList(e.getGuestList()).join(),
			eventId: e.getId(),
			description: e.getDescription(),
			location: e.getLocation(),
			calendar: e.getName()
		};
		return evt;
	});
	logSheet = LOGSS.getSheetByName('Jan 2016');
	header = logSheet.getRange(1,1,1,logSheet.getLastColumn());
	NVSL.setRowsData(logSheet, records, header, logSheet.getLastRow() + 1);
}



function parseGuestList(list){
	// Declare variables
	var emails;

	// Get email addresses for guest list
	emails = list.map(function(e){
		return e.getEmail();
	}).filter(function(e){
		return e.search('resource.calendar.google.com') < 0;
	});

	return emails;
}