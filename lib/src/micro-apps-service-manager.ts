import {MicroAppService} from './model/micro=app-service';

export class MicroAppsServiceManager {
    private services: {[serviName: string]: MicroAppService} = {};

    registerService(serviceName: string, executeFn: (...args: any[]) => Promise<any>) {
            if (this.services[serviceName]) {
                console.error(`Service ${serviceName} already registered`)
            } else {
                this.services[serviceName] = {serviceName: serviceName, invokeMethod: executeFn }
            }
    }

    requestService(serviceName: string, ...args: any[]) : Promise<any> {
        if (!this.services[serviceName]) {
            throw({message: `Service ${serviceName} is not registered`})
        }
        const result = this.services[serviceName].invokeMethod(args);
        console.log('service', serviceName, result)
        return result;
    }
}