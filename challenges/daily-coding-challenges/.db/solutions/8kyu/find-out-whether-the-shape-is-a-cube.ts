function cubeChecker(volume: number, side: number): boolean {
    if (side <= 0) {
        return false;
    }
    return side * side * side == volume;
}
