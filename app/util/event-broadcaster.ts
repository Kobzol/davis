export class EventBroadcaster<T>
{
    private listeners: any[] = [];

    notify(value: T)
    {
        this.listeners.forEach((listener) => listener.apply(undefined, value));
    }
    subscribe(listener: any)
    {
        this.listeners.push(listener);
    }
}
