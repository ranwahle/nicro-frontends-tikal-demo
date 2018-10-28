class shellAppClient {
    constructor() {
    }
}

const myParent = window.parent;

shellAppClient.prototype.notifyLoaded = function (context) {
    const eventManager = myParent ? myParent.microAppsEventsManager : {};

    if (eventManager.dispatch) {
        eventManager.dispatch
        ('loaded', {appName: 'schedule', context: context})
    }
}

shellAppClient.prototype.registerDataService = function (serviceName, executorFunction) {
    if (myParent && myParent.microAppsServiceManager) {
        myParent.microAppsServiceManager.registerService(serviceName, executorFunction)
    }
}
//
// shellAppClient.prototype.requestService = function (serviceName, args) {
//     if (myParent && myParent.microAppsServiceManager) {
//         return myParent.microAppsServiceManager.requestService(serviceName, args)
//     }
// }
//
// shellAppClient.prototype.getTeamGames = function (teamId) {
//     return shellClient.requestService('get-games').then(games => {
//         games = games.filter(game => game.group1.id === teamId || game.group2.id === teamId);
//
//         return games;
//     })
// }

