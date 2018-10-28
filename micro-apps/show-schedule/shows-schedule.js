document.addEventListener('DOMContentLoaded', () => {

    const getSchedule = () => {
        return fetch('http://api.tvmaze.com/schedule/full')
    }

    const getShowsSchedule = () => {
        return getSchedule().then(res => {
            console.log('schedule', res)
           return res.json().then(schedule => {
                console.log('schedule', schedule)
                const shows = schedule.map(showAirTime => {
                    const show = {...showAirTime._embedded.show}
                    show.airTime = showAirTime.airstamp;
                    show.episodeName = showAirTime.name;
                    show.season = showAirTime.season;
                    return show;
                });
                return shows;
            })
        })
    }

    document.getElementById('btnGetSchedule').addEventListener('click', () => {
        getShowsSchedule().then(shows => {
            console.log('shows', shows)
            const showsDiv = document.getElementById('schedules')
            shows.forEach(show => {
                const showElement = document.createElement('div')
                showElement.innerHTML = `<a href="${show._links.self.href}"> Name: ${show.name} - ${show.episodeName}</a>`

                showsDiv.append(showElement)
            })
        })
    })

    const shellClient = new shellAppClient();
    shellClient.notifyLoaded(window);
    shellClient.registerDataService('get-schedules',getShowsSchedule )
})