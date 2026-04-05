export interface IConfigurationEntity {
    app: {
        port: number;
    };

    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };

    jwt: {
        secret: string;
        expiresIn: string;
    };
}
