// Create a function that gives a personalized greeting. This function takes two parameters: name and owner.

function greet(name: string, owner: string): string {
    return name === owner ? 'Hello boss' : 'Hello guest';
}
