function solve(arr: string[]): string {
    const dates: Date[] = arr.map((x: string) => {
        const date: Date = new Date('01/01/2000');
        date.setHours(Number(x.slice(0, 2)));
        date.setMinutes(Number(x.slice(3)));
        return date;
    }).sort((a: Date, b: Date) => a.getTime() - b.getTime());
    const duration: number = dates[dates.length - 1].getTime() - dates[0].getTime();
    const minutes: number = Math.floor((duration / (1000 * 60)) % 60);
    const hours: number = Math.floor((duration / (1000 * 60 * 60)) % 24);
    return `${hours}:${minutes}`;
}
