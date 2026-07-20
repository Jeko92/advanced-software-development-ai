function setAlarm(employed: boolean, vacation: boolean): boolean {
    return employed && !vacation ? true : false;
}
