function summation(num: number): number {
    let res: number = 0;
    while (num > 0) {
        res += num;
        num--;
    }
    return res;
}
