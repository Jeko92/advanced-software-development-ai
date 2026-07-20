function elevator(left: number, right: number, call: number): string {
    return Math.abs(call - right) < Math.abs(call - left) ||
        Math.abs(call - right) == Math.abs(call - left) ? 'right' : 'left';
}
