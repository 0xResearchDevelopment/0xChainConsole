(function () {
    "use strict";
    //_____Calendar Events Intialization

    // sample calendar events data
    var curYear = moment().format('YYYY');
    var curMonth = moment().format('MM');

    // Calendar Event Source
    var sptCalendarEvents = {
      id: 1,
      events: [ {
        id: '6',
        start: curYear + '-' + curMonth + '-23T10:00:00',
        end: curYear + '-' + curMonth + '-24T22:00:00',
        title: 'Product Launch',
        backgroundColor: '#26bf94',
        borderColor: '#26bf94',
        description: 'Chainview product Launch'
      }]
    };
    // Birthday Events Source
    var sptBirthdayEvents = {
      id: 2,
      backgroundColor: 'rgb( 15, 75, 160 )',
      borderColor: 'rgb( 15, 75, 160 )',
      textColor: '#fff',
      events: [{
        id: '7',
        start: curYear + '-' + curMonth + '-24',
        end: curYear + '-' + curMonth + '-26',
        title: 'Launch, Onboarding and Account Setup',
        description: 'Launch, Onboarding and Account Setup'
      }, {
        id: '8',
        start: curYear + '-' + curMonth + '-26',
        end: curYear + '-' + curMonth + '-32',
        title: 'Demonstration and feedback',
        description: 'Demonstration and feedback'
      }]
    };
    var sptHolidayEvents = {
      id: 3,
      backgroundColor: '#b14bd5',
      borderColor: '#b14bd5',
      textColor: '#fff',
      events: [{
        id: '10',
        start: curYear + '-' + curMonth + '-23',
        end: curYear + '-' + curMonth + '-25',
        title: 'Dashara'
      }]
    };
    var sptOtherEvents = {
      id: 4,
      backgroundColor: '#e6533c',
      borderColor: '#e6533c',
      textColor: '#fff',
      events: [{
        id: '13',
        start: curYear + '-' + curMonth + '-29',
        end: curYear + '-' + curMonth + '-30',
        title: 'Maintenance Window'
      }]
    };


    //________ FullCalendar
    var containerEl = document.getElementById('external-events');
    new FullCalendar.Draggable(containerEl, {
      itemSelector: '.fc-event',
      eventData: function (eventEl) {
        return {
          title: eventEl.innerText.trim(),
          title: eventEl.innerText,
          className: eventEl.className + ' overflow-hidden '
        }
      }
    });
    var calendarEl = document.getElementById('calendar2');

    var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      defaultView: 'month',
      navLinks: true, // can click day/week names to navigate views
      businessHours: true, // display business hours
      editable: true,
      selectable: true,
      selectMirror: true,
      droppable: true, // this allows things to be dropped onto the calendar

      select: function (arg) {
        var title = prompt('Event Title:');
        if (title) {
          calendar.addEvent({
            title: title,
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay
          })
        }
        calendar.unselect()
      },
      eventClick: function (arg) {
        if (confirm('Are you sure you want to delete this event?')) {
          arg.event.remove()
        }
      },

      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      eventSources: [sptCalendarEvents, sptBirthdayEvents, sptHolidayEvents, sptOtherEvents,],

    });
    calendar.render();



  })();
