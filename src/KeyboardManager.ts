export class KeyboardManager {
    private static keyMap: Map<string, boolean> = new Map<string, boolean>();

    public static IsKeyDown(key: string): boolean {
        return this.keyMap.get(key) || false;
    }
    public static Initialize(): void {
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.keyMap.set(event.key, true);
        });
        window.addEventListener("keyup", (event: KeyboardEvent) => {
            this.keyMap.set(event.key, false);
        });
    }
    public static Destroy(): void {
        window.removeEventListener("keydown", (event: KeyboardEvent) => {
            this.keyMap.set(event.key, true);
        });
        window.removeEventListener("keyup", (event: KeyboardEvent) => {
            this.keyMap.set(event.key, false);
        });
        this.keyMap.clear();
    }
    public static Update(): void {
        // this.keyMap.forEach((value, key) => {
        //     console.log(key + " " + value);
        // });
    }
}