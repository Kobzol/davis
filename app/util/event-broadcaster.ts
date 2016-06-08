export class EventBroadcaster
{
    private listeners: any[] = [];

    notify(...args: any[])
    {
        this.listeners.forEach((listener) => listener.apply(undefined, args));
    }
    subscribe(listener: any)
    {
        this.listeners.push(listener);
    }
}
