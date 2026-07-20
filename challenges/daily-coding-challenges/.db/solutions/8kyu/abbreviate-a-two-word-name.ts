function abbrevName(name: string): string {
    return `${name.charAt(0).toUpperCase()}.${name.charAt(name.indexOf(' ') + 1).toUpperCase()}`;
}
