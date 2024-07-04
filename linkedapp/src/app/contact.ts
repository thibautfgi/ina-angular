export class Contact {
    constructor(
        public first_name: string,
        public last_name: string,
        public email: string,
        public gender: string,
        // is optional
        public company?: string,
    ) {}
}
